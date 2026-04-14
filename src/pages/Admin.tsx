import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Package, DollarSign, ShoppingCart, Users, TrendingUp, AlertTriangle, Calendar } from 'lucide-react';
import { PRODUCTS, getLowStockProducts, getProductStockStatus } from '@/data/products';

const salesData = [
  { mes: 'Ene', ventas: 4200 }, { mes: 'Feb', ventas: 5800 }, { mes: 'Mar', ventas: 4900 },
  { mes: 'Abr', ventas: 7200 }, { mes: 'May', ventas: 6100 }, { mes: 'Jun', ventas: 8500 },
];

const categoryData = [
  { name: 'Clásicas', value: 35, color: 'hsl(82, 100%, 50%)' },
  { name: 'Sin Azúcar', value: 25, color: 'hsl(185, 100%, 50%)' },
  { name: 'Tropicales', value: 20, color: 'hsl(25, 100%, 55%)' },
  { name: 'Premium', value: 12, color: 'hsl(50, 100%, 50%)' },
  { name: 'Shots', value: 8, color: 'hsl(0, 72%, 51%)' },
];

const ordersData = [
  { dia: 'Lun', pedidos: 23, ingresos: 890 },
  { dia: 'Mar', pedidos: 31, ingresos: 1240 },
  { dia: 'Mié', pedidos: 28, ingresos: 1050 },
  { dia: 'Jue', pedidos: 45, ingresos: 1890 },
  { dia: 'Vie', pedidos: 52, ingresos: 2100 },
  { dia: 'Sáb', pedidos: 61, ingresos: 2650 },
  { dia: 'Dom', pedidos: 38, ingresos: 1500 },
];

const topProductsData = [
  { name: 'VOLT Thunder', ventas: 156, ingresos: 466.44 },
  { name: 'VOLT Zero', ventas: 142, ingresos: 467.18 },
  { name: 'VOLT Quick Shot', ventas: 234, ingresos: 582.66 },
  { name: 'VOLT Mango Blitz', ventas: 128, ingresos: 446.72 },
  { name: 'VOLT Black Gold', ventas: 89, ingresos: 533.11 },
];

const lowStockProducts = getLowStockProducts();

function StatCard({ icon: Icon, label, value, trend }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; trend?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-lg p-5 space-y-2"
    >
      <div className="flex items-center justify-between">
        <Icon className="h-5 w-5 text-primary" />
        {trend && <span className="text-xs text-neon-green">▲ {trend}</span>}
      </div>
      <p className="font-heading text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </motion.div>
  );
}

