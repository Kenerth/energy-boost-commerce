export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category;
  stock: number;
  volume: string;
  caffeine: string;
  featured?: boolean;
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

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
  userId: string;
}

export type UserRole = 'customer' | 'admin';
