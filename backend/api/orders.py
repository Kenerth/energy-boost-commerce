"""
Módulo de Pedidos
API REST - Energy Boost Commerce

Endpoints:
- GET /api/orders - Historial de pedidos del usuario
- GET /api/orders/<id> - Ver pedido específico
- PUT /api/orders/<id>/status - Cambiar estado (admin/vendedor)
- GET /api/orders/all - Todos los pedidos (admin/vendedor)

Estados: pendiente -> processing -> shipped -> delivered / cancelled
"""
from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.helpers import get_user_id
from models import db, Pedido, Usuario, PedidoDetalle, Producto
from fpdf import FPDF
import io
import traceback
from datetime import datetime

# Estados válidos del pedido
ESTADOS_VALIDOS = ['pendiente', 'processing', 'shipped', 'delivered', 'cancelled']

# Blueprint para pedidos
orders_bp = Blueprint('orders', __name__, url_prefix='/api')


@orders_bp.route('/orders', methods=['GET'])
@jwt_required()
def list_orders():
    """Ver historial de pedidos del usuario"""
    usuario_id = get_user_id()
    
    # Obtener parámetros
    estado = request.args.get('estado')
    
    # Query base
    query = Pedido.query.filter_by(usuario_id=usuario_id)
    
    # Filtrar por estado
    if estado:
        query = query.filter_by(estado=estado)
    
    pedidos = query.order_by(Pedido.created_at.desc()).all()
    
    return jsonify({
        'pedidos': [p.to_dict() for p in pedidos],
        'total': len(pedidos)
    }), 200


@orders_bp.route('/orders/<int:pedido_id>', methods=['GET'])
@jwt_required()
def get_order(pedido_id):
    """Ver detalle de un pedido"""
    usuario_id = get_user_id()
    usuario = Usuario.query.get(usuario_id)
    
    pedido = Pedido.query.get(pedido_id)
    
    if not pedido:
        return jsonify({'error': 'Pedido no encontrado'}), 404
    
    # Verificar que sea el propietario o admin/vendedor
    if pedido.usuario_id != usuario_id and usuario.rol not in ['administrador', 'vendedor']:
        return jsonify({'error': 'No autorizado'}), 403
    
    return jsonify(pedido.to_dict()), 200


@orders_bp.route('/orders/all', methods=['GET'])
@jwt_required()
def list_all_orders():
    """Ver todos los pedidos (admin/vendedor)"""
    usuario_id = get_user_id()
    usuario = Usuario.query.get(usuario_id)
    
    if not usuario or usuario.rol not in ['administrador', 'vendedor']:
        return jsonify({'error': 'Solo admin/vendedor puede ver todos los pedidos'}), 403
    
    # Parámetros de filtro
    estado = request.args.get('estado')
    usuario_id_filter = request.args.get('usuario_id')
    
    query = Pedido.query
    
    if estado:
        query = query.filter_by(estado=estado)
    if usuario_id_filter:
        query = query.filter_by(usuario_id=usuario_id_filter)
    
    pedidos = query.order_by(Pedido.created_at.desc()).all()
    
    return jsonify({
        'pedidos': [p.to_dict() for p in pedidos],
        'total': len(pedidos)
    }), 200


@orders_bp.route('/orders/<int:pedido_id>/status', methods=['PUT'])
@jwt_required()
def update_order_status(pedido_id):
    """Cambiar estado del pedido (admin/vendedor)"""
    usuario_id = get_user_id()
    usuario = Usuario.query.get(usuario_id)
    
    if not usuario or usuario.rol not in ['administrador', 'vendedor']:
        return jsonify({'error': 'Solo admin/vendedor puede cambiar estado'}), 403
    
    pedido = Pedido.query.get(pedido_id)
    if not pedido:
        return jsonify({'error': 'Pedido no encontrado'}), 404
    
    data = request.get_json()
    nuevo_estado = data.get('estado')
    
    if not nuevo_estado:
        return jsonify({'error': 'Estado requerido'}), 400
    
    if nuevo_estado not in ESTADOS_VALIDOS:
        return jsonify({'error': f'Estado inválido. Valores: {ESTADOS_VALIDOS}'}), 400
    
    # Si se cancelled, regresar stock
    if nuevo_estado == 'cancelled' and pedido.estado not in ['cancelled', 'delivered']:
        for detalle in pedido.detalles:
            producto = detalle.producto
            producto.stock += detalle.cantidad
    
    pedido.estado = nuevo_estado
    db.session.commit()
    
    return jsonify({
        'mensaje': 'Estado actualizado',
        'pedido': pedido.to_dict()
    }), 200


