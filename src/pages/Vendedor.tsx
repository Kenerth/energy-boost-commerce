import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { DollarSign, ShoppingCart, TrendingUp, Package, AlertTriangle, User } from 'lucide-react';
import { PRODUCTS } from '@/data/products';

const salesData = [
  { mes: 'Ene', ventas: 4200 }, { mes: 'Feb', ventas: 5800 }, { mes: 'Mar', ventas: 4900 },
  { mes: 'Abr', ventas: 7200 }, { mes: 'May', ventas: 6100 }, { mes: 'Jun', ventas: 8500 },
];

const weeklySales = [
  { dia: 'Lun', ventas: 1200 }, { dia: 'Mar', ventas: 1800 }, { dia: 'Mié', ventas: 1500 },
  { dia: 'Jue', ventas: 2100 }, { dia: 'Vie', ventas: 2800 }, { dia: 'Sáb', ventas: 3200 },
  { dia: 'Dom', ventas: 1900 },
];

const topProducts = [
  { name: 'VOLT Thunder', ventas: 156 },
  { name: 'VOLT Zero', ventas: 142 },
  { name: 'VOLT Mango Blitz', ventas: 128 },
  { name: 'VOLT Black Gold', ventas: 89 },
  { name: 'VOLT Quick Shot', ventas: 234 },
];

const categorySales = [
  { name: 'Clásicas', value: 35 },
  { name: 'Sin Azúcar', value: 28 },
  { name: 'Tropicales', value: 18 },
  { name: 'Premium', value: 10 },
  { name: 'Shots', value: 9 },
];

const lowStockProducts = PRODUCTS.filter(p => p.stock < 50);

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

const Vendedor = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-wider">
            PANEL DE <span className="neon-text">VENTAS</span>
          </h1>
          <span className="text-xs text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full border border-border flex items-center gap-2">
            <User className="h-3 w-3" /> Vendedor
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={DollarSign} label="Ventas del mes" value="$36,700" trend="12.5%" />
          <StatCard icon={ShoppingCart} label="Pedidos" value="278" trend="8.2%" />
          <StatCard icon={TrendingUp} label="Ticket promedio" value="$132" />
          <StatCard icon={Package} label="Productos" value={String(PRODUCTS.length)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-card rounded-lg p-5">
            <h3 className="font-heading text-sm font-semibold tracking-wider text-muted-foreground mb-4">
              VENTAS MENSUALES
            </h3>
            <ResponsiveContainer width="100%" height={250}>
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
            <h3 className="font-heading text-sm font-semibold tracking-wider text-muted-foreground mb-4">
              VENTAS DIARIAS (SEMANA ACTUAL)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="dia" stroke="hsl(220, 10%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(220, 10%, 55%)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 15%, 18%)', borderRadius: '8px', color: '#fff' }} />
                <Legend />
                <Line type="monotone" dataKey="ventas" stroke="hsl(185, 100%, 50%)" strokeWidth={2} dot={{ fill: 'hsl(185, 100%, 50%)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card rounded-lg p-5">
            <h3 className="font-heading text-sm font-semibold tracking-wider text-muted-foreground mb-4">
              PRODUCTOS MÁS VENDIDOS
            </h3>
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-heading font-bold text-muted-foreground w-6">{i + 1}</span>
                    <span className="text-sm font-medium">{p.name}</span>
                  </div>
                  <span className="text-sm font-heading text-primary">{p.ventas} uds</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-lg p-5">
            <h3 className="font-heading text-sm font-semibold tracking-wider text-muted-foreground mb-4">
              VENTAS POR CATEGORÍA
            </h3>
            <div className="space-y-3">
              {categorySales.map((c, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <span className="text-sm">{c.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${c.value}%` }} />
                    </div>
                    <span className="text-xs font-heading text-muted-foreground w-8">{c.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {lowStockProducts.length > 0 && (
          <div className="glass-card rounded-lg p-5 mt-6">
            <h3 className="font-heading text-sm font-semibold tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-neon-orange" />
              PRODUCTOS CON STOCK BAJO
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.category}</p>
                  </div>
                  <span className="text-xs font-heading font-bold text-destructive px-2 py-1 bg-destructive/20 rounded">
                    {p.stock} uds
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vendedor;