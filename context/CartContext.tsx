import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

type CartItem = {
  id: string;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  image: string;
};

type CartContextType = {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (product: {
    id: number;
    name: string;
    price: number;
    image: string;
  }) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  checkout: () => Promise<void>;
};

const CartContext = createContext<CartContextType>({
  cartItems: [],
  cartCount: 0,
  addToCart: async () => {},
  removeFromCart: async () => {},
  checkout: async () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (session) {
      fetchCartItems();
    }
  }, [session]);

  const fetchCartItems = async () => {
    try {
      const response = await fetch('/api/cart');
      const data = await response.json();
      setCartItems(data);
      setCartCount(
        data.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
      );
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
    }
  };

  const addToCart = async (product: {
    id: number;
    name: string;
    price: number;
    image: string;
  }) => {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          price: product.price,
          image: product.image,
        }),
      });

      if (response.ok) {
        fetchCartItems();
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      const response = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchCartItems();
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  const checkout = async () => {
    try {
      const response = await fetch('/api/cart/checkout', {
        method: 'POST',
      });

      if (response.ok) {
        setCartItems([]);
        setCartCount(0);
        alert('Order placed successfully!');
      }
    } catch (error) {
      console.error('Failed to checkout:', error);
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, cartCount, addToCart, removeFromCart, checkout }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart context
export const useCart = () => useContext(CartContext);
