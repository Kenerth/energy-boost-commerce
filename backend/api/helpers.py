"""
Funciones helper para la API
Energy Boost Commerce
"""
from flask_jwt_extended import get_jwt_identity


def get_user_id():
    """
    Obtiene el ID del usuario actual desde el token JWT.
    Convierte de string a int porque Flask-JWT-Extended ahora usa strings.
    """
    identity = get_jwt_identity()
    if identity is None:
        return None
    try:
        return int(identity)
    except (ValueError, TypeError):
        return identity