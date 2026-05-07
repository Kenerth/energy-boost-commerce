"""
Energy Boost Commerce - Backend Flask
Punto de entrada principal de la API REST
"""
import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

# Importar configuración
from config import get_config

# Importar modelos y db
from models import db, Usuario, Categoria, Producto

# Importar blueprints
from api import auth_bp
from api.products import products_bp
from api.cart import cart_bp
from api.orders import orders_bp


def create_app(config_name='default'):
    """Factory de la aplicación Flask"""
    app = Flask(__name__)
    
    # Cargar configuración
    app.config.from_object(get_config(config_name))
    
    # Inicializar extensiones
    db.init_app(app)
    CORS(app)
    JWTManager(app)
    
    # Registrar blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(cart_bp)
    app.register_blueprint(orders_bp)
    
    # Ruta de health check
    @app.route('/api/health')
    def health():
        return jsonify({
            'status': 'OK',
            'message': 'Energy Boost Commerce API funcionando',
            'version': '1.0.0'
        }), 200
    
    # Rutas no encontradas
    @app.route('/api/not-found')
    def not_found():
        return jsonify({'error': 'Endpoint no encontrado'}), 404
    
    return app


def init_db(app):
    """Inicializar base de datos con datos de ejemplo"""
    with app.app_context():
        # Crear tablas
        db.create_all()
        
        # Verificar si ya hay datos
        if Usuario.query.first():
            print("[OK] Base de datos ya inicializada")
            return
        
        # Crear usuario administrador por defecto
        admin = Usuario(
            email='admin@volt.com',
            nombre='Administrador',
            rol='administrador'
        )
        admin.set_password('admin')
        
        # Crear usuario vendedor
        vendedor = Usuario(
            email='vendedor@volt.com',
            nombre='Juan Vendedor',
            rol='vendedor'
        )
        vendedor.set_password('vendedor')
        
        # Crear usuario cliente demo
        cliente = Usuario(
            email='cliente@volt.com',
            nombre='Cliente Demo',
            rol='cliente'
        )
        cliente.set_password('cliente')
        
        db.session.add_all([admin, vendedor, cliente])
        db.session.commit()
        
        # Crear categorías
        categorias = [
            Categoria(nombre='clasicas', descripcion='Bebidas energía clasicas', icono='⚡'),
            Categoria(nombre='sin-azucar', descripcion='Sin azúcar', icono='🍃'),
            Categoria(nombre='tropicales', descripcion='Sabores tropicales', icono='🌴'),
            Categoria(nombre='premium', descripcion='Edición premium', icono='👑'),
            Categoria(nombre='shots', descripcion='Shots de energía', icono='💉'),
        ]
        db.session.add_all(categorias)
        db.session.commit()
        
        # Crear productos de ejemplo
        productos = [
            Producto(
                nombre='VOLT Thunder',
                descripcion='Energía pura con sabor original',
                precio_base=2.99, precio_descuento=0,
                categoria_id=1, stock=150,
                min_stock=50, volumen='500ml',
                cafeina='160mg'
            ),
            Producto(
                nombre='VOLT Zero',
                descripcion='Todo el poder sin azúcar',
                precio_base=3.29, precio_descuento=0,
                categoria_id=2, stock=120,
                min_stock=50, volumen='500ml',
                cafeina='160mg'
            ),
            Producto(
                nombre='VOLT Mango Blitz',
                descripcion='Explosión tropical de mango',
                precio_base=3.49, precio_descuento=2.99,
                categoria_id=3, stock=80,
                min_stock=50, volumen='500ml',
                cafeina='150mg'
            ),
            Producto(
                nombre='VOLT Black Gold',
                descripcion='Edición premium',
                precio_base=5.99, precio_descuento=0,
                categoria_id=4, stock=40,
                min_stock=30, volumen='500ml',
                cafeina='200mg'
            ),
            Producto(
                nombre='VOLT Quick Shot',
                descripcion='Concentrado de energía',
                precio_base=2.49, precio_descuento=1.99,
                categoria_id=5, stock=200,
                min_stock=50, volumen='60ml',
                cafeina='200mg'
            ),
            Producto(
                nombre='VOLT Citrus Storm',
                descripcion='Tormenta cítrica',
                precio_base=2.99, precio_descuento=0,
                categoria_id=1, stock=130,
                min_stock=50, volumen='500ml',
                cafeina='160mg'
            ),
            Producto(
                nombre='VOLT Berry Zero',
                descripcion='Frutos rojos sin azúcar',
                precio_base=3.29, precio_descuento=0,
                categoria_id=2, stock=100,
                min_stock=50, volumen='500ml',
                cafeina='160mg'
            ),
            Producto(
                nombre='VOLT Passion Fury',
                descripcion='Maracuyá explosiva',
                precio_base=3.49, precio_descuento=0,
                categoria_id=3, stock=75,
                min_stock=50, volumen='500ml',
                cafeina='150mg'
            ),
            Producto(
                nombre='VOLT Platinum Ice',
                descripcion='Premium helado',
                precio_base=6.49, precio_descuento=5.49,
                categoria_id=4, stock=30,
                min_stock=30, volumen='500ml',
                cafeina='200mg'
            ),
            Producto(
                nombre='VOLT Nitro Shot',
                descripcion='Doble cafeína',
                precio_base=3.29, precio_descuento=0,
                categoria_id=5, stock=180,
                min_stock=50, volumen='60ml',
                cafeina='300mg'
            ),
            Producto(
                nombre='VOLT Watermelon Wave',
                descripcion='Onda de sandía',
                precio_base=3.49, precio_descuento=0,
                categoria_id=3, stock=90,
                min_stock=50, volumen='500ml',
                cafeina='150mg'
            ),
            Producto(
                nombre='VOLT Ultra White',
                descripcion='Sin azúcar, sin límites',
                precio_base=3.49, precio_descuento=0,
                categoria_id=2, stock=110,
                min_stock=50, volumen='500ml',
                cafeina='180mg'
            ),
        ]
        db.session.add_all(productos)
        db.session.commit()
        
        print("[OK] Base de datos inicializada con datos de ejemplo")
    
    
    # Entry point
if __name__ == '__main__':
    # Crear app
    app = create_app('development')
    
    # Inicializar base de datos
    init_db(app)
    
    # Ejecutar servidor
    print("")
    print("="*50)
    print("Energy Boost Commerce - API REST")
    print("="*50)
    print("Servidor corriendo en: http://localhost:5000")
    print("API Health Check: http://localhost:5000/api/health")
    print("="*50 + "")
    
    app.run(host='0.0.0.0', port=5000, debug=True)