@orders_bp.route('/pedidos/<int:pedido_id>/factura', methods=['GET'])
@jwt_required()
def generate_invoice(pedido_id):
    """Generar factura PDF del pedido"""
    try:
        usuario_id = get_user_id()
        usuario = Usuario.query.get(usuario_id)
        
        pedido = Pedido.query.get(pedido_id)
        if not pedido:
            return jsonify({'error': 'Pedido no encontrado'}), 404
        
        if pedido.usuario_id != usuario_id and usuario.rol not in ['administrador', 'vendedor']:
            return jsonify({'error': 'No autorizado'}), 403
        
        pdf = FPDF(orientation='P', unit='mm', format='A4')
        pdf.add_page()
        pdf.set_auto_page_break(auto=True, margin=15)
        
        pdf.set_font('Helvetica', 'B', 16)
        pdf.cell(0, 10, 'Energy Boost Commerce', 0, 1, 'C')
        
        pdf.set_font('Helvetica', 'B', 14)
        pdf.cell(0, 10, 'FACTURA DE COMPRA', 0, 1, 'C')
        pdf.ln(5)
        
        pdf.set_font('Helvetica', '', 10)
        pdf.cell(0, 6, f'Factura #: {pedido.id}', 0, 1)
        
        fecha_str = pedido.created_at.strftime('%d/%m/%Y %H:%M') if pedido.created_at else 'N/A'
        pdf.cell(0, 6, f'Fecha: {fecha_str}', 0, 1)
        
        cliente_nombre = pedido.usuario.nombre if pedido.usuario else 'N/A'
        pdf.cell(0, 6, f'Cliente: {cliente_nombre}', 0, 1)
        
        cliente_email = pedido.usuario.email if pedido.usuario else 'N/A'
        pdf.cell(0, 6, f'Email: {cliente_email}', 0, 1)
        pdf.ln(5)
        
        pdf.set_font('Helvetica', 'B', 10)
        pdf.set_fill_color(200, 220, 200)
        pdf.cell(100, 8, 'Producto', 1, 0, 'C', 1)
        pdf.cell(30, 8, 'Cantidad', 1, 0, 'C', 1)
        pdf.cell(40, 8, 'Subtotal', 1, 1, 'C', 1)
        
        pdf.set_font('Helvetica', '', 9)
        for detalle in pedido.detalles:
            nombre_producto = (detalle.producto.nombre if detalle.producto else 'Producto')[:35]
            pdf.cell(100, 7, nombre_producto, 1)
            pdf.cell(30, 7, str(detalle.cantidad), 1, 0, 'C')
            pdf.cell(40, 7, f'${detalle.subtotal:.2f}', 1, 1, 'R')
        
        pdf.ln(3)
        pdf.set_font('Helvetica', 'B', 10)
        pdf.cell(130, 8, 'Subtotal:', 0, 0, 'R')
        pdf.cell(40, 8, f'${pedido.subtotal:.2f}', 0, 1, 'R')
        pdf.cell(130, 8, 'IVA (16%):', 0, 0, 'R')
        pdf.cell(40, 8, f'${pedido.impuesto:.2f}', 0, 1, 'R')
        pdf.set_font('Helvetica', 'B', 12)
        pdf.cell(130, 10, 'TOTAL:', 0, 0, 'R')
        pdf.cell(40, 10, f'${pedido.total:.2f}', 0, 1, 'R')
        
        pdf.ln(15)
        pdf.set_font('Helvetica', 'I', 8)
        pdf.cell(0, 5, 'Gracias por su compra en Energy Boost Commerce', 0, 1, 'C')
        
        pdf_content = pdf.tobytes()
        buffer = io.BytesIO(pdf_content)
        buffer.seek(0)
        
        response = send_file(
            buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'factura_pedido_{pedido_id}.pdf'
        )
        return response
        
    except Exception as e:
        print(f"[ERROR] Error al generar factura: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': f'Error interno: {str(e)}'}), 500


# Inicializador del Blueprint
def init_orders(app):
    """Registrar blueprint en la app Flask"""
    app.register_blueprint(orders_bp)