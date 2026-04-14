import { motion } from 'framer-motion';
import { ShoppingCart, Zap } from 'lucide-react';
import { Product } from '@/types/store';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const categoryColors: Record<string, string> = {
    clasicas: 'bg-neon-green/10 text-neon-green border-neon-green/30',
    'sin-azucar': 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30',
    tropicales: 'bg-neon-orange/10 text-neon-orange border-neon-orange/30',
    premium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    shots: 'bg-red-500/10 text-red-400 border-red-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="glass-card rounded-lg overflow-hidden group"
    >
      <div className="aspect-square bg-secondary/50 flex items-center justify-center relative overflow-hidden">
        <Zap className="h-16 w-16 text-primary/20 group-hover:text-primary/40 transition-colors" />
        {product.featured && (
          <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-sm font-heading">
            DESTACADO
          </span>
        )}
        {product.stock < 50 && (
          <span className="absolute top-2 left-2 bg-destructive/80 text-destructive-foreground text-xs font-bold px-2 py-1 rounded-sm">
            ¡Últimas!
          </span>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-sm font-semibold tracking-wide">{product.name}</h3>
          <span className="font-heading text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${categoryColors[product.category] || ''}`}>
            {product.category}
          </span>
          <span className="text-xs text-muted-foreground">{product.volume}</span>
          <span className="text-xs text-muted-foreground">☕ {product.caffeine}</span>
        </div>

        <Button
          onClick={() => addItem(product)}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-heading text-xs tracking-wider"
          size="sm"
        >
          <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
          AGREGAR
        </Button>
      </div>
    </motion.div>
  );
}