const Admin = () => {
  const totalStock = PRODUCTS.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = PRODUCTS.reduce((sum, p) => sum + (p.price * p.stock), 0);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-wider">
            PANEL <span className="neon-text">ADMINISTRADOR</span>
          </h1>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full border border-border">
            <Calendar className="h-3 w-3" />
            <span>Abril 2026</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={DollarSign} label="Ingresos del mes" value="$36,700" trend="12.5%" />
          <StatCard icon={ShoppingCart} label="Pedidos totales" value="278" trend="8.2%" />
          <StatCard icon={Users} label="Clientes activos" value="1,423" trend="5.1%" />
          <StatCard icon={Package} label="Valor inventario" value={`$${totalValue.toFixed(0)}`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-card rounded-lg p-5">
            <h3 className="font-heading text-sm font-semibold tracking-wider text-muted-foreground mb-4">VENTAS MENSUALES</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="mes" stroke="hsl(220, 10%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(220, 10%, 55%)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 15%, 18%)', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="ventas" fill="hsl(82, 100%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card rounded-lg p-5">
            <h3 className="font-heading text-sm font-semibold tracking-wider text-muted-foreground mb-4">DISTRIBUCIÓN POR CATEGORÍA</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                  {categoryData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 15%, 18%)', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card rounded-lg p-5">
            <h3 className="font-heading text-sm font-semibold tracking-wider text-muted-foreground mb-4">PEDIDOS SEMANAL</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="dia" stroke="hsl(220, 10%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(220, 10%, 55%)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 15%, 18%)', borderRadius: '8px', color: '#fff' }} />
                <Legend />
                <Line type="monotone" dataKey="pedidos" stroke="hsl(82, 100%, 50%)" strokeWidth={2} dot={{ fill: 'hsl(82, 100%, 50%)' }} />
                <Line type="monotone" dataKey="ingresos" stroke="hsl(185, 100%, 50%)" strokeWidth={2} dot={{ fill: 'hsl(185, 100%, 50%)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {lowStockProducts.length > 0 && (
            <div className="glass-card rounded-lg p-5">
              <h3 className="font-heading text-sm font-semibold tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-neon-orange" />
                STOCK BAJO
              </h3>
              <div className="space-y-3">
                {lowStockProducts.map(p => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.category}</p>
                    </div>
                    <span className={`text-xs font-heading font-bold px-2 py-1 rounded ${p.stock < (p.minStock || 50) * 0.5 ? 'bg-destructive/20 text-destructive' : 'bg-neon-orange/20 text-neon-orange'}`}>
                      {p.stock} uds
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="glass-card rounded-lg p-5">
            <h3 className="font-heading text-sm font-semibold tracking-wider text-muted-foreground mb-4">PRODUCTOS MÁS VENDIDOS</h3>
            <div className="space-y-3">
              {topProductsData.map((p, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-heading font-bold text-primary w-5">{i + 1}</span>
                    <span className="text-sm font-medium">{p.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-heading text-neon-cyan">{p.ventas} uds</p>
                    <p className="text-xs text-muted-foreground">${p.ingresos.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-lg p-5">
            <h3 className="font-heading text-sm font-semibold tracking-wider text-muted-foreground mb-4">RESUMEN INVENTARIO</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total productos</span>
                <span className="font-heading font-bold">{PRODUCTS.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total unidades</span>
                <span className="font-heading font-bold">{totalStock}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Valor total</span>
                <span className="font-heading font-bold text-neon-green">${totalValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Productos bajo stock</span>
                <span className={`font-heading font-bold ${lowStockProducts.length > 0 ? 'text-neon-orange' : 'text-neon-green'}`}>
                  {lowStockProducts.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-lg p-5 mt-6">
          <h3 className="font-heading text-sm font-semibold tracking-wider text-muted-foreground mb-4">INVENTARIO COMPLETO</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 text-xs text-muted-foreground font-heading">PRODUCTO</th>
                  <th className="text-left py-2 text-xs text-muted-foreground font-heading">CATEGORÍA</th>
                  <th className="text-right py-2 text-xs text-muted-foreground font-heading">PRECIO</th>
                  <th className="text-right py-2 text-xs text-muted-foreground font-heading">STOCK</th>
                  <th className="text-right py-2 text-xs text-muted-foreground font-heading">MÍNIMO</th>
                  <th className="text-right py-2 text-xs text-muted-foreground font-heading">ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {PRODUCTS.map(p => (
                  <tr key={p.id} className="border-b border-border/20 hover:bg-secondary/30">
                    <td className="py-2.5 font-medium">{p.name}</td>
                    <td className="py-2.5 text-muted-foreground capitalize">{p.category.replace('-', ' ')}</td>
                    <td className="py-2.5 text-right font-heading">${p.price.toFixed(2)}</td>
                    <td className="py-2.5 text-right">{p.stock}</td>
                    <td className="py-2.5 text-right text-muted-foreground">{p.minStock || 50}</td>
                    <td className="py-2.5 text-right">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        getProductStockStatus(p) === 'disponible' ? 'bg-neon-green/10 text-neon-green' :
                        getProductStockStatus(p) === 'medio' ? 'bg-neon-cyan/10 text-neon-cyan' :
                        'bg-destructive/10 text-destructive'
                      }`}>
                        {getProductStockStatus(p).charAt(0).toUpperCase() + getProductStockStatus(p).slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
