import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface CartItem {
  id: number;
  producto_id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addItem: (productoId: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, cantidad: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
  loading: boolean;
  checkout: () => Promise<{ ok: boolean; error?: string }>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const TAX_RATE = 0.16;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const getToken = () => localStorage.getItem('token');

  const fetchCart = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  const itemCount = items.reduce((sum, i) => sum + i.cantidad, 0);

  const addItem = async (productoId: number) => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/cart/items', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ producto_id: productoId, cantidad: 1 }),
      });

      if (response.ok) {
        await fetchCart();
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: number) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (itemId: number, cantidad: number) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/cart/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cantidad }),
      });

      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = async () => {
    const token = getToken();
    if (!token) return;

    try {
      await fetch('http://localhost:5000/api/cart', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const toggleCart = () => setIsOpen(!isOpen);

  const checkout = async (): Promise<{ ok: boolean; error?: string }> => {
    const token = getToken();
    if (!token) return { ok: false, error: 'No autenticado' };

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/cart/checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setItems([]);
        setIsOpen(false);
        return { ok: true };
      } else {
        return { ok: false, error: data.error || 'Error al procesar pedido' };
      }
    } catch (error) {
      return { ok: false, error: 'Error de conexión' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        subtotal,
        tax,
        total,
        itemCount,
        loading,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}