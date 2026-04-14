# Energy Boost Commerce

**E-commerce de bebidas energéticas - Primer Avance del Proyecto (25%)**

---

## Descripción del Proyecto

Energy Boost Commerce es una aplicación web tipo e-commerce especializada en la venta de bebidas energéticas. El proyecto sigue el **Modelo en Cascada** para su desarrollo y cumple con los requisitos del primer parcial (25% de avance).

### Características Implementadas

| Módulo | Funcionalidad |
|--------|---------------|
| **Catálogo** | Lista de productos con filtros por categoría, búsqueda |
| **Carrito** | Agregar, eliminar, modificar cantidad, cálculo de total con IVA |
| **Checkout** | Simulación de pago con PayPal Sandbox |
| **Roles** | Cliente, Administrador, Vendedor |
| **Inventario** | Control de stock con alertas de mínimo |
| **Reportes** | Gráficos de ventas, productos más vendidos |

---

## Estructura del Proyecto

```
energy-boost-commerce/
├── docs/                    # Documentación del proyecto
│   ├── REQUISITOS.md       # Documento de requisitos
│   ├── CASOS_DE_USO.md     # Diagrama de casos de uso
│   └── DIAGRAMA_ER.md      # Diagrama entidad-relación
├── src/
│   ├── components/         # Componentes reutilizables
│   ├── context/           # Contextos (Auth, Cart)
│   ├── data/              # Datos simulados
│   ├── pages/             # Páginas principales
│   ├── types/             # Tipos TypeScript
│   └── ...
├── package.json
└── ...
```

---

## Cuentas de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | admin@volt.com | admin |
| Vendedor | vendedor@volt.com | vendedor |
| Cliente | cliente@volt.com | cliente |

---

## Requisitos del Primer Parcial

### 1. Documento de Requisitos
- Catálogo de productos (12 productos iniciales)
- Carrito de compras definido (agregar, eliminar, calcular total)
- Roles de usuario: Cliente, Administrador, Vendedor
- Inventario con alertas de stock mínimo
- Reportes básicos (ventas por período, productos más vendidos)
- Simulación de pagos

### 2. Diagramas
- **Casos de Uso**: Ver `docs/CASOS_DE_USO.md`
- **Entidad-Relación**: Ver `docs/DIAGRAMA_ER.md`

### 3. Justificación del Modelo en Cascada

El modelo en cascada fue seleccionado porque:

1. **Requisitos bien definidos**: Los requisitos están claramente especificados desde el inicio del proyecto académico.

2. **Equipo pequeño**: Proyecto desarrollado por un solo programador, sin necesidad de metodologías ágiles iterativas.

3. **Fases secuenciales obligatorias**: El modelo en cascada fuerza a completar cada fase antes de pasar a la siguiente:
   - Análisis de Requisitos → Diseño Inicial → Implementación → Pruebas

4. **Documentación requerida**: El modelo garantiza que toda la documentación esté lista antes de comenzar la codificación, evitando cambios costosos posteriores.

5. **Entregables académicos específicos**: Las fases del modelo están alineadas con los porcentajes de avance del curso.

### 4. Registro de Acuerdos del Equipo

| Aspecto | Acuerdo |
|---------|----------|
| Alcance | E-commerce con catálogo, carrito, roles, inventario, reportes |
| Roles definidos | Cliente (comprador), Admin (gestor), Vendedor (ventas) |
| Tecnología | React + TypeScript + Vite + Tailwind CSS |
| Datos | Simulados/ficticios para el prototipo |
| Pagos | Solo simulación (PayPal Sandbox) |

---

## Prototipo Navegable

El software entregado incluye un prototipo funcional con:

- **Pantalla de catálogo**: Muestra todos los productos con filtros por categoría y búsqueda
- **Carrito de compras**: Funcionalidad completa de agregar/eliminar productos
- **Roles de usuario**: Tres tipos de usuarios con paneles diferentes
- **Panel de Administrador**: Dashboard con estadísticas, gráficos y gestión de inventario
- **Panel de Vendedor**: Reportes de ventas y productos más vendidos
- **Checkout**: Simulación de pago con PayPal Sandbox

---

## Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

---

## Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **Estilos**: Tailwind CSS
- **Gráficos**: Recharts
- **Animaciones**: Framer Motion
- **Rutas**: React Router DOM

---

## Estado del Proyecto

| Fase | Estado |
|------|--------|
| Análisis de Requisitos | ✅ Completado |
| Diseño Inicial | ✅ Completado |
| Documentación | ✅ Completado |
| Prototipo Navegable | ✅ Completado |

**Avance**: 25% (Primer Parcial)

---

*Proyecto desarrollado como parte del curso de Ingeniería de Software*
*Energy Boost Commerce - Abril 2026*