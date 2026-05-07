export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio_base: number;
  precio_descuento: number;
  precio: number;
  tiene_descuento: boolean;
  imagen: string;
  categoria: CategoryInfo | null;
  stock: number;
  min_stock: number;
  volumen: string;
  cafeina: string;
  featured?: boolean;
}

export interface CategoryInfo {
  id: number;
  nombre: string;
  descripcion: string;
  icono: string;
}

export type Category = 'clasicas' | 'sin-azucar' | 'tropicales' | 'premium' | 'shots';

export const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: 'clasicas', label: 'Clásicas', icon: '⚡' },
  { id: 'sin-azucar', label: 'Sin Azúcar', icon: '🍃' },
  { id: 'tropicales', label: 'Tropicales', icon: '🌴' },
  { id: 'premium', label: 'Premium', icon: '👑' },
  { id: 'shots', label: 'Shots', icon: '💉' },
];

export interface CartItem {
  product: Product;
  quantity: number;
}

export type UserRole = 'cliente' | 'admin' | 'vendedor';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: number;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  date: string;
  userId: number;
}