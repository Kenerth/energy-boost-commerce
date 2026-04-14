import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { PRODUCTS } from '@/data/products';
import { Category } from '@/types/store';
import heroCan from '@/assets/hero-can.png';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

  const filteredProducts = selectedCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === selectedCategory);

  const featuredProducts = PRODUCTS.filter(p => p.featured);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center gap-8">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 space-y-6 text-center md:text-left"
          >
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-black tracking-wider leading-tight">
              ENCIENDE TU
              <span className="block neon-text">ENERGÍA</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto md:mx-0">
              Bebidas energéticas de alto rendimiento. Sabor explosivo, energía imparable.
            </p>
            <div className="flex gap-3 justify-center md:justify-start">
              <Link to="/catalogo">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading tracking-wider px-6">
                  VER CATÁLOGO <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 flex justify-center"
          >
            <img
              src={heroCan}
              alt="VOLT Energy Drink"
              className="h-[350px] md:h-[450px] object-contain animate-float drop-shadow-[0_0_30px_hsl(82,100%,50%,0.3)]"
              width={800}
              height={1024}
            />
          </motion.div>
        </div>
        {/* Decorative gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-wider">
              PRODUCTOS <span className="neon-text">DESTACADOS</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Full Catalog */}
      <section className="py-16 bg-secondary/20" id="catalogo">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-wider mb-6">
              CATÁLOGO <span className="neon-text">COMPLETO</span>
            </h2>
            <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
          </motion.div>

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8"
          >
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>

          {filteredProducts.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No se encontraron productos en esta categoría.</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-heading text-sm font-bold tracking-wider neon-text">VOLT ENERGY</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 VOLT Energy. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
