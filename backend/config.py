"""
Configuración de la aplicación Flask
Energy Boost Commerce - Backend
"""
import os
from datetime import timedelta

# Basepath del proyecto
BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    """Clase de configuración base"""
    # Seguridad
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-energy-boost-2026')
    
    # JWT Configuración - permitir números
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key-energy-boost-2026')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # Base de datos - usar ruta absoluta
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{os.path.join(BASE_DIR, "energy_boost.db")}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False
    
    # API Configuración
    JSON_SORT_KEYS = False
    JSON_AS_ASCII = False
    
    # CORS
    CORS_HEADERS = 'Content-Type'


class DevelopmentConfig(Config):
    """Configuración para desarrollo"""
    DEBUG = True
    TESTING = False


class ProductionConfig(Config):
    """Configuración para producción"""
    DEBUG = False
    TESTING = False


class TestingConfig(Config):
    """Configuración para pruebas"""
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'


# Diccionario de configuraciones
config_by_name = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}


def get_config(env='default'):
    """Obtiene la configuración según el entorno"""
    return config_by_name.get(env, config_by_name['default'])