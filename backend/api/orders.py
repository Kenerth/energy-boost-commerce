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
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from api.helpers import get_user_id
from models import db, Pedido, Usuario, PedidoDetalle

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


# Inicializador del Blueprint
def init_orders(app):
    """Registrar blueprint en la app Flask"""
    app.register_blueprint(orders_bp)