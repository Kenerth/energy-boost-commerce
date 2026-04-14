import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { items, subtotal, tax, total, clearCart } = useCart();
  const [step, setStep] = useState<'review' | 'payment' | 'success'>('review');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePayment = () => {
    setLoading(true);
    // Simulate PayPal sandbox
    setTimeout(() => {
      setLoading(false);
      setStep('success');
      clearCart();
    }, 2500);
  };

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="font-heading text-lg text-muted-foreground mb-4">CARRITO VACÍO</p>
          <Button onClick={() => navigate('/catalogo')} className="bg-primary text-primary-foreground font-heading tracking-wider">
            IR AL CATÁLOGO
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-4">
          <CheckCircle className="h-20 w-20 text-primary mx-auto" />
          <h2 className="font-heading text-2xl font-bold neon-text">¡PAGO EXITOSO!</h2>
          <p className="text-muted-foreground">Tu pedido ha sido procesado correctamente.</p>
          <p className="text-xs text-muted-foreground">(Simulación PayPal Sandbox)</p>
          <Button onClick={() => navigate('/')} className="bg-primary text-primary-foreground font-heading tracking-wider">
            VOLVER AL INICIO
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-wider text-center mb-8">
          <span className="neon-text">CHECKOUT</span>
        </h1>

        {step === 'review' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="glass-card rounded-lg p-4 space-y-3">
              <h3 className="font-heading text-sm font-semibold tracking-wider text-muted-foreground">RESUMEN DEL PEDIDO</h3>
              {items.map(item => (
                <div key={item.product.id} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                  </div>
                  <span className="font-heading text-sm font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>IVA (16%)</span><span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-heading font-bold text-xl pt-2 border-t border-border/30">
                <span>Total</span><span className="neon-text">${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={() => setStep('payment')}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-heading tracking-wider py-6 text-base"
            >
              CONTINUAR AL PAGO
            </Button>
          </motion.div>
        )}

        {step === 'payment' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="glass-card rounded-lg p-6 space-y-4">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 bg-[#0070ba]/10 text-[#0070ba] px-4 py-2 rounded-full border border-[#0070ba]/30">
                  <CreditCard className="h-4 w-4" />
                  <span className="font-heading text-xs tracking-wider">PAYPAL SANDBOX</span>
                </div>
                <p className="text-xs text-muted-foreground">Simulación de pasarela de pago</p>
              </div>

              <div className="space-y-3">
                <input
                  placeholder="Correo electrónico"
                  defaultValue="test@sandbox.paypal.com"
                  className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50"
                />
                <input
                  placeholder="Contraseña"
                  type="password"
                  defaultValue="sandbox123"
                  className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50"
                />
              </div>

              <div className="text-center pt-2 border-t border-border/30">
                <p className="font-heading text-lg font-bold">Total: <span className="neon-text">${total.toFixed(2)}</span></p>
              </div>
            </div>

            <Button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-foreground font-heading tracking-wider py-6 text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  PROCESANDO...
                </>
              ) : (
                'PAGAR CON PAYPAL'
              )}
            </Button>

            <button onClick={() => setStep('review')} className="w-full text-xs text-muted-foreground hover:text-foreground">
              ← Volver al resumen
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
