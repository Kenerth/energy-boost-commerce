# Diagrama Entidad-Relación (DER)

## Energy Boost Commerce - Implementación Real

```
╔══════════════════════════════════════════════════════════════════════════════════════════╗
║                        MODELO ENTIDAD - RELACIÓN                                         ║
║                        ENERGY BOOST COMMERCE                                            ║
║                        IMPLEMENTADO (SQLite + SQLAlchemy)                               ║
╚══════════════════════════════════════════════════════════════════════════════════════════╝

    ┌──────────────┐         1:N          ┌──────────────┐         N:1         ┌──────────────┐
    │   USUARIO    │─────────────────────▶│   PRODUCTO  │─────────────────────▶│  CATEGORÍA  │
    ├──────────────┤                   ├──────────────┤                   ├──────────────┤
    │ PK id        │                   │ PK id        │                   │ PK id        │
    │ nombre       │                   │ nombre       │                   │ nombre       │
    │ email        │                   │ descripcion  │                   │ descripcion  │
    │ password_hash│                   │ precio_base  │                   │ icono        │
    │ rol          │                   │ precio_desc  │                   └──────────────┘
    │ created_at   │                   │ FK categoria │
    │ updated_at   │                   │ stock        │
    └──────────────┘                   │ min_stock    │
                                       │ volumen      │
                                       │ cafeina      │
                                       │ imagen       │
                                       └──────────────┘
                                              │
                                              │ 1:N (detalles)
                                              ▼
                               ┌──────────────────────────┐
                               │      PEDIDO              │
                               ├──────────────────────────┤
                               │ PK id                    │
                               │ FK usuario_id            │
                               │ subtotal                 │
                               │ impuesto                 │
                               │ total                    │
                               │ estado                   │
                               │ metodo_pago              │
                               │ notas                    │
                               │ created_at               │
                               │ updated_at               │
                               └──────────────────────────┘
                                            │
                                            │ 1:N
                                            ▼
                               ┌──────────────────────────┐
                               │   PEDIDO_DETALLE         │
                               ├──────────────────────────┤
                               │ PK id                    │
                               │ FK pedido_id             │
                               │ FK producto_id           │
                               │ cantidad                 │
                               │ precio_unitario         │
                               │ subtotal                 │
                               └──────────────────────────┘


    ┌──────────────┐                   ┌──────────────────────────┐
    │  PROVEEDOR   │  1:N              │  COMPRA_PROVEEDOR        │
    ├──────────────┤──────────────────▶├──────────────────────────┤
    │ PK id        │                   │ PK id                    │
    │ nombre       │                   │ FK proveedor_id         │
    │ contacto     │                   │ FK producto_id          │
    │ telefono     │                   │ cantidad                │
    │ email        │                   │ precio_unitario         │
    │ direccion    │                   │ total                   │
    │ created_at   │                   │ fecha                   │
    └──────────────┘                   │ notas                   │
                                       └──────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════════════════════
                                    DEFINICIÓN DE ENTIDADES
═══════════════════════════════════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                                        USUARIO                                             │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ id              INTEGER         PRIMARY KEY      Autoincremental                           │
│ nombre          VARCHAR(100)    NOT NULL         Nombre completo del usuario              │
│ email           VARCHAR(120)    NOT NULL, UNIQUE Correo electrónico                        │
│ password_hash   VARCHAR(256)    NOT NULL         Contraseña hasheada (Werkzeug)           │
│ rol             VARCHAR(20)     NOT NULL         'cliente', 'administrador', 'vendedor'    │
│ created_at      DATETIME        DEFAULT NOW()    Fecha de registro                        │
│ updated_at      DATETIME        DEFAULT NOW()    Última modificación                      │
└──────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                                      CATEGORÍA                                             │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ id              INTEGER         PRIMARY KEY      Autoincremental                          │
│ nombre          VARCHAR(50)     NOT NULL, UNIQUE  'clasicas', 'sin-azucar', etc.          │
│ descripcion     VARCHAR(200)    NULL             Descripción de categoría                 │
│ icono           VARCHAR(20)     NULL             Emoji o ícono representativo            │
└──────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                                      PRODUCTO                                              │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ id              INTEGER         PRIMARY KEY      Autoincremental                          │
│ nombre          VARCHAR(100)    NOT NULL         Nombre del producto                      │
│ descripcion     TEXT            NULL             Descripción detallada                    │
│ precio_base     FLOAT           NOT NULL         Precio sin descuento                    │
│ precio_descuento FLOAT          DEFAULT 0       Precio con descuento (0 = sin descuento) │
│ imagen          VARCHAR(500)    NULL             URL de imagen                            │
│ categoria_id    INTEGER         FOREIGN KEY     FK a categorias.id                       │
│ stock           INTEGER          DEFAULT 0       Cantidad en inventario                   │
│ min_stock       INTEGER          DEFAULT 50      Umbral mínimo de stock                   │
│ volumen         VARCHAR(20)     NULL             '500ml', '60ml', etc.                    │
│ cafeina         VARCHAR(20)     NULL             '160mg', '200mg', etc.                   │
│ created_at      DATETIME        DEFAULT NOW()   Fecha de creación                        │
│ updated_at      DATETIME        DEFAULT NOW()   Última modificación                       │
└──────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                                        PEDIDO                                               │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ id              INTEGER         PRIMARY KEY      Autoincremental                          │
│ usuario_id      INTEGER         FOREIGN KEY     FK a usuarios.id                           │
│ subtotal        FLOAT           NOT NULL        Subtotal sin impuestos                   │
│ impuesto        FLOAT           NOT NULL        Monto del IVA (16%)                      │
│ total           FLOAT           NOT NULL        Total incluyendo impuestos                │
│ estado          VARCHAR(20)     DEFAULT 'pendiente' Estado: pendiente, processing,       │
│                                                     shipped, delivered, cancelled         │
│ metodo_pago     VARCHAR(50)     DEFAULT 'simulado' Método de pago                        │
│ notas           TEXT            NULL            Notas especiales del pedido              │
│ created_at      DATETIME        DEFAULT NOW()   Fecha de creación                       │
│ updated_at      DATETIME        DEFAULT NOW()   Última modificación                       │
└──────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   PEDIDO_DETALLE                                           │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ id              INTEGER         PRIMARY KEY      Autoincremental                          │
│ pedido_id       INTEGER         FOREIGN KEY     FK a pedidos.id                          │
│ producto_id     INTEGER         FOREIGN KEY     FK a productos.id                        │
│ cantidad        INTEGER          NOT NULL        Cantidad pedida                          │
│ precio_unitario FLOAT           NOT NULL        Precio al momento de la compra           │
│ subtotal        FLOAT           NOT NULL        Cantidad * precio_unitario              │
└──────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                                        PROVEEDOR                                           │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ id              INTEGER         PRIMARY KEY      Autoincremental                          │
│ nombre          VARCHAR(100)    NOT NULL         Nombre del proveedor                    │
│ contacto        VARCHAR(100)    NULL             Nombre del contacto                      │
│ telefono        VARCHAR(20)     NULL             Teléfono                                 │
│ email           VARCHAR(120)    NULL             Correo electrónico                        │
│ direccion       TEXT            NULL            Dirección                                 │
│ created_at      DATETIME        DEFAULT NOW()   Fecha de registro                        │
└──────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                                COMPRA_PROVEEDOR                                            │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ id              INTEGER         PRIMARY KEY      Autoincremental                          │
│ proveedor_id    INTEGER         FOREIGN KEY     FK a proveedores.id                      │
│ producto_id     INTEGER         FOREIGN KEY     FK a productos.id                        │
│ cantidad        INTEGER          NOT NULL        Cantidad comprada                        │
│ precio_unitario FLOAT           NOT NULL        Precio por unidad                        │
│ total           FLOAT           NOT NULL        Cantidad * precio_unitario               │
│ fecha           DATETIME        DEFAULT NOW()   Fecha de compra                          │
│ notas           TEXT            NULL            Notas de la compra                        │
└──────────────────────────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════════════════════
                                    RELACIONES IMPLEMENTADAS
═══════════════════════════════════════════════════════════════════════════════════════════════

┌────────────┬────────────────────────┬────────────────┬─────────────────────────────────────┐
│ RELACIÓN    │         ENTIDAD 1      │    ENTIDAD 2  │           DESCRIPCIÓN              │
├────────────┼────────────────────────┼────────────────┼─────────────────────────────────────┤
│ 1:N         │ USUARIO                │ PEDIDO        │ Un usuario puede tener muchos      │
│             │                        │               │ pedidos                             │
├────────────┼────────────────────────┼────────────────┼─────────────────────────────────────┤
│ N:1         │ PRODUCTO               │ CATEGORÍA     │ Un producto pertenece a una        │
│             │                        │               │ categoría                           │
├────────────┼────────────────────────┼────────────────┼─────────────────────────────────────┤
│ 1:N         │ PEDIDO                 │ PEDIDO_DETALLE│ Un pedido tiene muchos detalles    │
│             │                        │               │ (productos)                         │
├────────────┼────────────────────────┼────────────────┼─────────────────────────────────────┤
│ N:1         │ PEDIDO_DETALLE         │ PRODUCTO      │ Cada detalle referencia un        │
│             │                        │               │ producto                            │
├────────────┼────────────────────────┼────────────────┼─────────────────────────────────────┤
│ 1:N         │ PROVEEDOR              │ COMPRA_PROV   │ Un proveedor puede tener muchas   │
│             │                        │               │ compras                             │
├────────────┼────────────────────────┼────────────────┼─────────────────────────────────────┤
│ N:1         │ COMPRA_PROV            │ PRODUCTO      │ Cada compra referencia un          │
│             │                        │               │ producto                            │
└────────────┴────────────────────────┴────────────────┴─────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════════════════════
                                    REGLAS DE NEGOCIO IMPLEMENTADAS
═══════════════════════════════════════════════════════════════════════════════════════════════

• RN-01: El stock de un producto no puede ser negativo
• RN-02: El precio de un producto debe ser mayor a 0
• RN-03: Cuando stock < min_stock, generar alerta de reposición
• RN-04: El IVA se calcula como 16% del subtotal
• RN-05: Los roles de usuario son: cliente, administrador, vendedor
• RN-06: Un cliente solo puede ver sus propios pedidos
• RN-07: Un administrador y vendedor pueden ver todos los pedidos
• RN-08: Al cancelar un pedido, el stock se devuelve al inventario
• RN-09: Al hacer checkout, el stock se resta automáticamente
• RN-10: precio_descuento = 0 significa sin descuento activo


═══════════════════════════════════════════════════════════════════════════════════════════════
                                    NOTAS DE IMPLEMENTACIÓN
═══════════════════════════════════════════════════════════════════════════════════════════════

• Base de datos: SQLite (archivo: energy_boost.db)
• ORM: SQLAlchemy con Flask-SQLAlchemy
• Backend: Flask con Blueprints por módulo
• Autenticación: JWT con Flask-JWT-Extended
• Carrito: Persistencia en memoria (diccionario Python) - se guarda por sesión

═══════════════════════════════════════════════════════════════════════════════════════════════

*Diagrama ER actualizado con implementación real - Mayo 2026*