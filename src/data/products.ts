import { Product } from '@/types/store';

export const PRODUCTS: Product[] = [
  {
    id: '1', name: 'VOLT Thunder', description: 'Energía pura con sabor original. La descarga que necesitas para dominar el día.',
    price: 2.99, image: '', category: 'clasicas', stock: 150, minStock: 50, volume: '500ml', caffeine: '160mg', featured: true,
  },
  {
    id: '2', name: 'VOLT Zero', description: 'Todo el poder sin azúcar. Cero compromisos, máxima energía.',
    price: 3.29, image: '', category: 'sin-azucar', stock: 120, minStock: 50, volume: '500ml', caffeine: '160mg', featured: true,
  },
  {
    id: '3', name: 'VOLT Mango Blitz', description: 'Explosión tropical de mango con un golpe de energía imparable.',
    price: 3.49, image: '', category: 'tropicales', stock: 80, minStock: 50, volume: '500ml', caffeine: '150mg', featured: true,
  },
  {
    id: '4', name: 'VOLT Black Gold', description: 'Edición premium con extractos dorados. Para los que exigen lo mejor.',
    price: 5.99, image: '', category: 'premium', stock: 40, minStock: 30, volume: '500ml', caffeine: '200mg', featured: true,
  },
  {
    id: '5', name: 'VOLT Quick Shot', description: 'Concentrado de energía en formato mini. Rápido, potente, efectivo.',
    price: 2.49, image: '', category: 'shots', stock: 200, minStock: 50, volume: '60ml', caffeine: '200mg',
  },
  {
    id: '6', name: 'VOLT Citrus Storm', description: 'Tormenta cítrica que despierta todos tus sentidos.',
    price: 2.99, image: '', category: 'clasicas', stock: 130, minStock: 50, volume: '500ml', caffeine: '160mg',
  },
  {
    id: '7', name: 'VOLT Berry Zero', description: 'Frutos rojos sin azúcar. Sabor intenso, cero calorías.',
    price: 3.29, image: '', category: 'sin-azucar', stock: 100, minStock: 50, volume: '500ml', caffeine: '160mg',
  },
  {
    id: '8', name: 'VOLT Passion Fury', description: 'Maracuyá explosiva con un toque de guayaba tropical.',
    price: 3.49, image: '', category: 'tropicales', stock: 75, minStock: 50, volume: '500ml', caffeine: '150mg',
  },
  {
    id: '9', name: 'VOLT Platinum Ice', description: 'Premium helado con mentol. Frescura extrema de edición limitada.',
    price: 6.49, image: '', category: 'premium', stock: 30, minStock: 30, volume: '500ml', caffeine: '200mg',
  },
  {
    id: '10', name: 'VOLT Nitro Shot', description: 'Doble cafeína en formato shot. Para momentos que no pueden esperar.',
    price: 3.29, image: '', category: 'shots', stock: 180, minStock: 50, volume: '60ml', caffeine: '300mg',
  },
  {
    id: '11', name: 'VOLT Watermelon Wave', description: 'Onda de sandía refrescante. El sabor del verano con energía.',
    price: 3.49, image: '', category: 'tropicales', stock: 90, minStock: 50, volume: '500ml', caffeine: '150mg',
  },
  {
    id: '12', name: 'VOLT Ultra White', description: 'Sin azúcar, sin calorías, sin límites. Pureza energética.',
    price: 3.49, image: '', category: 'sin-azucar', stock: 110, minStock: 50, volume: '500ml', caffeine: '180mg',
  },
];

export const getLowStockProducts = (minStock = 50) => PRODUCTS.filter(p => p.stock < (p.minStock || minStock));

export const getProductStockStatus = (product: Product) => {
  const threshold = product.minStock || 50;
  if (product.stock > threshold * 2) return 'disponible';
  if (product.stock > threshold) return 'medio';
  return 'bajo';
};
