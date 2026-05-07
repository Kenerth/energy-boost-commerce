"""
Módulo de autenticación y usuarios
API REST - Energy Boost Commerce

Endpoints:
- POST /api/auth/register - Registrar usuario
- POST /api/auth/login - Iniciar sesión
- GET /api/auth/me - Obtener usuario actual
- PUT /api/auth/me - Actualizar perfil
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity
)
from models import db, Usuario

# Blueprint para autenticación
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Registrar nuevo usuario
    Datos requeridos: email, password, nombre, rol (opcional, por defecto cliente)
    """
    data = request.get_json()
    
    # Validar datos requeridos
    required = ['email', 'password', 'nombre']
    for field in required:
        if not data.get(field):
            return jsonify({'error': f'Campo requerido: {field}'}), 400
    
    # Validar que el email no existe
    if Usuario.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'El email ya está registrado'}), 400
    
    # Validar rol (solo cliente por defecto, admin puede crear otros roles)
    rol = data.get('rol', 'cliente')
    # Solo administrador puede crear usuarios con otros roles
    allowed_roles = ['cliente']
    if rol not in allowed_roles:
        rol = 'cliente'  #_FORZAR rol cliente si no es válido
    
    # Crear usuario
    usuario = Usuario(
        email=data['email'],
        nombre=data['nombre'],
        rol=rol
    )
    usuario.set_password(data['password'])
    
    db.session.add(usuario)
    db.session.commit()
    
    return jsonify({
        'mensaje': 'Usuario registrado exitosamente',
        'usuario': usuario.to_dict()
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Iniciar sesión
    Datos requeridos: email, password
    Retorna: access_token
    """
    data = request.get_json()
    
    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email y contraseña son requeridos'}), 400
    
    usuario = Usuario.query.filter_by(email=data['email']).first()
    
    if not usuario or not usuario.check_password(data['password']):
        return jsonify({'error': 'Credenciales inválidas'}), 401
    
    # Crear token de acceso
    access_token = create_access_token(identity=usuario.id)
    refresh_token = create_refresh_token(identity=usuario.id)
    
    return jsonify({
        'mensaje': 'Login exitoso',
        'access_token': access_token,
        'refresh_token': refresh_token,
        'usuario': usuario.to_dict()
    }), 200


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refrescar token de acceso"""
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify({'access_token': access_token}), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Obtener información del usuario actual"""
    usuario_id = get_jwt_identity()
    usuario = Usuario.query.get(usuario_id)
    
    if not usuario:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    
    return jsonify(usuario.to_dict()), 200


@auth_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_current_user():
    """Actualizar información del usuario actual"""
    usuario_id = get_jwt_identity()
    usuario = Usuario.query.get(usuario_id)
    
    if not usuario:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    
    data = request.get_json()
    
    # Actualizar campos permitidos
    if 'nombre' in data:
        usuario.nombre = data['nombre']
    if 'password' in data and data['password']:
        usuario.set_password(data['password'])
    
    db.session.commit()
    
    return jsonify({
        'mensaje': 'Usuario actualizado',
        'usuario': usuario.to_dict()
    }), 200


# Rutas de ADMIN para gestión de usuarios
@auth_bp.route('/usuarios', methods=['GET'])
@jwt_required()
def list_usuarios():
    """Listar todos los usuarios (solo admin)"""
    usuario_id = get_jwt_identity()
    usuario = Usuario.query.get(usuario_id)
    
    if not usuario or usuario.rol != 'administrador':
        return jsonify({'error': 'Solo administrador puede ver todos los usuarios'}), 403
    
    usuarios = Usuario.query.all()
    return jsonify({
        'usuarios': [u.to_dict() for u in usuarios]
    }), 200


@auth_bp.route('/usuarios/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_usuario(user_id):
    """Eliminar usuario (solo admin)"""
    usuario_id = get_jwt_identity()
    usuario = Usuario.query.get(usuario_id)
    
    if not usuario or usuario.rol != 'administrador':
        return jsonify({'error': 'Solo administrador puede eliminar usuarios'}), 403
    
    user_to_delete = Usuario.query.get(user_id)
    if not user_to_delete:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    
    # No permitir auto-eliminación
    if user_to_delete.id == usuario_id:
        return jsonify({'error': 'No puedes eliminarte a ti mismo'}), 400
    
    db.session.delete(user_to_delete)
    db.session.commit()
    
    return jsonify({'mensaje': 'Usuario eliminado'}), 200


# Inicializador del Blueprint
def init_auth(app):
    """Registrar blueprint en la app Flask"""
    app.register_blueprint(auth_bp)