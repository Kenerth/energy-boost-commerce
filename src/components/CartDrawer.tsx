import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, CreditCard } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, subtotal, tax, total, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={toggleCart}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 glass-card border-l border-border/50 flex flex-col"
          >
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold tracking-wider neon-text">CARRITO</h2>
              <button onClick={toggleCart} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="font-heading text-sm">CARRITO VACÍO</p>
                  <p className="text-xs mt-1">Agrega productos para comenzar</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-xs font-semibold truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">${item.product.price.toFixed(2)} c/u</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 rounded bg-muted hover:bg-muted/80 text-foreground"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 rounded bg-muted hover:bg-muted/80 text-foreground"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="font-heading text-sm font-bold text-primary w-16 text-right">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                    <button onClick={() => removeItem(item.product.id)} className="p-1 text-destructive hover:text-destructive/80">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-4 border-t border-border/50 space-y-3">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>IVA (16%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-heading font-bold text-lg pt-2 border-t border-border/30">
                    <span>Total</span>
                    <span className="neon-text">${total.toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  onClick={() => { toggleCart(); navigate('/checkout'); }}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-heading tracking-wider"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  PAGAR AHORA
                </Button>
                <button onClick={clearCart} className="w-full text-xs text-muted-foreground hover:text-destructive transition-colors">
                  Vaciar carrito
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
