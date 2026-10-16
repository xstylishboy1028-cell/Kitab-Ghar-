export interface Book {
  id: number;
  title: string;
  urdu: string;
  author: string;
  price: number;
  oldPrice?: number;
  category: string;
  rating: number;
  reviewsCount?: number;
  cover: string;
  desc: string;
  urduDesc?: string;
  pages: number;
  language: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem extends Book {
  qty: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  shipping: number;
  paymentMethod: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
}

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

