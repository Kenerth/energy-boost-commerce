# Documento de Requisitos del Proyecto

## Energy Boost Commerce - Tienda de Bebidas Energéticas

---

## 1. Información del Proyecto

| Campo | Valor |
|-------|-------|
| **Nombre del Proyecto** | Energy Boost Commerce |
| **Tipo** | E-commerce de bebidas energéticas |
| **Versión** | 1.0.0 |
| **Fecha** | Mayo 2026 |
| **Metodología** | Modelo en Cascada |
| **Estado** | ✅ COMPLETADO (100%) |

---

## 2. Requisitos Funcionales

### 2.1 Catálogo de Productos ✅

- **RF-01**: Visualizar lista de productos con imagen, nombre, precio y descripción
- **RF-02**: Filtrar productos por categoría (Clásicas, Sin Azúcar, Tropicales, Premium, Shots)
- **RF-03**: Buscar productos por nombre o descripción
- **RF-04**: Ver detalles de producto individual
- **RF-05**: Mostrar productos destacados en la página principal
- **RF-06**: Mostrar precios dinámicos (precio_base vs precio_descuento)
- **RF-07**: Mostrar disponibilidad de stock en tiempo real

### 2.2 Carrito de Compras ✅

- **RF-08**: Agregar productos al carrito
- **RF-09**: Eliminar productos del carrito
- **RF-10**: Modificar cantidad de productos
- **RF-11**: Calcular subtotal, IVA (16%) y total
- **RF-12**: Persistir carrito durante la sesión (backend)
- **RF-13**: Validar stock disponible antes de agregar

### 2.3 Proceso de Compra ✅

- **RF-14**: Revisar resumen del pedido
- **RF-15**: Simular proceso de pago con PayPal Sandbox
- **RF-16**: Mostrar confirmación de pago exitoso
- **RF-17**: Generar orden de pedido
- **RF-18**: **Resta automática de stock al confirmar compra**
- **RF-19**: Generar factura PDF descargable

### 2.4 Roles de Usuario ✅

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **Cliente** | Usuario comprador | Ver catálogo, gestionar carrito, realizar pedidos, descargar facturas |
| **Administrador** | Gestor de la tienda | Dashboard, gestionar productos, inventario, pedidos, reportes, proveedores |
| **Vendedor** | Registro de ventas | Ver ventas, productos, stock bajo, pedidos |

### 2.5 Gestión de Pedidos ✅

- **RF-20**: Ver historial de pedidos (cliente)
- **RF-21**: Ver detalles de un pedido específico
- **RF-22**: Cambiar estado del pedido (admin/vendedor)
- **RF-23**: Estados: pendiente → processing → shipped → delivered / cancelled
- **RF-24**: **Devolver stock al cancelar pedido**

### 2.6 Inventario ✅

- **RF-25**: Visualizar stock de productos
- **RF-26**: Alertar cuando stock < umbral mínimo (50 unidades)
- **RF-27**: Mostrar estado del producto (Disponible/Medio/Bajo)
- **RF-28**: Configurar umbral de stock mínimo por producto
- **RF-29**: Gestión de productos (CRUD) - Admin
- **RF-30**: Gestión de categorías - Admin

### 2.7 Reportes ✅

- **RF-31**: Ver ventas por período (mensual/semanal)
- **RF-32**: Ver productos más vendidos
- **RF-33**: Visualizar distribución por categoría
- **RF-34**: Resumen de inventario (Admin/Vendedor)
- **RF-35**: Dashboard con estadísticas completas

### 2.8 Proveedores ✅

- **RF-36**: CRUD de proveedores
- **RF-37**: Registrar compras a proveedores
- **RF-38**: Historial de compras por proveedor
- **RF-39**: Agregar stock al realizar compra a proveedor

---

## 3. Requisitos No Funcionales

- **RNF-01**: Interfaz responsive (móvil y escritorio)
- **RNF-02**: Tiempos de carga < 3 segundos
- **RNF-03**: Diseño visual neon/cyberpunk
- **RNF-04**: Navegación intuitiva
- **RNF-05**: API REST con autenticación JWT
- **RNF-06**: Base de datos SQLite con SQLAlchemy

---

## 4. Catálogo de Productos

| ID | Nombre | Categoría | Precio Base | Precio Desc. | Stock | Min Stock |
|----|--------|-----------|-------------|---------------|-------|-----------|
| 1 | VOLT Thunder | Clásicas | $2.99 | - | 150 | 50 |
| 2 | VOLT Zero | Sin Azúcar | $3.29 | - | 120 | 50 |
| 3 | VOLT Mango Blitz | Tropicales | $3.49 | $2.99 | 80 | 50 |
| 4 | VOLT Black Gold | Premium | $5.99 | - | 40 | 30 |
| 5 | VOLT Quick Shot | Shots | $2.49 | $1.99 | 200 | 50 |
| 6 | VOLT Citrus Storm | Clásicas | $2.99 | - | 130 | 50 |
| 7 | VOLT Berry Zero | Sin Azúcar | $3.29 | - | 100 | 50 |
| 8 | VOLT Passion Fury | Tropicales | $3.49 | - | 75 | 50 |
| 9 | VOLT Platinum Ice | Premium | $6.49 | $5.49 | 30 | 30 |
| 10 | VOLT Nitro Shot | Shots | $3.29 | - | 180 | 50 |
| 11 | VOLT Watermelon Wave | Tropicales | $3.49 | - | 90 | 50 |
| 12 | VOLT Ultra White | Sin Azúcar | $3.49 | - | 110 | 50 |

