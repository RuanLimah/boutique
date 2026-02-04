import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product, CartItem, CartState } from '@/types/product';
import { toast } from 'sonner';

// Cart Actions
type CartAction =
  | { type: 'ADD_TO_CART'; product: Product; quantity?: number }
  | { type: 'REMOVE_FROM_CART'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; state: CartState };

// Initial state
const initialState: CartState = {
  items: [],
  total: 0,
};

// Calculate total
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
};

// Cart reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === action.product.id
      );

      let newItems: CartItem[];
      const quantityToAdd = action.quantity || 1;

      if (existingIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      } else {
        newItems = [...state.items, { product: action.product, quantity: quantityToAdd }];
      }

      return { items: newItems, total: calculateTotal(newItems) };
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(
        (item) => item.product.id !== action.productId
      );
      return { items: newItems, total: calculateTotal(newItems) };
    }

    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        const newItems = state.items.filter(
          (item) => item.product.id !== action.productId
        );
        return { items: newItems, total: calculateTotal(newItems) };
      }

      const newItems = state.items.map((item) =>
        item.product.id === action.productId
          ? { ...item, quantity: action.quantity }
          : item
      );
      return { items: newItems, total: calculateTotal(newItems) };
    }

    case 'CLEAR_CART':
      return initialState;

    case 'LOAD_CART':
      return action.state;

    default:
      return state;
  }
};

// Context
interface CartContextType {
  cart: CartState;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Storage key
const CART_STORAGE_KEY = 'essencia-feminina-cart';

// Provider
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart) as CartState;
        dispatch({ type: 'LOAD_CART', state: parsedCart });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', product, quantity });
    toast.success(`${product.name} adicionado ao carrinho!`, {
      description: `${quantity}x R$ ${product.price.toFixed(2)}`,
    });
  };

  const removeFromCart = (productId: string) => {
    const item = cart.items.find((i) => i.product.id === productId);
    dispatch({ type: 'REMOVE_FROM_CART', productId });
    if (item) {
      toast.info(`${item.product.name} removido do carrinho`);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.info('Carrinho limpo');
  };

  const getItemQuantity = (productId: string): number => {
    const item = cart.items.find((i) => i.product.id === productId);
    return item?.quantity || 0;
  };

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
