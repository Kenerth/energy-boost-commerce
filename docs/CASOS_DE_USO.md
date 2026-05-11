# Diagrama de Casos de Uso

## Energy Boost Commerce - Implementación Completa

```
                     ┌─────────────────────────────────────────────┐
                     │           ENERGY BOOST COMMERCE             │
                     │           PROYECTO COMPLETADO              │
                     └─────────────────────────────────────────────┘
                                       │
            ┌──────────────────────────┼──────────────────────────┐
            │                          │                          │
            ▼                          ▼                          ▼
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│      CLIENTE        │   │   ADMINISTRADOR     │   │     VENDEDOR        │
└─────────────────────┘   └─────────────────────┘   └─────────────────────┘
            │                          │                          │
     ┌──────┴──────┐            ┌──────┴──────┐            ┌──────┴──────┐
     │             │            │             │            │             │
     ▼             ▼            ▼             ▼            ▼             ▼
┌──────────┐ ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│Ver catá- │ │Gestionar │ │Dashboard  │ │Gestionar │ │Ver ventas│ │Ver Stock │
│logo      │ │carrito   │ │Admin      │ │productos │ │reportes  │ │Bajo      │
└──────────┘ └──────────┘ └───────────┘ └──────────┘ └──────────┘ └──────────┘


══════════════════════════════════════════════════════════════════════════════════════
                            CASOS DE USO - CLIENTE
══════════════════════════════════════════════════════════════════════════════════════

                               ┌──────────────┐
                               │    ACTOR     │
                               │  (Cliente)   │
                               └──────┬───────┘
                                      │
                     ┌────────────────┼────────────────┐
                     │                │                │
                     ▼                ▼                ▼
          ┌─────────────────┐ ┌─────────────┐ ┌────────────────┐
          │  Ver Catálogo  │ │  Buscar     │ │  Agregar al    │
          │  de Productos  │ │  Productos  │ │  Carrito       │
          └─────────────────┘ └─────────────┘ └────────────────┘
                     │                │                │
                     └────────────────┼────────────────┘
                                      ▼
                               ┌──────────────┐
                               │   CARRITO    │
                               │   DE COMPRAS │
                               └──────┬───────┘
                                      │
                     ┌────────────────┼────────────────┐
                     │                │                │
                     ▼                ▼                ▼
          ┌─────────────────┐ ┌─────────────┐ ┌────────────────┐
          │  Modificar      │ │  Eliminar   │ │  Calcular      │
          │  Cantidad      │ │  Producto   │ │  Total         │
          └─────────────────┘ └─────────────┘ └────────────────┘
                                      │
                                      └────────────────┬───────────────┐
                                                       ▼               ▼
                                               ┌───────────┐   ┌────────────┐
                                               │ CHECKOUT  │   │  PAGO      │
                                               │ (Revisión)│   │ (Simulado) │
                                               └───────────┘   └────────────┘
                                                       │
                                                       ▼
                                               ┌───────────┐
                                               │ Generar   │
                                               │ Pedido    │
                                               └───────────┘
                                                       │
                                                       ▼
                                               ┌───────────┐
                                               │ Descargar │
                                               │ Factura   │
                                               │ PDF       │
                                               └───────────┘


══════════════════════════════════════════════════════════════════════════════════════
                            CASOS DE USO - ADMINISTRADOR
══════════════════════════════════════════════════════════════════════════════════════

                               ┌──────────────┐
                               │   ACTOR      │
                               │ (Administr.) │
                               └──────┬───────┘
                                      │
                     ┌────────────────┼────────────────┐
                     │                │                │
                     ▼                ▼                ▼
          ┌─────────────────┐ ┌─────────────┐ ┌────────────────┐
          │  Ver Dashboard  │ │  Gestionar  │ │  Gestionar     │
          │  Principal      │ │  Inventario │ │  Proveedores   │
          └─────────────────┘ └─────────────┘ └────────────────┘
                     │                │                │
                     └────────────────┼────────────────┘
                                      ▼
                               ┌──────────────┐
                               │   PEDIDOS    │
                               │ (Gestionar)  │
                               └──────────────┘
                                      │
                                      ▼
                               ┌──────────────┐
                               │   REPORTES   │
                               │ (Estadísticas)│
                               └──────────────┘


══════════════════════════════════════════════════════════════════════════════════════
                            CASOS DE USO - VENDEDOR
══════════════════════════════════════════════════════════════════════════════════════

                               ┌──────────────┐
                               │   ACTOR      │
                               │  (Vendedor)  │
                               └──────┬───────┘
                                      │
                     ┌────────────────┴────────────────┐
                     │                                 │
                     ▼                                 ▼
          ┌─────────────────┐                 ┌────────────────┐
          │  Ver Ventas     │                 │  Ver Stock     │
          │  y Pedidos     │                 │  Bajo          │
          └─────────────────┘                 └────────────────┘
                     │
                     ▼
          ┌─────────────────┐
          │  Cambiar       │
          │  Estado        │
          └─────────────────┘


══════════════════════════════════════════════════════════════════════════════════════
                            FLUJO DE COMPRA COMPLETO
══════════════════════════════════════════════════════════════════════════════════════

    ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
    │  LOGIN   │────▶│CATÁLOGO  │────▶│ CARRITO  │────▶│ CHECKOUT │────▶│ CONFIRMA │
    └──────────┘     └──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                                             │
                                                                            ▼
    ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
    │ ADMIN    │◀────│ FACTURA │     │  STOCK   │     │  PEDIDO  │     │PAGO OK   │
    │ PANEL    │     │   PDF   │     │  -1      │     │ CREADO   │     │          │
    └──────────┘     └──────────┘     └──────────┘     └──────────┘     └──────────┘


══════════════════════════════════════════════════════════════════════════════════════
                            DESCRIPCIÓN DETALLADA DE ACTORES
══════════════════════════════════════════════════════════════════════════════════════

┌─────────────┬───────────────────────────────────────────────────────────────────────────┐
│   ACTOR     │                         DESCRIPCIÓN                                      │
├─────────────┼───────────────────────────────────────────────────────────────────────────┤
│  Cliente    │ Usuario que:                                                            │
│             │ • Navega por el catálogo                                                │
│             │ • Busca y filtra productos                                              │
│             │ • Agrega productos al carrito                                          │
│             │ • Realiza compras (simuladas)                                           │
│             │ • Descarga facturas PDF de sus pedidos                                  │
│             │ • Ve su historial de pedidos                                            │
├─────────────┼───────────────────────────────────────────────────────────────────────────┤
│ Administrad.│ Usuario que:                                                            │
│             │ • Administra el inventario completo                                     │
│             │ • Crea, edita y elimina productos                                      │
│             │ • Gestiona categorías                                                   │
│             │ • Ve todos los pedidos y cambia estados                                 │
│             │ • Accede a reportes completos                                            │
│             │ • Gestiona proveedores y registra compras                              │
│             │ • Accede al dashboard completo                                          │
├─────────────┼───────────────────────────────────────────────────────────────────────────┤
│  Vendedor   │ Usuario que:                                                            │
│             │ • Ve las ventas y pedidos                                               │
│             │ • Cambia estado de pedidos                                             │
│             │ • Ve productos con stock bajo                                           │
│             │ • Accede a reportes básicos                                             │
└─────────────┴───────────────────────────────────────────────────────────────────────────┘


══════════════════════════════════════════════════════════════════════════════════════
                            RELACIONES DE INCLUSIÓN
══════════════════════════════════════════════════════════════════════════════════════

• "Buscar Productos" incluye → "Ver Catálogo"
• "Realizar Compra" incluye → "Revisar Carrito" + "Pagar"
• "Gestionar Inventario" incluye → "Recibir Alertas de Stock"
• "Ver Reportes" incluye → "Ver Ventas por Período"
• "Gestionar Proveedores" incluye → "Ver Historial Compras"


══════════════════════════════════════════════════════════════════════════════════════
                            LEYENDA
══════════════════════════════════════════════════════════════════════════════════════

     ┌─────────┐     ████████     ████████     Rectángulo = Actor
     │ Actor   │     │ UC-01 │     │ UC-02 │     Elipse = Caso de Uso
     └─────────┘     ████████     ████████     Flecha = Include/Extends

═══════════════════════════════════════════════════════════════════════════════════════

 LEYENDA DE RELACIONES:
     ───────  → Include (incluye)
     - - - → Extends (extiende)


═══════════════════════════════════════════════════════════════════════════════════════
                            FUNCIONALIDADES ESPECIALES IMPLEMENTADAS
═══════════════════════════════════════════════════════════════════════════════════════

1. PRECIOS DINÁMICOS
   - precio_base vs precio_descuento
   - Si precio_descuento > 0, se muestra el descuento

2. GESTIÓN DE STOCK AUTOMÁTICA
   - Al hacer checkout: stock = stock - cantidad
   - Al cancelar pedido: stock = stock + cantidad
   - Al comprar a proveedor: stock = stock + cantidad

3. FACTURA PDF AUTOMÁTICA
   - Generada con fpdf2
   - Descargable desde pantalla de confirmación
   - Incluye todos los detalles del pedido

4. ESTADOS DE PEDIDO
   pendiente → processing → shipped → delivered
   (también puede ser cancelled)


═══════════════════════════════════════════════════════════════════════════════════════

*Diagrama actualizado con implementación completa - Mayo 2026*