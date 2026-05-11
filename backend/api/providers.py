"""
Módulo de Proveedores
API REST - Energy Boost Commerce

Endpoints:
- GET /api/proveedores - Listar proveedores
- POST /api/proveedores - Crear proveedor
- GET /api/proveedores/<id> - Ver proveedor
- PUT /api/proveedores/<id> - Actualizar proveedor
- DELETE /api/proveedores/<id> - Eliminar proveedor
- POST /api/proveedores/<id>/compras - Registrar compra a proveedor
- GET /api/proveedores/<id>/compras - Ver historial de compras
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from api.helpers import get_user_id
from models import db, Proveedor, CompraProveedor, Producto, Usuario
from datetime import datetime

# Blueprint para proveedores
providers_bp = Blueprint('providers', __name__, url_prefix='/api/proveedores')


def check_admin():
    """Verifica si el usuario es administrador"""
    usuario_id = get_user_id()
    usuario = Usuario.query.get(usuario_id)
    return usuario and usuario.rol == 'administrador'


@providers_bp.route('', methods=['GET'])
@jwt_required()
def list_proveedores():
    """Listar todos los proveedores"""
    if not check_admin():
        return jsonify({'error': 'Solo administrador puede ver proveedores'}), 403
    
    proveedores = Proveedor.query.all()
    return jsonify({
        'proveedores': [p.to_dict() for p in proveedores]
    }), 200


@providers_bp.route('', methods=['POST'])
@jwt_required()
def create_proveedor():
    """Crear nuevo proveedor"""
    if not check_admin():
        return jsonify({'error': 'Solo administrador puede crear proveedores'}), 403
    
    data = request.get_json()
    
    if not data.get('nombre'):
        return jsonify({'error': 'Nombre requerido'}), 400
    
    proveedor = Proveedor(
        nombre=data['nombre'],
        contacto=data.get('contacto', ''),
        telefono=data.get('telefono', ''),
        email=data.get('email', ''),
        direccion=data.get('direccion', '')
    )
    
    db.session.add(proveedor)
    db.session.commit()
    
    return jsonify({
        'mensaje': 'Proveedor creado',
        'proveedor': proveedor.to_dict()
    }), 201


@providers_bp.route('/<int:proveedor_id>', methods=['GET'])
@jwt_required()
def get_proveedor(proveedor_id):
    """Ver proveedor específico"""
    if not check_admin():
        return jsonify({'error': 'Solo administrador puede ver proveedores'}), 403
    
    proveedor = Proveedor.query.get(proveedor_id)
    if not proveedor:
        return jsonify({'error': 'Proveedor no encontrado'}), 404
    
    return jsonify(proveedor.to_dict()), 200


@providers_bp.route('/<int:proveedor_id>', methods=['PUT'])
@jwt_required()
def update_proveedor(proveedor_id):
    """Actualizar proveedor"""
    if not check_admin():
        return jsonify({'error': 'Solo administrator puede actualizar proveedores'}), 403
    
    proveedor = Proveedor.query.get(proveedor_id)
    if not proveedor:
        return jsonify({'error': 'Proveedor no encontrado'}), 404
    
    data = request.get_json()
    
    if 'nombre' in data:
        proveedor.nombre = data['nombre']
    if 'contacto' in data:
        proveedor.contacto = data['contacto']
    if 'telefono' in data:
        proveedor.telefono = data['telefono']
    if 'email' in data:
        proveedor.email = data['email']
    if 'direccion' in data:
        proveedor.direccion = data['direccion']
    
    db.session.commit()
    
    return jsonify({
        'mensaje': 'Proveedor actualizado',
        'proveedor': proveedor.to_dict()
    }), 200


@providers_bp.route('/<int:proveedor_id>', methods=['DELETE'])
@jwt_required()
def delete_proveedor(proveedor_id):
    """Eliminar proveedor"""
    if not check_admin():
        return jsonify({'error': 'Solo administrador puede eliminar proveedores'}), 403
    
    proveedor = Proveedor.query.get(proveedor_id)
    if not proveedor:
        return jsonify({'error': 'Proveedor no encontrado'}), 404
    
    # Verificar que no tenga compras
    if proveedor.compras:
        return jsonify({'error': 'No se puede eliminar proveedor con compras asociadas'}), 400
    
    db.session.delete(proveedor)
    db.session.commit()
    
    return jsonify({'mensaje': 'Proveedor eliminado'}), 200


@providers_bp.route('/<int:proveedor_id>/compras', methods=['POST'])
@jwt_required()
def registrar_compra(proveedor_id):
    """Registrar compra a proveedor (aumenta inventario)"""
    if not check_admin():
        return jsonify({'error': 'Solo administrador puede registrar compras'}), 403
    
    proveedor = Proveedor.query.get(proveedor_id)
    if not proveedor:
        return jsonify({'error': 'Proveedor no encontrado'}), 404
    
    data = request.get_json()
    producto_id = data.get('producto_id')
    cantidad = data.get('cantidad')
    precio_unitario = data.get('precio_unitario')
    
    if not producto_id or not cantidad or not precio_unitario:
        return jsonify({'error': 'producto_id, cantidad y precio_unitario requeridos'}), 400
    
    # Verificar producto existe
    producto = Producto.query.get(producto_id)
    if not producto:
        return jsonify({'error': 'Producto no encontrado'}), 404
    
    # Crear registro de compra
    compra = CompraProveedor(
        proveedor_id=proveedor_id,
        producto_id=producto_id,
        cantidad=cantidad,
        precio_unitario=precio_unitario,
        total=cantidad * precio_unitario,
        notas=data.get('notas', '')
    )
    
    # Aumentar stock del producto
    producto.stock += cantidad
    
    db.session.add(compra)
    db.session.commit()
    
    return jsonify({
        'mensaje': 'Compra registrada',
        'compra': compra.to_dict(),
        'nuevo_stock': producto.stock
    }), 201


@providers_bp.route('/<int:proveedor_id>/compras', methods=['GET'])
@jwt_required()
def list_compras(proveedor_id):
    """Ver historial de compras de un proveedor"""
    if not check_admin():
        return jsonify({'error': 'Solo administrador puede ver compras'}), 403
    
    proveedor = Proveedor.query.get(proveedor_id)
    if not proveedor:
        return jsonify({'error': 'Proveedor no encontrado'}), 404
    
    compras = proveedor.compras
    
    return jsonify({
        'compras': [c.to_dict() for c in compras],
        'total': len(compras)
    }), 200


@providers_bp.route('/compras', methods=['GET'])
@jwt_required()
def list_all_compras():
    """Ver todas las compras a proveedores"""
    if not check_admin():
        return jsonify({'error': 'Solo administrador puede ver compras'}), 403
    
    compras = CompraProveedor.query.order_by(CompraProveedor.fecha.desc()).all()
    
    return jsonify({
        'compras': [c.to_dict() for c in compras],
        'total': len(compras)
    }), 200


# Inicializador del Blueprint
def init_providers(app):
    """Registrar blueprint en la app Flask"""
    app.register_blueprint(providers_bp)