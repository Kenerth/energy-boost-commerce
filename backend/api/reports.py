"""
Módulo de Reportes
API REST - Energy Boost Commerce

Endpoints:
- GET /api/reports/ventas - Ventas por período
- GET /api/reports/productos-mas-vendidos - Productos más vendidos
- GET /api/reports/clientes-frecuentes - Clientes frecuentes
- GET /api/reports/inventario - Resumen de inventario
- GET /api/reports/dashboard - Dashboard completa (admin/vendedor)
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from api.helpers import get_user_id
from models import db, Pedido, PedidoDetalle, Producto, Usuario
from sqlalchemy import func
from datetime import datetime, timedelta

# Blueprint para reportes
reports_bp = Blueprint('reports', __name__, url_prefix='/api/reports')


def check_admin_or_vendedor():
    """Verifica si el usuario es admin o vendedor"""
    usuario_id = get_user_id()
    usuario = Usuario.query.get(usuario_id)
    return usuario and usuario.rol in ['administrador', 'vendedor']


# ================== VENTAS POR PERÍODO ==================

@reports_bp.route('/ventas', methods=['GET'])
@jwt_required()
def ventas_por_periodo():
    """Reporte de ventas por período (día, semana, mes)"""
    if not check_admin_or_vendedor():
        return jsonify({'error': 'Solo admin/vendedor puede ver reportes'}), 403
    
    periodo = request.args.get('periodo', 'mes')  # dia, semana, mes
    meses = int(request.args.get('meses', 6))  # cuántos meses atrás
    
    # Calcular fecha inicio
    if periodo == 'dia':
        fecha_inicio = datetime.utcnow() - timedelta(days=30)
        group_by = func.date(Pedido.created_at)
    elif periodo == 'semana':
        fecha_inicio = datetime.utcnow() - timedelta(weeks=12)
        group_by = func.strftime('%Y-%W', Pedido.created_at)  # Año-semana
    else:  # mes
        fecha_inicio = datetime.utcnow() - timedelta(days=meses*30)
        group_by = func.strftime('%Y-%m', Pedido.created_at)  # Año-mes
    
    # Query de pedidos completados
    query = db.session.query(
        group_by.label('periodo'),
        func.count(Pedido.id).label('pedidos'),
        func.sum(Pedido.total).label('ventas')
    ).filter(
        Pedido.estado.notin_(['cancelled']),
        Pedido.created_at >= fecha_inicio
    ).group_by('periodo').order_by('periodo')
    
    resultados = query.all()
    
    return jsonify({
        'periodo': periodo,
        'ventas': [
            {
                'periodo': r.periodo,
                'pedidos': r.pedidos,
                'ventas': float(r.ventas or 0)
            }
            for r in resultados
        ],
        'resumen': {
            'total_pedidos': sum(r.pedidos for r in resultados),
            'total_ventas': sum(float(r.ventas or 0) for r in resultados)
        }
    }), 200


# ================== PRODUCTOS MÁS VENDIDOS ==================

@reports_bp.route('/productos-mas-vendidos', methods=['GET'])
@jwt_required()
def productos_mas_vendidos():
    """Reporte de productos más vendidos"""
    if not check_admin_or_vendedor():
        return jsonify({'error': 'Solo admin/vendedor puede ver reportes'}), 403
    
    limite = int(request.args.get('limite', 10))
    meses = int(request.args.get('meses', 6))
    
    fecha_inicio = datetime.utcnow() - timedelta(days=meses*30)
    
    # Query de detalles de pedidos
    query = db.session.query(
        PedidoDetalle.producto_id,
        Producto.nombre,
        func.sum(PedidoDetalle.cantidad).label('cantidad_vendida'),
        func.sum(PedidoDetalle.subtotal).label('ingresos')
    ).join(
        Producto, PedidoDetalle.producto_id == Producto.id
    ).join(
        Pedido, PedidoDetalle.pedido_id == Pedido.id
    ).filter(
        Pedido.estado.notin_(['cancelled']),
        Pedido.created_at >= fecha_inicio
    ).group_by(
        PedidoDetalle.producto_id, Producto.nombre
    ).order_by(
        func.sum(PedidoDetalle.cantidad).desc()
    ).limit(limite)
    
    resultados = query.all()
    
    return jsonify({
        'productos': [
            {
                'id': r.producto_id,
                'nombre': r.nombre,
                'cantidad_vendida': r.cantidad_vendida,
                'ingresos': float(r.ingresos or 0)
            }
            for r in resultados
        ]
    }), 200


# ================== CLIENTES FRECUENTES ==================

@reports_bp.route('/clientes-frecuentes', methods=['GET'])
@jwt_required()
def clientes_frecuentes():
    """Reporte de clientes frecuentes"""
    if not check_admin_or_vendedor():
        return jsonify({'error': 'Solo admin/vendedor puede ver reportes'}), 403
    
    limite = int(request.args.get('limite', 10))
    meses = int(request.args.get('meses', 6))
    
    fecha_inicio = datetime.utcnow() - timedelta(days=meses*30)
    
    # Query de clientes
    query = db.session.query(
        Pedido.usuario_id,
        Usuario.nombre,
        Usuario.email,
        func.count(Pedido.id).label('pedidos'),
        func.sum(Pedido.total).label('total_gastado')
    ).join(
        Usuario, Pedido.usuario_id == Usuario.id
    ).filter(
        Pedido.estado.notin_(['cancelled']),
        Pedido.created_at >= fecha_inicio
    ).group_by(
        Pedido.usuario_id, Usuario.nombre, Usuario.email
    ).order_by(
        func.count(Pedido.id).desc()
    ).limit(limite)
    
    resultados = query.all()
    
    return jsonify({
        'clientes': [
            {
                'id': r.usuario_id,
                'nombre': r.nombre,
                'email': r.email,
                'pedidos': r.pedidos,
                'total_gastado': float(r.total_gastado or 0)
            }
            for r in resultados
        ]
    }), 200


# ================== REPORTE DE INVENTARIO ==================

@reports_bp.route('/inventario', methods=['GET'])
@jwt_required()
def reporte_inventario():
    """Reporte completo del inventario"""
    if not check_admin_or_vendedor():
        return jsonify({'error': 'Solo admin/vendedor puede ver reportes'}), 403
    
    # Estadísticas generales
    total_productos = Producto.query.count()
    total_stock = db.session.query(func.sum(Producto.stock)).scalar() or 0
    valor_inventario = db.session.query(
        func.sum(Producto.stock * Producto.precio_base)
    ).scalar() or 0
    
    # Productos bajo stock
    bajo_stock = Producto.query.filter(
        Producto.stock < Producto.min_stock
    ).all()
    
    # Por categoría
    por_categoria = db.session.query(
        Producto.categoria_id,
        func.count(Producto.id).label('productos'),
        func.sum(Producto.stock).label('stock_total')
    ).group_by(Producto.categoria_id).all()
    
    return jsonify({
        'resumen': {
            'total_productos': total_productos,
            'total_unidades': total_stock,
            'valor_inventario': float(valor_inventario),
            'productos_bajo_stock': len(bajo_stock)
        },
        'bajo_stock': [p.to_dict() for p in bajo_stock],
        'por_categoria': [
            {
                'categoria_id': r.categoria_id,
                'productos': r.productos,
                'stock_total': r.stock_total
            }
            for r in por_categoria
        ]
    }), 200


# ================== DASHBOARD ==================

@reports_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    """Dashboard completa para admin/vendedor"""
    if not check_admin_or_vendedor():
        return jsonify({'error': 'Solo admin/vendedor puede ver dashboard'}), 403
    
    # Fechas
    hoy = datetime.utcnow().date()
    mes_actual = datetime.utcnow() - timedelta(days=30)
    
    # Ventas del mes
    ventas_mes = db.session.query(
        func.count(Pedido.id),
        func.sum(Pedido.total)
    ).filter(
        Pedido.estado.notin_(['cancelled']),
        Pedido.created_at >= mes_actual
    ).first()
    
    # Pedidos por estado
    por_estado = db.session.query(
        Pedido.estado,
        func.count(Pedido.id)
    ).group_by(Pedido.estado).all()
    
    # Productos bajo stock (alertas)
    alertas_stock = Producto.query.filter(
        Producto.stock < Producto.min_stock
    ).limit(5).all()
    
    # Últimos pedidos
    ultimos_pedidos = Pedido.query.order_by(
        Pedido.created_at.desc()
    ).limit(5).all()
    
    return jsonify({
        'ventas_mes': {
            'pedidos': ventas_mes[0] or 0,
            'monto': float(ventas_mes[1] or 0)
        },
        'pedidos_por_estado': {
            e.estado: e[1] for e in por_estado
        },
        'alertas_stock': [p.to_dict() for p in alertas_stock],
        'ultimos_pedidos': [p.to_dict() for p in ultimos_pedidos]
    }), 200


# Inicializador del Blueprint
def init_reports(app):
    """Registrar blueprint en la app Flask"""
    app.register_blueprint(reports_bp)