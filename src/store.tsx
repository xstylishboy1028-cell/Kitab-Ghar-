/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book, CartItem, Order, ToastMessage } from './types';

interface StoreType {
  cart: CartItem[];
  wishlist: number[];
  orders: Order[];
  user: string | null;
  toasts: ToastMessage[];
  coupon: string | null;
  discount: number;
  add: (b: Book, qty?: number) => void;
  remove: (id: number) => void;
  setQty: (id: number, q: number) => void;
  clear: () => void;
  toggleWishlist: (id: number) => void;
  isWishlisted: (id: number) => boolean;
  addOrder: (order: Order) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  login: (name: string) => void;
  logout: () => void;
  subtotal: number;
  shipping: number;
  total: number;
  count: number;
}

const Store = createContext<StoreType | null>(null);

export const useStore = () => {
  const s = useContext(Store);
  if (!s) throw new Error('useStore must be used within a StoreProvider');
  return s;
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kg_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('kg_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('kg_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [user, setUser] = useState<string | null>(() => {
    try {
      return localStorage.getItem('kg_user');
    } catch {
      return null;
    }
  });

  const [coupon, setCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('kg_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('kg_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('kg_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('kg_user', user);
      } else {
        localStorage.removeItem('kg_user');
      }
    } catch {
      // ignore
    }
  }, [user]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const add = (b: Book, qty: number = 1) => {
    setCart((p) => {
      const ex = p.find((i) => i.id === b.id);
      if (ex) {
        return p.map((i) => (i.id === b.id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...p, { ...b, qty }];
    });
    showToast(`"${b.title}" added to your cart! 📚`, 'success');
  };

  const remove = (id: number) => {
    setCart((p) => p.filter((i) => i.id !== id));
    showToast('Item removed from cart', 'info');
  };

  const setQty = (id: number, q: number) => {
    if (q < 1) return;
    setCart((p) => p.map((i) => (i.id === id ? { ...i, qty: q } : i)));
  };

  const clear = () => setCart([]);

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from Wishlist', 'info');
        return prev.filter((i) => i !== id);
      } else {
        showToast('Saved to Wishlist! ❤️', 'success');
        return [...prev, id];
      }
    });
  };

  const isWishlisted = (id: number) => wishlist.includes(id);

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'KITAB10') {
      setCoupon('KITAB10');
      setDiscountPercent(10);
      showToast('Coupon "KITAB10" applied! 10% discount added 🎉', 'success');
      return { success: true, message: '10% discount applied!' };
    }
    if (clean === 'AZADI20') {
      setCoupon('AZADI20');
      setDiscountPercent(20);
      showToast('Coupon "AZADI20" applied! 20% discount added 🎉', 'success');
      return { success: true, message: '20% discount applied!' };
    }
    showToast('Invalid coupon code. Try KITAB10', 'error');
    return { success: false, message: 'Invalid coupon code. Try KITAB10' };
  };

  const removeCoupon = () => {
    setCoupon(null);
    setDiscountPercent(0);
    showToast('Coupon removed', 'info');
  };

  const login = (name: string) => {
    setUser(name);
    showToast(`Welcome back, ${name}! 👋`, 'success');
  };

  const logout = () => {
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = Math.round((subtotal * discountPercent) / 100);
  const priceAfterDiscount = Math.max(0, subtotal - discount);
  const shipping = subtotal > 0 && priceAfterDiscount < 2000 ? 150 : 0;
  const total = subtotal > 0 ? priceAfterDiscount + shipping : 0;
  const count = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <Store.Provider
      value={{
        cart,
        wishlist,
        orders,
        user,
        toasts,
        coupon,
        discount,
        add,
        remove,
        setQty,
        clear,
        toggleWishlist,
        isWishlisted,
        addOrder,
        applyCoupon,
        removeCoupon,
        showToast,
        removeToast,
        login,
        logout,
        subtotal,
        shipping,
        total,
        count
      }}
    >
      {children}
    </Store.Provider>
  );
};