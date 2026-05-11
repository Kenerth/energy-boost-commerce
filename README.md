# Energy Boost Commerce

**E-commerce de bebidas energéticas - Proyecto Final (100%)**

---

## Descripción del Proyecto

Energy Boost Commerce es una aplicación web tipo e-commerce especializada en la venta de bebidas energéticas. El proyecto fue desarrollado siguiendo el **Modelo en Cascada** para cumplir con los requisitos del curso de Ingeniería de Software.

### Características Implementadas

| Módulo | Funcionalidad | Estado |
|--------|---------------|--------|
| **Catálogo** | Lista de productos con filtros por categoría, búsqueda, precios dinámicos | ✅ |
| **Carrito** | Agregar, eliminar, modificar cantidad, cálculo de total con IVA (16%) | ✅ |
| **Checkout** | Simulación de pago con PayPal Sandbox, generación de pedido | ✅ |
| **Factura PDF** | Generación automática de factura en PDF descargable | ✅ |
| **Roles** | Cliente, Administrador, Vendedor con accesos diferenciados | ✅ |
| **Inventario** | Control de stock con alertas de mínimo, resta automática al comprar | ✅ |
| **Pedidos** | Estados (pendiente → processing → shipped → delivered/cancelled) | ✅ |
| **Reportes** | Gráficos de ventas, productos más vendidos, inventario | ✅ |
| **Proveedores** | Gestión de proveedores y compras para reponer inventario | ✅ |
| **Backend API** | REST API con Flask + SQLite + JWT | ✅ |

---

## Arquitectura del Proyecto

```
energy-boost-commerce/
├── backend/                    # API REST (Flask + SQLite)
│   ├── app.py                  # Entry point de Flask
│   ├── config.py               # Configuración
│   ├── models.py               # Modelos SQLAlchemy
│   ├── API_DOCS.md             # Documentación de la API
│   └── api/                    # Blueprints de endpoints
│       ├── auth.py             # Autenticación
│       ├── products.py          # Productos e inventario
│       ├── cart.py             # Carrito y checkout
│       ├── orders.py           # Pedidos y facturas
│       ├── reports.py          # Estadísticas
│       └── providers.py        # Proveedores
│
├── src/                       # Frontend (React + TypeScript)
│   ├── components/            # Componentes reutilizables
│   ├── context/               # Estado global (Auth, Cart)
│   ├── pages/                 # Páginas principales
│   └── types/                 # Tipos TypeScript
│
├── docs/                      # Documentación del proyecto
│   ├── REQUISITOS.md          # Documento de requisitos
│   ├── CASOS_DE_USO.md        # Diagrama de casos de uso
│   ├── DIAGRAMA_ER.md         # Diagrama entidad-relación
│   └── CRONOGRAMA.md          # Cronograma del proyecto
│
├── package.json
├── iniciar.bat                # Script para ejecutar ambos servicios
└── README.md
```

---

## Tecnologías Utilizadas

### Backend
- **Python 3.14** + Flask 3.0
- **SQLAlchemy** (ORM)
- **SQLite** (Base de datos)
- **Flask-JWT-Extended** (Autenticación)
- **fpdf2** (Generación de PDFs)

### Frontend
- **React 18** + TypeScript
- **Vite** (Build tool)
- **Tailwind CSS** (Estilos)
- **Recharts** (Gráficos)
- **Framer Motion** (Animaciones)
- **React Router DOM** (Rutas)
- **Lucide React** (Iconos)

---

## Cuentas de Prueba

| Rol | Email | Contraseña | Acceso |
|-----|-------|------------|--------|
| Administrador | admin@volt.com | admin | Panel Admin: /admin |
| Vendedor | vendedor@volt.com | vendedor | Panel Ventas: /vendedor |
| Cliente | cliente@volt.com | cliente | Catálogo, Carrito, Checkout |

---

## Cómo Ejecutar el Proyecto

### Opción 1: Script automatizado (Windows)
```bash
# Ejecutar iniciar.bat que inicia ambos servicios
iniciar.bat
```

### Opción 2: Manual

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python app.py
```
- API disponible en: `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`

**Frontend:**
```bash
npm install
npm run dev
```
- Frontend disponible en: `http://localhost:8080`

---

## Flujo de una Compra

```
1. Cliente inicia sesión
2. Explora el catálogo (filtros por categoría)
3. Agrega productos al carrito
4. Revisa el carrito (cantidades, totales)
5. Checkout → Simula pago con PayPal
6. Sistema crea pedido → Resta stock automáticamente
7. Cliente ve confirmación y puede descargar factura PDF
8. Admin/Vendedor ven el pedido en sus paneles
```

