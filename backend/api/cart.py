"""
Módulo de Carrito de Compras
API REST - Energy Boost Commerce

El carrito se guarda en la base de datos por usuario.

Endpoints:
- GET /api/cart - Ver carrito del usuario
- POST /api/cart/items - Agregar producto
- PUT /api/cart/items/<item_id> - Actualizar cantidad
- DELETE /api/cart/items/<item_id> - Eliminar item
- DELETE /api/cart - Vaciar carrito
- GET /api/cart/checkout - Finalizar compra (crear pedido)
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from api.helpers import get_user_id
from models import db, Producto, Pedido, PedidoDetalle, Usuario

# Constante de impuesto
IMPUESTO_TASA = 0.16  # 16% IVA

# Blueprint para carrito
cart_bp = Blueprint('cart', __name__, url_prefix='/api')


def get_or_create_cart(usuario_id):
    """Crea o obtiene el carrito del usuario desde la base de datos"""
    # Los items del carrito se guardan en una tabla temporal
    # Por simplicidad, usaremos un formato JSON en memoria o tabla dedicada
    pass  # Se implementa con tabla en DB


@cart_bp.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    """Obtener carrito del usuario"""
    usuario_id = get_user_id()
    usuario = Usuario.query.get(usuario_id)
    
    if not usuario:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    
    # Obtener items del carrito desde la tabla (implementado abajo)
    items = get_cart_items(usuario_id)
    
    # Calcular totales
    subtotal = sum(item['cantidad'] * item['precio'] for item in items)
    impuesto = round(subtotal * IMPUESTO_TASA, 2)
    total = subtotal + impuesto
    
    return jsonify({
        'items': items,
        'subtotal': subtotal,
        'impuesto': impuesto,
        'total': total,
        'items_count': len(items)
    }), 200


@cart_bp.route('/cart/items', methods=['POST'])
@jwt_required()
def add_to_cart():
    """Agregar producto al carrito"""
    identity = get_user_id()
    # Convertir a int si es string
    try:
        usuario_id = int(identity) if identity else None
    except (ValueError, TypeError):
        usuario_id = identity
    usuario = Usuario.query.get(usuario_id)
    
    if not usuario:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    
    data = request.get_json()
    producto_id = data.get('producto_id')
    cantidad = data.get('cantidad', 1)
    
    if not producto_id:
        return jsonify({'error': 'producto_id requerido'}), 400
    
    if cantidad < 1:
        return jsonify({'error': 'Cantidad debe ser al menos 1'}), 400
    
    # Verificar producto existe
    producto = Producto.query.get(producto_id)
    if not producto:
        return jsonify({'error': 'Producto no encontrado'}), 404
    
    # Verificar stock disponible
    if producto.stock < cantidad:
        return jsonify({'error': f'Stock insuficiente. Disponible: {producto.stock}'}), 400
    
    # Agregar o actualizar en el carrito
    item = add_cart_item(usuario_id, producto_id, cantidad)
    
    return jsonify({
        'mensaje': 'Producto agregado al carrito',
        'item': item
    }), 201


@cart_bp.route('/cart/items/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_cart_item(item_id):
    """Actualizar cantidad de un item"""
    usuario_id = get_user_id()
    
    data = request.get_json()
    cantidad = data.get('cantidad')
    
    if cantidad is None:
        return jsonify({'error': 'cantidad requerida'}), 400
    
    if cantidad < 0:
        return jsonify({'error': 'Cantidad no puede ser negativa'}), 400
    
    # Actualizar item
    result = update_cart_item_quantity(usuario_id, item_id, cantidad)
    
    if not result:
        return jsonify({'error': 'Item no encontrado'}), 404
    
    return jsonify({
        'mensaje': 'Cantidad actualizada',
        'item': result
    }), 200


@cart_bp.route('/cart/items/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(item_id):
    """Eliminar item del carrito"""
    usuario_id = get_user_id()
    
    result = remove_cart_item(usuario_id, item_id)
    
    if not result:
        return jsonify({'error': 'Item no encontrado'}), 404
    
    return jsonify({'mensaje': 'Producto eliminado del carrito'}), 200


@cart_bp.route('/cart', methods=['DELETE'])
@jwt_required()
def clear_cart():
    """Vaciar carrito"""
    usuario_id = get_user_id()
    
    clear_user_cart(usuario_id)
    
    return jsonify({'mensaje': 'Carrito vaciado'}), 200


@cart_bp.route('/cart/checkout', methods=['POST'])
@jwt_required()
def checkout():
    """
    Finalizar compra - Crea un pedido
    Estados: pending -> processing -> shipped -> delivered
    """
    usuario_id = get_user_id()
    usuario = Usuario.query.get(usuario_id)
    
    if not usuario:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    
    # Obtener items del carrito
    items = get_cart_items(usuario_id)
    
    if not items:
        return jsonify({'error': 'Carrito vacío'}), 400
    
    # Verificar stock y calcular totales
    subtotal = 0
    detalles = []
    
    for item in items:
        producto = Producto.query.get(item['producto_id'])
        
        # Verificar stock actualizado
        if producto.stock < item['cantidad']:
            return jsonify({
                'error': f'Stock insuficiente para {producto.nombre}. Disponible: {producto.stock}'
            }), 400
        
        # Calcular precio al momento
        precio_unitario = producto.precio  # Precio con descuento si aplica
        item_subtotal = precio_unitario * item['cantidad']
        subtotal += item_subtotal
        
        detalles.append({
            'producto_id': producto.id,
            'cantidad': item['cantidad'],
            'precio_unitario': precio_unitario,
            'subtotal': item_subtotal
        })
    
    # Calcular impuesto y total
    impuesto = round(subtotal * IMPUESTO_TASA, 2)
    total = subtotal + impuesto
    
    # Crear pedido
    pedido = Pedido(
        usuario_id=usuario_id,
        subtotal=subtotal,
        impuesto=impuesto,
        total=total,
        estado='pendiente',
        metodo_pago='simulado'
    )
    
    db.session.add(pedido)
    db.session.commit()
    
    # Crear detalles del pedido y restar stock
    for det in detalles:
        detalle = PedidoDetalle(
            pedido_id=pedido.id,
            producto_id=det['producto_id'],
            cantidad=det['cantidad'],
            precio_unitario=det['precio_unitario'],
            subtotal=det['subtotal']
        )
        db.session.add(detalle)
        
        # Restar del stock
        producto = Producto.query.get(det['producto_id'])
        stock_anterior = producto.stock
        producto.stock -= det['cantidad']
        print(f"[CHECKOUT] Stock producto {producto.id}: {stock_anterior} -> {producto.stock} (resté {det['cantidad']})")
    
    db.session.commit()
    print(f"[CHECKOUT] Pedido {pedido.id} creado, stock actualizado")
    
    # Vaciar carrito
    clear_user_cart(usuario_id)
    
    return jsonify({
        'mensaje': 'Pedido creado exitosamente',
        'pedido': pedido.to_dict()
    }), 201


# ================== FUNCIONES AUXILIARES ==================
# Usaremos una tabla simple para el carrito en la base de datos

from models import db


# Tabla temporal del carrito (en memoria para este ejemplo)
# En producción, usar una tabla en la DB
_user_carts = {}


def get_cart_items(usuario_id):
    """Obtiene los items del carrito de un usuario"""
    return _user_carts.get(usuario_id, [])


def add_cart_item(usuario_id, producto_id, cantidad):
    """Agrega un item al carrito"""
    if usuario_id not in _user_carts:
        _user_carts[usuario_id] = []
    
    items = _user_carts[usuario_id]
    
    # Buscar si ya existe
    for item in items:
        if item['producto_id'] == producto_id:
            item['cantidad'] += cantidad
            return item
    
    # Obtener producto para el precio
    producto = Producto.query.get(producto_id)
    
    # Agregar nuevo item
    new_item = {
        'id': len(items) + 1,
        'producto_id': producto_id,
        'nombre': producto.nombre,
        'precio': producto.precio,
        'cantidad': cantidad
    }
    items.append(new_item)
    
    return new_item


def update_cart_item_quantity(usuario_id, item_id, cantidad):
    """Actualiza la cantidad de un item"""
    if usuario_id not in _user_carts:
        return None
    
    items = _user_carts[usuario_id]
    
    for item in items:
        if item['id'] == item_id:
            if cantidad == 0:
                items.remove(item)
            else:
                item['cantidad'] = cantidad
            return item
    
    return None


def remove_cart_item(usuario_id, item_id):
    """Elimina un item del carrito"""
    if usuario_id not in _user_carts:
        return None
    
    items = _user_carts[usuario_id]
    
    for item in items:
        if item['id'] == item_id:
            items.remove(item)
            return item
    
    return None


def clear_user_cart(usuario_id):
    """Vacía el carrito de un usuario"""
    _user_carts[usuario_id] = []


# Inicializador del Blueprint
def init_cart(app):
    """Registrar blueprint en la app Flask"""
    app.register_blueprint(cart_bp)