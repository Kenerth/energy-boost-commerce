import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { CreditCard, CheckCircle, Loader2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { items, subtotal, tax, total, clearCart, checkout } = useCart();
  const [step, setStep] = useState<'review' | 'payment' | 'success'>('review');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pedidoId, setPedidoId] = useState<number | null>(null);
  const navigate = useNavigate();

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await checkout();
      
      if (result.ok) {
        setPedidoId(result.pedidoId || null);
        setStep('success');
      } else {
        setError(result.error || 'Error al procesar el pedido');
        setLoading(false);
      }
    } catch (err) {
      setError('Error de conexión');
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    const token = localStorage.getItem('token');
    if (!pedidoId || !token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/pedidos/${pedidoId}/factura`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Error al descargar factura:', response.status);
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `factura_pedido_${pedidoId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar factura:', error);
    }
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
          {pedidoId && (
            <p className="text-sm text-muted-foreground">Pedido #{pedidoId}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            {pedidoId && (
              <Button onClick={handleDownloadInvoice} variant="outline" className="font-heading tracking-wider">
                <FileText className="h-4 w-4 mr-2" />
                Descargar Factura
              </Button>
            )}
            <Button onClick={() => navigate('/')} className="bg-primary text-primary-foreground font-heading tracking-wider">
              VOLVER AL INICIO
            </Button>
          </div>
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
                <div key={item.id || item.producto_id || Math.random()} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{item.nombre || 'Producto'}</p>
                    <p className="text-xs text-muted-foreground">x{item.cantidad || 1}</p>
                  </div>
                  <span className="font-heading text-sm font-bold">${((item.precio || 0) * (item.cantidad || 1)).toFixed(2)}</span>
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

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive text-center">
                {error}
              </div>
            )}
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