import { useState, useCallback } from 'react';
import { CartItem } from '../types';

/**
 * @hook useCart
 * @description Encapsule la gestion d'état du panier d'achats (ajout, suppression,
 * calcul du sous-total et ouverture/fermeture du tiroir).
 */
export const useCart = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
  }, []);

  const removeItem = useCallback((index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    isCartOpen,
    cartItems,
    cartCount: cartItems.length,
    totalAmount,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    addItem,
    removeItem,
    clearCart,
  };
};