---

## Módulos del Sistema

### 1. Autenticación (JWT)
- Login con email/password
- Token guardado en localStorage
- Rutas protegidas según rol

### 2. Catálogo de Productos
- 12 productos iniciales en 5 categorías
- Precios dinámicos (precio_base vs precio_descuento)
- Filtros por categoría
- Búsqueda por nombre
- Stock en tiempo real

### 3. Carrito de Compras
- Persistencia en memoria del backend
- Cálculo de subtotal, IVA (16%), total
- Validación de stock disponible

### 4. Checkout y Pedidos
- Simulación PayPal Sandbox
- Creación de pedido en DB
- **Resta automática de stock al comprar**
- Estados: pendiente → processing → shipped → delivered / cancelled
- **Si se cancela, devuelve el stock**

### 5. Factura PDF
- Generada con librería fpdf2
- Incluye: cliente, fecha, productos, cantidades, subtotal, IVA, total
- Descargable desde pantalla de confirmación

### 6. Panel Administrador (/admin)
- Dashboard con estadísticas
- Gestión de productos (CRUD)
- Gestión de categorías
- Ver todos los pedidos
- Cambiar estado de pedidos
- Ver reportes de ventas
- Gestión de proveedores

### 7. Panel Vendedor (/vendedor)
- Dashboard de ventas
- Ver productos y stock bajo
- Ver pedidos
- Reportes básicos

### 8. Reportes
- Ventas por período (mensual/semanal)
- Productos más vendidos
- Distribución por categoría
- Resumen de inventario

### 9. Proveedores
- CRUD de proveedores
- Registro de compras (reponer inventario)
- Historial de compras

---

## Reglas de Negocio Implementadas

- **RN-01**: El stock no puede ser negativo
- **RN-02**: El precio debe ser mayor a 0
- **RN-03**: Cuando stock < min_stock, generar alerta
- **RN-04**: El IVA se calcula como 16% del subtotal
- **RN-05**: Roles: cliente, administrador, vendedor
- **RN-06**: Un cliente solo ve sus propios pedidos
- **RN-07**: Un administrador puede ver todos los pedidos
- **RN-08**: Al cancelar pedido, el stock se devuelve

---

## Estado del Proyecto

| Fase | Estado |
|------|--------|
| Análisis de Requisitos | ✅ Completado |
| Diseño Inicial | ✅ Completado |
| Implementación | ✅ Completado |
| Pruebas | ✅ Completado |
| Despliegue | ✅ Completado |

**Avance**: 100% (Entrega Final)

---

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuario actual
- `GET /api/auth/usuarios` - Listar usuarios (Admin)

### Productos
- `GET /api/productos` - Listar productos
- `POST /api/productos` - Crear producto (Admin)
- `PUT /api/productos/<id>` - Actualizar (Admin)
- `DELETE /api/productos/<id>` - Eliminar (Admin)

### Carrito
- `GET /api/cart` - Ver carrito
- `POST /api/cart/items` - Agregar item
- `POST /api/cart/checkout` - Finalizar compra

### Pedidos
- `GET /api/orders` - Mi historial
- `GET /api/orders/all` - Todos los pedidos (Admin/Vendedor)
- `PUT /api/orders/<id>/status` - Cambiar estado
- `GET /api/pedidos/<id>/factura` - Descargar PDF

### Reportes
- `GET /api/reports/ventas` - Ventas
- `GET /api/reports/dashboard` - Dashboard

### Proveedores
- `GET /api/proveedores` - Listar
- `POST /api/proveedores` - Crear
- `POST /api/proveedores/<id>/compras` - Registrar compra

*Ver docs completos en `backend/API_DOCS.md`*

---

## Problemas Técnicas Resueltos

1. **JWT Identity**: Flask-JWT-Extended requiere identidad como string → conversión a int al leer
2. **Estructura del Carrito**: inconsistencia de datos entre componentes
3. **Stock en Checkout**: implementación de lógica para restar stock automáticamente
4. **CORS**: configuración con `supports_credentials=True`
5. **Factura PDF**: generación con fpdf2 y descarga via fetch + blob

---

## Entregables del Proyecto

- ✅ Código fuente completo
- ✅ Base de datos SQLite con datos de ejemplo
- ✅ Documentación técnica (API, modelos, casos de uso)
- ✅ Diagramas (ER, Casos de Uso)
- ✅ Cronograma actualizado
- ✅ Manual de usuario (implícito en la UI)

---

*Proyecto desarrollado como parte del curso de Ingeniería de Software*
*Energy Boost Commerce - Mayo 2026*