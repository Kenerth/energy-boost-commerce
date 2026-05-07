"""
Modelos de Base de Datos
Energy Boost Commerce - Modelos SQLAlchemy
"""
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

# Instancia global de SQLAlchemy
db = SQLAlchemy()


class Usuario(db.Model):
    """
    Modelo de Usuario
    Roles: administrador, vendedor, cliente
    """
    __tablename__ = 'usuarios'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    rol = db.Column(db.String(20), nullable=False, default='cliente')  # administrador, vendedor, cliente
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones
    pedidos = db.relationship('Pedido', backref='usuario', lazy=True)
    
    def set_password(self, password):
        """Establece la contraseña hasheada"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Verifica la contraseña"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Retorna diccionario para JSON"""
        return {
            'id': self.id,
            'email': self.email,
            'nombre': self.nombre,
            'rol': self.rol,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Categoria(db.Model):
    """Modelo de Categoría de productos"""
    __tablename__ = 'categorias'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), unique=True, nullable=False)
    descripcion = db.Column(db.String(200), nullable=True)
    icono = db.Column(db.String(20), nullable=True)
    
    # Relación con productos
    productos = db.relationship('Producto', backref='categoria', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'icono': self.icono
        }


class Producto(db.Model):
    """
    Modelo de Producto
    Incluye precio_base y precio_descuento para precios dinámicos
    """
    __tablename__ = 'productos'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text)
    precio_base = db.Column(db.Float, nullable=False)  # Precio sin descuento
    precio_descuento = db.Column(db.Float, default=0)  # Precio con descuento (0 = sin descuento)
    imagen = db.Column(db.String(500))
    
    # FK
    categoria_id = db.Column(db.Integer, db.ForeignKey('categorias.id'))
    
    # Inventario
    stock = db.Column(db.Integer, default=0)
    min_stock = db.Column(db.Integer, default=50)  # Umbral mínimo de alerta
    volumen = db.Column(db.String(20))  # 500ml, 250ml, etc.
    cafeina = db.Column(db.String(20))  # 160mg, etc.
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacion con detalles de pedido
    detalles = db.relationship('PedidoDetalle', backref='producto', lazy=True)
    
    @property
    def precio(self):
        """Retorna el precio actual (con descuento si aplica)"""
        if self.precio_descuento > 0:
            return self.precio_descuento
        return self.precio_base
    
    @property
    def tiene_descuento(self):
        """Indica si tiene descuento activo"""
        return self.precio_descuento > 0
    
    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'precio_base': self.precio_base,
            'precio_descuento': self.precio_descuento,
            'precio': self.precio,  # Precio actual con descuento
            'tiene_descuento': self.tiene_descuento,
            'imagen': self.imagen,
            'categoria': self.categoria.to_dict() if self.categoria else None,
            'stock': self.stock,
            'min_stock': self.min_stock,
            'volumen': self.volumen,
            'cafeina': self.cafeina
        }


class Proveedor(db.Model):
    """Modelo de Proveedor"""
    __tablename__ = 'proveedores'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    contacto = db.Column(db.String(100))
    telefono = db.Column(db.String(20))
    email = db.Column(db.String(120))
    direccion = db.Column(db.Text)
    
    # Fecha de registro
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    compras = db.relationship('CompraProveedor', backref='proveedor', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'contacto': self.contacto,
            'telefono': self.telefono,
            'email': self.email,
            'direccion': self.direccion
        }


class CompraProveedor(db.Model):
    """Modelo de Compra a proveedor (inventario)"""
    __tablename__ = 'compras_proveedor'
    
    id = db.Column(db.Integer, primary_key=True)
    proveedor_id = db.Column(db.Integer, db.ForeignKey('proveedores.id'))
    producto_id = db.Column(db.Integer, db.ForeignKey('productos.id'))
    cantidad = db.Column(db.Integer, nullable=False)
    precio_unitario = db.Column(db.Float, nullable=False)
    total = db.Column(db.Float, nullable=False)
    fecha = db.Column(db.DateTime, default=datetime.utcnow)
    notas = db.Column(db.Text)
    
    def to_dict(self):
        return {
            'id': self.id,
            'proveedor': self.proveedor.nombre if self.proveedor else None,
            'producto': self.producto.nombre if self.producto else None,
            'cantidad': self.cantidad,
            'precio_unitario': self.precio_unitario,
            'total': self.total,
            'fecha': self.fecha.isoformat() if self.fecha else None
        }


class Pedido(db.Model):
    """
    Modelo de Pedido
    Estados: pendiente, processing, shipped, delivered, cancelled
    """
    __tablename__ = 'pedidos'
    
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'))
    
    # totals
    subtotal = db.Column(db.Float, nullable=False)
    impuesto = db.Column(db.Float, nullable=False)
    total = db.Column(db.Float, nullable=False)
    
    # Estado del pedido
    estado = db.Column(db.String(20), default='pendiente')
    # Estados posibles: pendiente, processing (procesando), shipped (enviado), delivered (entregado), cancelled (cancelado)
    
    # Info adicional
    metodo_pago = db.Column(db.String(50), default='simulado')
    notas = db.Column(db.Text)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones
    detalles = db.relationship('PedidoDetalle', backref='pedido', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'usuario_id': self.usuario_id,
            'subtotal': self.subtotal,
            'impuesto': self.impuesto,
            'total': self.total,
            'estado': self.estado,
            'metodo_pago': self.metodo_pago,
            'notas': self.notas,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'detalles': [d.to_dict() for d in self.detalles]
        }


class PedidoDetalle(db.Model):
    """Detalle de un pedido (productos)"""
    __tablename__ = 'pedido_detalles'
    
    id = db.Column(db.Integer, primary_key=True)
    pedido_id = db.Column(db.Integer, db.ForeignKey('pedidos.id'))
    producto_id = db.Column(db.Integer, db.ForeignKey('productos.id'))
    
    cantidad = db.Column(db.Integer, nullable=False)
    precio_unitario = db.Column(db.Float, nullable=False)  # Precio al momento de compra
    subtotal = db.Column(db.Float, nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'producto_id': self.producto_id,
            'producto_nombre': self.producto.nombre if self.producto else None,
            'cantidad': self.cantidad,
            'precio_unitario': self.precio_unitario,
            'subtotal': self.subtotal
        }