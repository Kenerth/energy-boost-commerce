import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { Category } from '@/types/store';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/types/store';

const Catalogo = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [search, setSearch] = useState('');
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/productos');
      const data = await response.json();
      if (data.productos) {
        setProductos(data.productos);
      }
    } catch (error) {
      console.error('Error fetching productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = productos.filter(p => {
    const matchCat = selectedCategory === 'all' || p.categoria?.nombre === selectedCategory;
    const matchSearch = p.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <p className="text-primary">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-3xl md:text-4xl font-bold tracking-wider text-center mb-8"
        >
          NUESTRO <span className="neon-text">CATÁLOGO</span>
        </motion.h1>

        <div className="max-w-md mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12 font-heading text-sm">
            NO SE ENCONTRARON PRODUCTOS
          </p>
        )}
      </div>
    </div>
  );
};

export default Catalogo;