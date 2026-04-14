# Diagrama Entidad-Relación (DER)

## Energy Boost Commerce

```
╔════════════════════════════════════════════════════════════════════════════════╗
║                        MODELO ENTIDAD - RELACIÓN                                ║
║                        ENERGY BOOST COMMERCE                                    ║
╚════════════════════════════════════════════════════════════════════════════════╝

    ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
    │   USUARIO    │         │   PRODUCTO  │         │   CATEGORÍA  │
    ├──────────────┤         ├──────────────┤         ├──────────────┤
    │ PK id        │──1:N───▶│ PK id        │──N:1───▶│ PK id        │
    │ nombre       │         │ nombre       │         │ nombre       │
    │ email        │         │ descripción  │         │ descripción   │
    │ contraseña   │         │ precio       │         └──────────────┘
    │ rol          │         │ FK categoría│
    │ fecha_registro│        │ stock        │
    └──────────────┘         │ volumen      │
                             │ cafeína      │
                             │ imagen       │
                             │ min_stock    │────────────┐
                             └──────────────┘           │
                                    │                    │
                                   1:N                   │
                                    │                    ▼
                                    ▼            ┌──────────────┐
    ┌──────────────┐        ┌──────────────┐      │    PEDIDO    │
    │   DIRECCIÓN  │        │  CARRITO     │      ├──────────────┤
    ├──────────────┤        ├──────────────┤      │ PK id        │
    │ PK id        │        │ PK id        │      │ FK usuario   │
    │ FK usuario   │──1:1───│ FK usuario   │      │ FK producto  │
    │ calle        │        │ FK producto  │      │ cantidad     │
    │ ciudad       │        │ cantidad     │      │ estado       │
    │ estado       │        │ fecha_agregado│     │ fecha_pedido │
    │ código_postal│        └──────────────┘      │ total        │
    └──────────────┘                                └──────────────┘
                                                              │
                                                              │
                            ┌─────────────────────────────────┼─────────────────────────────────┐
                            │                                 │                                 │
                            ▼                                 ▼                                 ▼
                    ┌──────────────┐                ┌──────────────┐                ┌──────────────┐
                    │ PAGO         │                │ ENVÍO        │                │ DETALLE      │
                    ├──────────────┤                ├──────────────┤                ├──────────────┤
                    │ PK id        │                │ PK id        │                │ PK id        │
                    │ FK pedido    │                │ FK pedido    │                │ FK pedido    │
                    │ método       │                │ estado       │                │ FK producto  │
                    │ estado       │                │ tracking     │                │ cantidad     │
                    │ fecha_pago   │                │ fecha_envío  │                │ precio_unit  │
                    │ amount       │                │ fecha_entrega│                │ subtotal     │
                    └──────────────┘                └──────────────┘                └──────────────┘


════════════════════════════════════════════════════════════════════════════════════════
                                    DEFINICIÓN DE ENTIDADES
════════════════════════════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                        USUARIO                                        │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ id              INTEGER         PRIMARY KEY      Identificador único                │
│ nombre          VARCHAR(100)    NOT NULL         Nombre completo del usuario       │
│ email           VARCHAR(255)    NOT NULL, UNIQUE  Correo electrónico                │
│ contraseña      VARCHAR(255)    NOT NULL         Contraseña hasheada               │
│ rol             ENUM            NOT NULL         'cliente', 'admin', 'vendedor'    │
│ created_at      TIMESTAMP       DEFAULT NOW()    Fecha de registro                │
│ updated_at      TIMESTAMP                       Última modificación                 │
└──────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                      PRODUCTO                                        │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ id              VARCHAR(50)     PRIMARY KEY      Identificador único (SKU)          │
│ nombre          VARCHAR(100)    NOT NULL         Nombre del producto               │
│ descripción     TEXT            NOT NULL         Descripción detallada              │
│ precio          DECIMAL(10,2)   NOT NULL         Precio unitario                   │
│ id_categoria    INTEGER          FOREIGN KEY      Referencia a categoría            │
│ stock           INTEGER         NOT NULL         Cantidad en inventario            │
│ min_stock       INTEGER         DEFAULT 50       Umbral mínimo de stock            │
│ volumen         VARCHAR(20)     NOT NULL         Tamaño (500ml, 250ml, etc)        │
│ cafeína         VARCHAR(20)     NOT NULL         Contenido de cafeína (mg)         │
│ imagen          VARCHAR(500)    NULL             URL de imagen                      │
│ destacado       BOOLEAN         DEFAULT FALSE   Producto destacado en home         │
│ created_at      TIMESTAMP       DEFAULT NOW()    Fecha de creación                │
│ updated_at      TIMESTAMP                       Última modificación                 │
└──────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                      CATEGORÍA                                       │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ id              INTEGER         PRIMARY KEY      Identificador único                │
│ nombre          VARCHAR(50)    NOT NULL, UNIQUE Nombre de categoría                │
│ descripción     VARCHAR(255)    NULL             Descripción de categoría           │
│ icono           VARCHAR(50)    NULL             Icono representativo                │
└──────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                       PEDIDO                                         │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ id              VARCHAR(50)     PRIMARY KEY      Identificador único (ORD-001)      │
│ id_usuario      INTEGER         FOREIGN KEY      Referencia al usuario              │
│ subtotal        DECIMAL(10,2)   NOT NULL         Subtotal sin impuestos             │
│ tax             DECIMAL(10,2)   NOT NULL         Monto del IVA (16%)               │
│ total           DECIMAL(10,2)   NOT NULL         Total incluyendo impuestos        │
│ estado          ENUM            DEFAULT 'pendiente' Estado del pedido              │
│ método_pago     VARCHAR(50)     NOT NULL         Método de pago utilizado           │
│ fecha_pedido    TIMESTAMP       DEFAULT NOW()    Fecha de creación del pedido      │
│ fecha_pago      TIMESTAMP       NULL             Fecha de confirmación de pago      │
│ observaciones   TEXT            NULL             Notas especiales del pedido        │
└──────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                   DETALLE_PEDIDO                                    │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ id              INTEGER         PRIMARY KEY      Identificador único                │
│ id_pedido       VARCHAR(50)     FOREIGN KEY      Referencia al pedido              │
│ id_producto     VARCHAR(50)     FOREIGN KEY      Referencia al producto            │
│ cantidad        INTEGER         NOT NULL         Cantidad pedida                    │
│ precio_unitario DECIMAL(10,2)   NOT NULL         Precio al momento de la compra   │
│ subtotal        DECIMAL(10,2)   NOT NULL         Subtotal (cantidad * precio)      │
└──────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                       PAGO                                           │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ id              INTEGER         PRIMARY KEY      Identificador único                │
│ id_pedido       VARCHAR(50)     FOREIGN KEY      Referencia al pedido              │
│ método          VARCHAR(50)     NOT NULL         Método de pago (PayPal, tarjeta)  │
│ estado          ENUM            NOT NULL         'pendiente', 'completado', 'fallido'│
│ amount          DECIMAL(10,2)   NOT NULL         Monto del pago                    │
│ transaction_id  VARCHAR(100)    NULL             ID de transacción externo         │
│ fecha_pago      TIMESTAMP       DEFAULT NOW()    Fecha de procesamiento            │
└──────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                        ENVÍO                                          │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ id              INTEGER         PRIMARY KEY      Identificador único                │
│ id_pedido       VARCHAR(50)     FOREIGN KEY      Referencia al pedido              │
│ estado          ENUM            DEFAULT 'pendiente' Estado del envío               │
│ número_tracking VARCHAR(100)    NULL             Número de seguimiento              │
│ fecha_envío     TIMESTAMP       NULL             Fecha de despacho                  │
│ fecha_entrega   TIMESTAMP       NULL             Fecha de entrega estimada          │
│ dirección       VARCHAR(500)    NOT NULL         Dirección de entrega              │
└──────────────────────────────────────────────────────────────────────────────────────┘


════════════════════════════════════════════════════════════════════════════════════════
                                    RELACIONES
════════════════════════════════════════════════════════════════════════════════════════

┌────────────┬────────────────────────┬────────────────┬─────────────────────────────────┐
│ RELACIÓN   │         ENTIDAD 1      │    ENTIDAD 2  │           DESCRIPCIÓN           │
├────────────┼────────────────────────┼────────────────┼─────────────────────────────────┤
│ 1:N        │ USUARIO                │ PEDIDO         │ Un usuario puede hacer         │
│            │                        │                │ muchos pedidos                  │
├────────────┼────────────────────────┼────────────────┼─────────────────────────────────┤
│ N:1        │ PRODUCTO               │ CATEGORÍA      │ Un producto pertenece a        │
│            │                        │                │ una categoría                   │
├────────────┼────────────────────────┼────────────────┼─────────────────────────────────┤
│ 1:N        │ PEDIDO                 │ DETALLE_PEDIDO│ Un pedido tiene muchos         │
│            │                        │                │ productos (líneas)             │
├────────────┼────────────────────────┼────────────────┼─────────────────────────────────┤
│ N:1        │ DETALLE_PEDIDO         │ PRODUCTO       │ Cada línea referencia          │
│            │                        │                │ un producto                     │
├────────────┼────────────────────────┼────────────────┼─────────────────────────────────┤
│ 1:1        │ PEDIDO                 │ PAGO           │ Un pedido tiene un pago        │
│            │                        │                │ (relación uno a uno)           │
├────────────┼────────────────────────┼────────────────┼─────────────────────────────────┤
│ 1:1        │ PEDIDO                 │ ENVÍO          │ Un pedido tiene un envío      │
│            │                        │                │ (relación uno a uno)           │
└────────────┴────────────────────────┴────────────────┴─────────────────────────────────┘


════════════════════════════════════════════════════════════════════════════════════════
                              REGLAS DE NEGOCIO
════════════════════════════════════════════════════════════════════════════════════════

• RN-01: El stock de un producto no puede ser negativo
• RN-02: El precio de un producto debe ser mayor a 0
• RN-03: Cuando stock < min_stock, generar alerta de reposición
• RN-04: El IVA se calcula como 16% del subtotal
• RN-05: Los roles de usuario son: cliente, administrador, vendedor
• RN-06: Un cliente solo puede ver sus propios pedidos
• RN-07: Un administrador puede ver todos los pedidos
• RN-08: El método de pago por defecto es PayPal Sandbox (simulación)

════════════════════════════════════════════════════════════════════════════════════════
                              NOTAS DEL DISEÑO
════════════════════════════════════════════════════════════════════════════════════════

• Para el primer prototipo (25%), los datos serán simulados/ficticios
• No se implementa base de datos real, se usan datos en memoria
• El modelo ER permite futura implementación con Supabase/PostgreSQL
• Las tablas de auditoría no se incluyen en esta versión inicial

════════════════════════════════════════════════════════════════════════════════════════