---

## 5. Casos de Uso

### CU-01: Ver Catálogo
1. El cliente accede a la página de catálogo
2. El sistema muestra todos los productos
3. El cliente puede filtrar por categoría
4. El cliente puede buscar por nombre

### CU-02: Agregar al Carrito
1. El cliente selecciona un producto
2. El cliente hace clic en "Agregar"
3. El sistema valida el stock disponible
4. El sistema añade el producto al carrito
5. El sistema actualiza el contador del carrito

### CU-03: Realizar Compra
1. El cliente revisa su carrito
2. El cliente inicia el checkout
3. El cliente completa la simulación de pago
4. El sistema confirma el pedido
5. El sistema resta el stock automáticamente
6. El cliente puede descargar la factura PDF

### CU-04: Gestionar Inventario (Admin)
1. El administrador accede al panel admin
2. El sistema muestra el inventario
3. El sistema alerta sobre stock bajo
4. El administrador puede agregar/editar productos

### CU-05: Ver Reportes (Admin/Vendedor)
1. El usuario accede al panel correspondiente
2. Selecciona el tipo de reporte
3. El sistema muestra gráficos y datos

### CU-06: Gestionar Proveedores (Admin)
1. El administrador accede a proveedores
2. Agrega nuevo proveedor o editing existente
3. Registra compras para reponer inventario
4. El sistema aumenta el stock de productos

### CU-07: Actualizar Estado de Pedido (Admin/Vendedor)
1. El usuario ve la lista de pedidos
2. Selecciona un pedido
3. Cambia el estado (pendiente → shipped → delivered)
4. Si cancela, el stock se devuelve

---

## 6. Arquitectura del Sistema

### Frontend (React + TypeScript)
```
src/
├── components/          # Navbar, ProductCard, CartDrawer, Button
├── context/            # AuthContext, CartContext
├── pages/              # Index, Catalogo, Login, Checkout, Admin, Vendedor
└── types/              # Definiciones de tipos
```

### Backend (Flask + SQLite)
```
backend/
├── app.py              # Entry point
├── models.py           # Modelos SQLAlchemy
├── config.py           # Configuración
└── api/
    ├── auth.py         # Autenticación
    ├── products.py     # Productos e inventario
    ├── cart.py         # Carrito y checkout
    ├── orders.py       # Pedidos y facturas
    ├── reports.py      # Estadísticas
    ├── providers.py    # Proveedores
    └── helpers.py      # Funciones auxiliares
```

---

## 7. Justificación del Modelo en Cascada

El modelo en cascada fue seleccionado porque:

1. **Requisitos bien definidos**: Los requisitos están claramente especificados y no cambiará durante el desarrollo.

2. **Equipo pequeño**: Un solo desarrollador, no necesita iteraciones ágiles.

3. **Fase única clara**: El proyecto tiene entregables específicos que requieren documentación previa.

4. **Secuencialidad**: Cada fase debe completarse antes de pasar a la siguiente:
   - Análisis → Diseño → Implementación → Pruebas → Despliegue

5. **Documentación obligatoria**: El proyecto académico requiere evidencia de cada fase.

---

## 8. Registro de Acuerdos del Equipo

| Aspecto | Acuerdo |
|---------|---------|
| **Alcance** | E-commerce completo con catálogo, carrito, roles, inventario, pedidos, reportes, proveedores |
| **Roles** | Cliente (comprador), Administrador (gestor), Vendedor (ventas) |
| **Tecnología Frontend** | React + TypeScript + Vite + Tailwind |
| **Tecnología Backend** | Flask + SQLAlchemy + SQLite + JWT |
| **Pagos** | Solo simulación (PayPal Sandbox) |
| **Factura** | Generación automática en PDF |

---

## 9. Reglas de Negocio

- **RN-01**: El stock de un producto no puede ser negativo
- **RN-02**: El precio de un producto debe ser mayor a 0
- **RN-03**: Cuando stock < min_stock, generar alerta de reposición
- **RN-04**: El IVA se calcula como 16% del subtotal
- **RN-05**: Los roles de usuario son: cliente, administrador, vendedor
- **RN-06**: Un cliente solo puede ver sus propios pedidos
- **RN-07**: Un administrador puede ver todos los pedidos
- **RN-08**: Al cancelar un pedido, el stock se devuelve al inventario

---

## 10. Estado de Cumplimiento

| Requisito | Estado |
|-----------|--------|
| RF-01 al RF-07 (Catálogo) | ✅ Completado |
| RF-08 al RF-13 (Carrito) | ✅ Completado |
| RF-14 al RF-19 (Compra/Factura) | ✅ Completado |
| RF-20 al RF-24 (Pedidos) | ✅ Completado |
| RF-25 al RF-30 (Inventario) | ✅ Completado |
| RF-31 al RF-35 (Reportes) | ✅ Completado |
| RF-36 al RF-39 (Proveedores) | ✅ Completado |

---

*Documento generado para Entrega Final - 100%*
*Proyecto Energy Boost Commerce - Mayo 2026*