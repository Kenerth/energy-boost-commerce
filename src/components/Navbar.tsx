import { Link } from 'react-router-dom';
import { ShoppingCart, Zap, User, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { itemCount, toggleCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Zap className="h-7 w-7 text-primary animate-pulse-neon" />
          <span className="font-heading text-xl font-bold tracking-wider neon-text">VOLT</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Inicio</Link>
          <Link to="/catalogo" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Catálogo</Link>
          <Link to="/login" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <User className="h-4 w-4" /> Cuenta
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={toggleCart} className="relative p-2 text-foreground hover:text-primary transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
              >
                {itemCount}
              </motion.span>
            )}
          </button>
          <button className="md:hidden p-2 text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass-card border-t border-border/50 overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-3">
              <Link to="/" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground hover:text-primary">Inicio</Link>
              <Link to="/catalogo" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground hover:text-primary">Catálogo</Link>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground hover:text-primary">Cuenta</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
