"""
Módulo de Productos e Inventario
API REST - Energy Boost Commerce

Endpoints:
- GET /api/productos - Listar todos los productos
- GET /api/productos/<id> - Ver producto específico
- POST /api/productos - Crear producto (admin)
- PUT /api/productos/<id> - Actualizar producto (admin)
- DELETE /api/productos/<id> - Eliminar producto (admin)
- GET /api/productos/low-stock - Productos con stock bajo
- GET /api/categorias - Listar categorías
- POST /api/categorias - Crear categoría (admin)
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from api.helpers import get_user_id
from models import db, Producto, Categoria, Usuario

# Blueprint para productos
products_bp = Blueprint('products', __name__, url_prefix='/api')


def check_admin():
    """Verifica si el usuario es administrador"""
    usuario_id = get_user_id()
    usuario = Usuario.query.get(usuario_id)
    return usuario and usuario.rol == 'administrador'


# ================== PRODUCTOS ==================

@products_bp.route('/productos', methods=['GET'])
def list_productos():
    """
    Listar todos los productos
    Params opcionales: categoria, buscar, stock
    """
    # Obtener parámetros de query
    categoria = request.args.get('categoria')
    buscar = request.args.get('buscar')
    mostrar_low_stock = request.args.get('lowStock', 'false').lower() == 'true'
    
    # Query base
    query = Producto.query
    
    # Filtrar por categoría
    if categoria:
        query = query.filter(Producto.categoria.has(nombre=categoria))
    
    # Filtrar por búsqueda (nombre o descripción)
    if buscar:
        busqueda = f'%{buscar}%'
        query = query.filter(
            db.or_(
                Producto.nombre.ilike(busqueda),
                Producto.descripcion.ilike(busqueda)
            )
        )
    
    # Filtrar productos con stock bajo
    if mostrar_low_stock:
        query = query.filter(Producto.stock < Producto.min_stock)
    
    productos = query.all()
    
    return jsonify({
        'productos': [p.to_dict() for p in productos],
        'total': len(productos)
    }), 200


@products_bp.route('/productos/<int:producto_id>', methods=['GET'])
def get_producto(producto_id):
    """Obtener un producto por ID"""
    producto = Producto.query.get(producto_id)
    
    if not producto:
        return jsonify({'error': 'Producto no encontrado'}), 404
    
    return jsonify(producto.to_dict()), 200


@products_bp.route('/productos', methods=['POST'])
@jwt_required()
def create_producto():
    """Crear nuevo producto (solo admin)"""
    if not check_admin():
        return jsonify({'error': 'Solo administrador puede crear productos'}), 403
    
    data = request.get_json()
    
    # Validar datos requeridos
    required = ['nombre', 'precio_base', 'categoria_id']
    for field in required:
        if not data.get(field):
            return jsonify({'error': f'Campo requerido: {field}'}), 400
    
    # Crear producto
    producto = Producto(
        nombre=data['nombre'],
        descripcion=data.get('descripcion', ''),
        precio_base=data['precio_base'],
        precio_descuento=data.get('precio_descuento', 0),
        imagen=data.get('imagen', ''),
        categoria_id=data['categoria_id'],
        stock=data.get('stock', 0),
        min_stock=data.get('min_stock', 50),
        volumen=data.get('volumen', ''),
        cafeina=data.get('cafeina', '')
    )
    
    db.session.add(producto)
    db.session.commit()
    
    return jsonify({
        'mensaje': 'Producto creado',
        'producto': producto.to_dict()
    }), 201


@products_bp.route('/productos/<int:producto_id>', methods=['PUT'])
@jwt_required()
def update_producto(producto_id):
    """Actualizar producto (solo admin)"""
    if not check_admin():
        return jsonify({'error': 'Solo administrador puede actualizar productos'}), 403
    
    producto = Producto.query.get(producto_id)
    if not producto:
        return jsonify({'error': 'Producto no encontrado'}), 404
    
    data = request.get_json()
    
    # Actualizar campos
    if 'nombre' in data:
        producto.nombre = data['nombre']
    if 'descripcion' in data:
        producto.descripcion = data['descripcion']
    if 'precio_base' in data:
        producto.precio_base = data['precio_base']
    if 'precio_descuento' in data:
        producto.precio_descuento = data['precio_descuento']
    if 'imagen' in data:
        producto.imagen = data['imagen']
    if 'categoria_id' in data:
        producto.categoria_id = data['categoria_id']
    if 'stock' in data:
        producto.stock = data['stock']
    if 'min_stock' in data:
        producto.min_stock = data['min_stock']
    if 'volumen' in data:
        producto.volumen = data['volumen']
    if 'cafeina' in data:
        producto.cafeina = data['cafeina']
    
    db.session.commit()
    
    return jsonify({
        'mensaje': 'Producto actualizado',
        'producto': producto.to_dict()
    }), 200


@products_bp.route('/productos/<int:producto_id>', methods=['DELETE'])
@jwt_required()
def delete_producto(producto_id):
    """Eliminar producto (solo admin)"""
    if not check_admin():
        return jsonify({'error': 'Solo administrador puede eliminar productos'}), 403
    
    producto = Producto.query.get(producto_id)
    if not producto:
        return jsonify({'error': 'Producto no encontrado'}), 404
    
    db.session.delete(producto)
    db.session.commit()
    
    return jsonify({'mensaje': 'Producto eliminado'}), 200


# ================== INVENTARIO ==================

@products_bp.route('/productos/low-stock', methods=['GET'])
@jwt_required()
def get_low_stock():
    """Obtener productos con stock bajo (solo admin/vendedor)"""
    usuario_id = get_user_id()
    usuario = Usuario.query.get(usuario_id)
    
    if not usuario or usuario.rol not in ['administrador', 'vendedor']:
        return jsonify({'error': 'Solo admin/vendedor puede ver stock bajo'}), 403
    
    # Productos donde stock < min_stock
    productos = Producto.query.filter(
        Producto.stock < Producto.min_stock
    ).all()
    
    return jsonify({
        'productos': [p.to_dict() for p in productos],
        'total': len(productos),
        'mensaje': 'Productos que requieren reposición'
    }), 200


@products_bp.route('/productos/<int:producto_id>/stock', methods=['PUT'])
@jwt_required()
def update_stock(producto_id):
    """Actualizar stock de un producto (admin/vendedor)"""
    usuario_id = get_user_id()
    usuario = Usuario.query.get(usuario_id)
    
    if not usuario or usuario.rol not in ['administrador', 'vendedor']:
        return jsonify({'error': 'Solo admin/vendedor puede actualizar stock'}), 403
    
    producto = Producto.query.get(producto_id)
    if not producto:
        return jsonify({'error': 'Producto no encontrado'}), 404
    
    data = request.get_json()
    nueva_cantidad = data.get('cantidad')
    
    if nueva_cantidad is None:
        return jsonify({'error': 'Cantidad requerida'}), 400
    
    # Validar que no sea negativo
    if nueva_cantidad < 0:
        return jsonify({'error': 'La cantidad no puede ser negativa'}), 400
    
    producto.stock = nueva_cantidad
    db.session.commit()
    
    # Verificar si está bajo stock
    bajo_stock = producto.stock < producto.min_stock
    
    return jsonify({
        'mensaje': 'Stock actualizado',
        'producto': producto.to_dict(),
        'alerta_stock': bajo_stock
    }), 200


@products_bp.route('/productos/<int:producto_id>/descuento', methods=['PUT'])
@jwt_required()
def set_descuento(producto_id):
    """Establecer precio con descuento (admin)"""
    if not check_admin():
        return jsonify({'error': 'Solo administrador puede agregar descuentos'}), 403
    
    producto = Producto.query.get(producto_id)
    if not producto:
        return jsonify({'error': 'Producto no encontrado'}), 404
    
    data = request.get_json()
    precio_descuento = data.get('precio_descuento', 0)
    
    # Validar que el descuento no sea mayor al precio base
    if precio_descuento > producto.precio_base:
        return jsonify({'error': 'El descuento no puede ser mayor al precio base'}), 400
    
    producto.precio_descuento = precio_descuento
    db.session.commit()
    
    return jsonify({
        'mensaje': 'Precio con descuento actualizado',
        'producto': producto.to_dict()
    }), 200


# ================== CATEGORÍAS ==================

@products_bp.route('/categorias', methods=['GET'])
def list_categorias():
    """Listar todas las categorías"""
    categorias = Categoria.query.all()
    return jsonify({
        'categorias': [c.to_dict() for c in categorias]
    }), 200


@products_bp.route('/categorias', methods=['POST'])
@jwt_required()
def create_categoria():
    """Crear categoría (solo admin)"""
    if not check_admin():
        return jsonify({'error': 'Solo administrador puede crear categorías'}), 403
    
    data = request.get_json()
    
    if not data.get('nombre'):
        return jsonify({'error': 'Nombre requerido'}), 400
    
    # Verificar que no exista
    existing = Categoria.query.filter_by(nombre=data['nombre']).first()
    if existing:
        return jsonify({'error': 'La categoría ya existe'}), 400
    
    categoria = Categoria(
        nombre=data['nombre'],
        descripcion=data.get('descripcion', ''),
        icono=data.get('icono', '')
    )
    
    db.session.add(categoria)
    db.session.commit()
    
    return jsonify({
        'mensaje': 'Categoría creada',
        'categoria': categoria.to_dict()
    }), 201


@products_bp.route('/categorias/<int:categoria_id>', methods=['DELETE'])
@jwt_required()
def delete_categoria(categoria_id):
    """Eliminar categoría (solo admin)"""
    if not check_admin():
        return jsonify({'error': 'Solo administrador puede eliminar categorías'}), 403
    
    categoria = Categoria.query.get(categoria_id)
    if not categoria:
        return jsonify({'error': 'Categoría no encontrada'}), 404
    
    # Verificar que no tenga productos
    if categoria.productos:
        return jsonify({'error': 'No se puede eliminar categoría con productos'}), 400
    
    db.session.delete(categoria)
    db.session.commit()
    
    return jsonify({'mensaje': 'Categoría eliminada'}), 200


# Inicializador del Blueprint
def init_products(app):
    """Registrar blueprint en la app Flask"""
    app.register_blueprint(products_bp)