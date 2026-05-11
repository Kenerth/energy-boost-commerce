# Documentación Técnica - API REST

## Energy Boost Commerce - Entrega Final (100%)

### Tecnologías Utilizadas
- **Backend**: Python 3.14 + Flask 3.0
- **Base de datos**: SQLite (SQLAlchemy)
- **Autenticación**: JWT (Flask-JWT-Extended)
- **Frontend**: React 18 + TypeScript + Vite
- **PDF**: fpdf2

---

## Endpoints de la API

### 1. AUTENTICACIÓN (`/api/auth`)

| Método | Endpoint | Descripción | Acceso | Estado |
|--------|----------|-------------|--------|--------|
| POST | `/api/auth/register` | Registrar nuevo usuario | Público | ✅ |
| POST | `/api/auth/login` | Iniciar sesión | Público | ✅ |
| GET | `/api/auth/me` | Ver usuario actual | JWT | ✅ |
| PUT | `/api/auth/me` | Actualizar perfil | JWT | ✅ |
| GET | `/api/auth/usuarios` | Listar usuarios | Admin | ✅ |

**Cuentas de prueba:**
- Admin: admin@volt.com / admin
- Vendedor: vendedor@volt.com / vendedor
- Cliente: cliente@volt.com / cliente

---

### 2. PRODUCTOS (`/api/productos`)

| Método | Endpoint | Descripción | Acceso | Estado |
|--------|----------|-------------|--------|--------|
| GET | `/api/productos` | Listar productos | Público | ✅ |
| GET | `/api/productos/<id>` | Ver producto | Público | ✅ |
| POST | `/api/productos` | Crear producto | Admin | ✅ |
| PUT | `/api/productos/<id>` | Actualizar producto | Admin | ✅ |
| DELETE | `/api/productos/<id>` | Eliminar producto | Admin | ✅ |
| GET | `/api/productos/low-stock` | Productos con stock bajo | Admin/Vendedor | ✅ |
| PUT | `/api/productos/<id>/stock` | Actualizar stock | Admin/Vendedor | ✅ |
| PUT | `/api/productos/<id>/descuento` | Establecer descuento | Admin | ✅ |

**Parámetros de query:**
- `?categoria=clasicas` - Filtrar por categoría
- `?buscar=volt` - Buscar por nombre
- `?lowStock=true` - Solo bajo stock

---

### 3. CATEGORÍAS (`/api/categorias`)

| Método | Endpoint | Descripción | Acceso | Estado |
|--------|----------|-------------|--------|--------|
| GET | `/api/categorias` | Listar categorías | Público | ✅ |
| POST | `/api/categorias` | Crear categoría | Admin | ✅ |
| DELETE | `/api/categorias/<id>` | Eliminar categoría | Admin | ✅ |

---

### 4. CARRITO (`/api/cart`)

| Método | Endpoint | Descripción | Acceso | Estado |
|--------|----------|-------------|--------|--------|
| GET | `/api/cart` | Ver carrito + totales | JWT | ✅ |
| POST | `/api/cart/items` | Agregar producto | JWT | ✅ |
| PUT | `/api/cart/items/<id>` | Actualizar cantidad | JWT | ✅ |
| DELETE | `/api/cart/items/<id>` | Eliminar item | JWT | ✅ |
| DELETE | `/api/cart` | Vaciar carrito | JWT | ✅ |
| POST | `/api/cart/checkout` | Finalizar compra | JWT | ✅ |

**Funcionalidades del checkout:**
- ✅ Valida stock disponible
- ✅ Crea pedido en DB
- ✅ Resta stock automáticamente
- ✅ Genera detalles del pedido
- ✅ Limpia el carrito
- ✅ Retorna ID del pedido creado

---

### 5. PEDIDOS (`/api/orders` y `/api/pedidos`)

| Método | Endpoint | Descripción | Acceso | Estado |
|--------|----------|-------------|--------|--------|
| GET | `/api/orders` | Mi historial | JWT | ✅ |
| GET | `/api/orders/<id>` | Ver pedido | JWT | ✅ |
| GET | `/api/orders/all` | Todos los pedidos | Admin/Vendedor | ✅ |
| PUT | `/api/orders/<id>/status` | Cambiar estado | Admin/Vendedor | ✅ |
| GET | `/api/pedidos/<id>/factura` | Descargar PDF | JWT | ✅ |

