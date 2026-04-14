# Documento de Requisitos del Proyecto

## Energy Boost Commerce - Tienda de Bebidas Energéticas

---

## 1. Información del Proyecto

| Campo | Valor |
|-------|-------|
| **Nombre del Proyecto** | Energy Boost Commerce |
| **Tipo** | E-commerce de bebidas energéticas |
| **Versión** | 1.0.0 |
| **Fecha** | Abril 2026 |
| **Metodología** | Modelo en Cascada |

---

## 2. Requisitos Funcionales

### 2.1 Catálogo de Productos

- **RF-01**: Visualizar lista de productos con imagen, nombre, precio y descripción
- **RF-02**: Filtrar productos por categoría (Clásicas, Sin Azúcar, Tropicales, Premium, Shots)
- **RF-03**: Buscar productos por nombre o descripción
- **RF-04**: Ver detalles de producto individual
- **RF-05**: Mostrar productos destacados en la página principal

### 2.2 Carrito de Compras

- **RF-06**: Agregar productos al carrito
- **RF-07**: Eliminar productos del carrito
- **RF-08**: Modificar cantidad de productos
- **RF-09**: Calcular subtotal, IVA (16%) y total
- **RF-10**: Persistir carrito durante la sesión

### 2.3 Roles de Usuario

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **Cliente** | Usuario comprador | Ver catálogo, gestionar carrito, realizar pedidos |
| **Administrador** | Gestor de la tienda | Ver dashboard, gestionar inventario, ver reportes |
| **Vendedor** | Registro de ventas | Ver ventas, registrar pedidos |

### 2.4 Inventario

- **RF-14**: Visualizar stock de productos
- **RF-15**: Alertar cuando stock < umbral mínimo (50 unidades)
- **RF-16**: Mostrar estado del producto (Disponible/Medio/Bajo)
- **RF-17**: Configurar umbral de stock mínimo

### 2.5 Reportes

- **RF-18**: Ver ventas por período (mensual/semanal)
- **RF-19**: Ver productos más vendidos
- **RF-20**: Visualizar distribución por categoría

### 2.6 Simulación de Pagos

- **RF-21**: Revisar resumen del pedido
- **RF-22**: Simular proceso de pago con PayPal Sandbox
- **RF-23**: Mostrar confirmación de pago exitoso
- **RF-24**: Generar orden de pedido

---

## 3. Requisitos No Funcionales

- **RNF-01**: Interfaz responsive (móvil y escritorio)
- **RNF-02**: Tiempos de carga < 3 segundos
- **RNF-03**: Diseño visual neon/cyberpunk
- **RNF-04**: Navegación intuitiva

---

## 4. Catálogo Inicial de Productos

| ID | Nombre | Categoría | Precio | Stock |
|----|--------|-----------|--------|-------|
| 1 | VOLT Thunder | Clásicas | $2.99 | 150 |
| 2 | VOLT Zero | Sin Azúcar | $3.29 | 120 |
| 3 | VOLT Mango Blitz | Tropicales | $3.49 | 80 |
| 4 | VOLT Black Gold | Premium | $5.99 | 40 |
| 5 | VOLT Quick Shot | Shots | $2.49 | 200 |
| 6 | VOLT Citrus Storm | Clásicas | $2.99 | 130 |
| 7 | VOLT Berry Zero | Sin Azúcar | $3.29 | 100 |
| 8 | VOLT Passion Fury | Tropicales | $3.49 | 75 |
| 9 | VOLT Platinum Ice | Premium | $6.49 | 30 |
| 10 | VOLT Nitro Shot | Shots | $3.29 | 180 |
| 11 | VOLT Watermelon Wave | Tropicales | $3.49 | 90 |
| 12 | VOLT Ultra White | Sin Azúcar | $3.49 | 110 |

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
3. El sistema añade el producto al carrito
4. El sistema actualiza el contador del carrito

### CU-03: Realizar Compra
1. El cliente revisa su carrito
2. El cliente inicia el checkout
3. El cliente completa la simulación de pago
4. El sistema confirma el pedido

### CU-04: Gestionar Inventario (Admin)
1. El administrador accede al panel admin
2. El sistema muestra el inventario
3. El sistema alerta sobre stock bajo
4. El administrador puede ajustar stock

### CU-05: Ver Reportes (Admin)
1. El administrador accede al panel
2. Selecciona el tipo de reporte
3. El sistema muestra gráficos y datos

---

## 6. Justificación del Modelo en Cascada

El modelo en cascada fue seleccionado porque:

1. **Requisitos bien definidos**: Los requisitos están claramente especificados y no cambiará durante el desarrollo.

2. **Equipo pequeño**: Un solo desarrollador/máximo 2 personas, no necesita iteraciones ágiles.

3. **Fase única clara**: Este primer avance (25%) tiene entregables específicos que requieren documentación previa.

4. **Secuencialidad**: Cada fase debe completarse antes de pasar a la siguiente:
   - Análisis → Diseño → Implementación → Pruebas

5. **Documentación obligatoria**: El proyecto académico requiere evidencia de cada fase.

**Nota**: El modelo en cascada obliga a cerrar todos los requisitos antes de comenzar la codificación, lo cual ensures que no habrá cambios costosos durante el desarrollo.

---

## 7. Registro de Acuerdos del Equipo

| Aspecto | Acuerdo |
|---------|----------|
| **Alcance** | E-commerce con catálogo, carrito, roles de usuario, inventario, reportes |
| **Roles** | Cliente (comprador), Administrador (gestor), Vendedor (ventas) |
| **Tecnología** | React + TypeScript + Vite + Tailwind |
| **Datos** | Simulados/ficticios para el primer prototipo |
| **Pagos** | Solo simulación (PayPal Sandbox) |

---

*Documento generado para el Primer Parcial - Avance del 25%*
*Proyecto Energy Boost Commerce*