**Estados de pedido:** `pendiente` → `processing` → `shipped` → `delivered` / `cancelled`

**Funcionalidades especiales:**
- Al cancelar pedido: ✅ Devuelve el stock
- Factura PDF: ✅ Genera y descarga automáticamente

---

### 6. REPORTES (`/api/reports`)

| Método | Endpoint | Descripción | Acceso | Estado |
|--------|----------|-------------|--------|--------|
| GET | `/api/reports/ventas` | Ventas por período | Admin/Vendedor | ✅ |
| GET | `/api/reports/productos-mas-vendidos` | Top productos | Admin/Vendedor | ✅ |
| GET | `/api/reports/clientes-frecuentes` | Top clientes | Admin/Vendedor | ✅ |
| GET | `/api/reports/inventario` | Resumen inventario | Admin/Vendedor | ✅ |
| GET | `/api/reports/dashboard` | Dashboard completa | Admin/Vendedor | ✅ |

---

### 7. PROVEEDORES (`/api/proveedores`)

| Método | Endpoint | Descripción | Acceso | Estado |
|--------|----------|-------------|--------|--------|
| GET | `/api/proveedores` | Listar proveedores | Admin | ✅ |
| POST | `/api/proveedores` | Crear proveedor | Admin | ✅ |
| GET | `/api/proveedores/<id>` | Ver proveedor | Admin | ✅ |
| PUT | `/api/proveedores/<id>` | Actualizar proveedor | Admin | ✅ |
| DELETE | `/api/proveedores/<id>` | Eliminar proveedor | Admin | ✅ |
| POST | `/api/proveedores/<id>/compras` | Registrar compra | Admin | ✅ |
| GET | `/api/proveedores/<id>/compras` | Historial compras | Admin | ✅ |

**Funcionalidades:**
- ✅ CRUD completo de proveedores
- ✅ Registro de compras aumenta stock
- ✅ Historial de compras por proveedor

---

### 8. HEALTH CHECK

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Verificar que la API funciona |

---

## Cómo ejecutar el proyecto

### Backend:
```bash
cd backend
pip install -r requirements.txt
python app.py
```
- API disponible en: http://localhost:5000
- Health check: http://localhost:5000/api/health

### Frontend:
```bash
npm install
npm run dev
```
- Frontend disponible en: http://localhost:8080

### Script automatizado (Windows):
```bash
iniciar.bat
```

---

## Modelo de Datos

### Tablas de la base de datos:

1. **usuarios** - Usuarios del sistema (id, nombre, email, password_hash, rol)
2. **categorias** - Categorías de productos (id, nombre, descripcion, icono)
3. **productos** - Catálogo de productos (id, nombre, descripcion, precio_base, precio_descuento, stock, min_stock, etc.)
4. **proveedores** - Registro de proveedores
5. **compras_proveedor** - Compras a proveedores (aumenta stock)
6. **pedidos** - Pedidos de clientes (con estados)
7. **pedido_detalles** - Items de cada pedido

---

## Características implementadas (100%)

- ✅ Catálogo con precios dinámicos (descuentos)
- ✅ Carrito de compras con persistencia
- ✅ Checkout con simulación de pago
- ✅ **Resta automática de stock al comprar**
- ✅ **Devolución de stock al cancelar pedido**
- ✅ 3 roles de usuario (admin, vendedor, cliente)
- ✅ Inventario con alertas de stock mínimo
- ✅ Pedidos con estados (flujo completo)
- ✅ Generación de factura PDF
- ✅ Reportes estadísticos
- ✅ Gestión de proveedores
- ✅ Registro de compras a proveedores

---

## Problemas técnicos resueltos

1. **JWT Identity**: Conversión de string a int al leer identidad
2. **Estructura del Carrito**: Validación de datos entre componentes
3. **Stock automático**: Lógica completa de resta/devolución de stock
4. **CORS**: Configuración con supports_credentials=True
5. **Factura PDF**: Generación con fpdf2 y descarga via fetch + blob

---

## Headers requeridos

Para endpoints protegidos:
```javascript
headers: {
  'Authorization': 'Bearer ' + token,
  'Content-Type': 'application/json'
}
```

---

*Documento generado para entrega final - Mayo 2026*
*Energy Boost Commerce - 100% Completado*