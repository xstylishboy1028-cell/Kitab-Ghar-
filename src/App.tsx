import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
import { useStore } from './store';
import { BOOKS, CATS, FAQS, TESTIMONIALS } from './data';
import { Book, Order } from './types';

/* ==================== TOAST COMPONENT ==================== */
const ToastContainer = () => {
  const { toasts, removeToast } = useStore();
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-xl text-white transition-all transform animate-bounce-once ${
            t.type === 'error'
              ? 'bg-rose-600'
              : t.type === 'info'
              ? 'bg-sky-600'
              : 'bg-emerald-600'
          }`}
        >
          <span className="text-sm font-medium">{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            className="ml-3 text-white/80 hover:text-white font-bold text-lg leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

/* ==================== SCROLL TO TOP ==================== */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

/* ==================== NAVBAR ==================== */
const Navbar = () => {
  const { count, wishlist, user, logout } = useStore();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      nav(`/shop?q=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
      setOpen(false);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
      {/* Top Banner */}
      <div className="bg-emerald-700 text-emerald-50 text-xs py-1.5 px-4 text-center font-medium">
        <span>✨ Free Nationwide Delivery on orders above Rs. 2,000 | Use code <b>KITAB10</b> for 10% OFF!</span>
      </div>

      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <span className="text-3xl transition transform group-hover:scale-110">📚</span>
          <div className="leading-tight">
            <span className="text-2xl font-black tracking-tight text-emerald-800 flex items-center gap-1">
              Kitab<span className="text-amber-600">Ghar</span>
            </span>
            <span className="text-[10px] block font-semibold text-gray-500 uppercase tracking-widest">
              کتاب گھر پاکستان
            </span>
          </div>
        </Link>

        {/* Quick Search Bar (Desktop) */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <input
            type="text"
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
            placeholder="Search books, Urdu novels, authors..."
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 p-1"
          >
            🔍
          </button>
        </form>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-gray-700">
          <Link to="/" className="hover:text-emerald-700 transition">Home</Link>
          <Link to="/shop" className="hover:text-emerald-700 transition">Shop</Link>
          <Link to="/shop?lang=Urdu" className="hover:text-emerald-700 text-emerald-700 font-bold transition">اردو کتب</Link>
          <Link to="/about" className="hover:text-emerald-700 transition">About</Link>
          <Link to="/contact" className="hover:text-emerald-700 transition">Contact</Link>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-3">
          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative p-2 text-gray-600 hover:text-rose-600 rounded-full hover:bg-rose-50 transition"
            title="Wishlist"
          >
            <span className="text-xl">❤️</span>
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 text-gray-600 hover:text-emerald-700 rounded-full hover:bg-emerald-50 transition flex items-center gap-1.5"
            title="Cart"
          >
            <span className="text-xl">🛒</span>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {count}
              </span>
            )}
          </Link>

          {/* User state */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-gray-200">
              <Link to="/orders" className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg font-medium">
                My Orders
              </Link>
              <div className="text-right leading-tight">
                <span className="block text-xs text-gray-400">Account</span>
                <span className="text-xs font-bold text-gray-800 max-w-[80px] truncate">{user}</span>
              </div>
              <button
                onClick={() => { logout(); nav('/'); }}
                className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1.5 rounded-lg font-semibold transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-gray-200">
              <Link
                to="/login"
                className="text-xs px-3 py-1.5 rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-xs px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-semibold shadow-sm transition"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-2xl p-1 text-gray-700 hover:text-emerald-600"
            aria-label="Toggle menu"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {open && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3 shadow-lg">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              placeholder="Search books..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-sm"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </button>
          </form>

          <div className="flex flex-col gap-2 font-medium text-gray-700 text-sm">
            <Link to="/" onClick={() => setOpen(false)} className="py-1.5 hover:text-emerald-700">Home</Link>
            <Link to="/shop" onClick={() => setOpen(false)} className="py-1.5 hover:text-emerald-700">Shop All Books</Link>
            <Link to="/shop?lang=Urdu" onClick={() => setOpen(false)} className="py-1.5 text-emerald-700 font-bold">اردو ادب و ناول</Link>
            <Link to="/wishlist" onClick={() => setOpen(false)} className="py-1.5 hover:text-emerald-700">Wishlist ({wishlist.length})</Link>
            <Link to="/about" onClick={() => setOpen(false)} className="py-1.5 hover:text-emerald-700">About Us</Link>
            <Link to="/contact" onClick={() => setOpen(false)} className="py-1.5 hover:text-emerald-700">Contact & Support</Link>
          </div>

          <div className="pt-3 border-t border-gray-100 flex gap-2">
            {user ? (
              <div className="w-full flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Hi, {user}</span>
                <div className="flex gap-2">
                  <Link
                    to="/orders"
                    onClick={() => setOpen(false)}
                    className="text-xs bg-gray-100 px-3 py-1.5 rounded-lg font-medium"
                  >
                    Orders
                  </Link>
                  <button
                    onClick={() => { logout(); setOpen(false); nav('/'); }}
                    className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg font-semibold"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center py-2 text-sm rounded-lg border border-emerald-600 text-emerald-700 font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center py-2 text-sm rounded-lg bg-emerald-600 text-white font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

/* ==================== FOOTER ==================== */
const Footer = () => (
  <footer className="bg-gray-950 text-gray-300 mt-20 border-t border-gray-800">
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
      {/* Brand info */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl">📚</span>
          <span className="text-2xl font-black text-white">Kitab<span className="text-emerald-400">Ghar</span></span>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed pr-6">
          Pakistan's trusted bookstore delivering thousands of original English and Urdu books, novels, Islamic literature, and self-help bestsellers right to your doorstep.
        </p>
        <p className="text-emerald-400 text-sm font-semibold" dir="rtl">
          کتاب گھر — علم، شعور اور خوبصورت تحریروں کا مسکن۔
        </p>
        <div className="flex gap-3 text-lg pt-2">
          <a href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-emerald-600 text-white flex items-center justify-center transition">📘</a>
          <a href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-emerald-600 text-white flex items-center justify-center transition">📸</a>
          <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-green-600 text-white flex items-center justify-center transition">💬</a>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Explore</h4>
        <ul className="space-y-2.5 text-sm">
          <li><Link to="/shop" className="hover:text-emerald-400 transition">All Books</Link></li>
          <li><Link to="/shop?lang=Urdu" className="hover:text-emerald-400 transition">Urdu Literature</Link></li>
          <li><Link to="/shop?cat=Novel" className="hover:text-emerald-400 transition">Popular Novels</Link></li>
          <li><Link to="/shop?cat=Poetry" className="hover:text-emerald-400 transition">Iqbal & Poetry</Link></li>
          <li><Link to="/wishlist" className="hover:text-emerald-400 transition">My Wishlist</Link></li>
        </ul>
      </div>

      {/* Customer Service */}
      <div>
        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Support</h4>
        <ul className="space-y-2.5 text-sm">
          <li><Link to="/about" className="hover:text-emerald-400 transition">About KitabGhar</Link></li>
          <li><Link to="/contact" className="hover:text-emerald-400 transition">Contact Us & FAQs</Link></li>
          <li><Link to="/orders" className="hover:text-emerald-400 transition">Track Your Order</Link></li>
          <li><span className="text-gray-400">Shipping: 2-4 Days</span></li>
          <li><span className="text-emerald-400 font-medium">Free Delivery &gt; Rs. 2000</span></li>
        </ul>
      </div>

      {/* Payment & Contact */}
      <div>
        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Payment Modes</h4>
        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          <span className="bg-gray-900 border border-gray-800 px-2 py-1.5 rounded text-center">💳 JazzCash</span>
          <span className="bg-gray-900 border border-gray-800 px-2 py-1.5 rounded text-center">💚 EasyPaisa</span>
          <span className="bg-gray-900 border border-gray-800 px-2 py-1.5 rounded text-center">💳 Visa / Card</span>
          <span className="bg-gray-900 border border-gray-800 px-2 py-1.5 rounded text-center">💵 COD Available</span>
        </div>
        <p className="text-xs text-gray-400">📍 Gulberg III, Lahore, Pakistan</p>
        <p className="text-xs text-gray-400 mt-1">📞 +92 300 1234567</p>
      </div>
    </div>

    <div className="border-t border-gray-900 text-center py-5 text-xs text-gray-500">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} KitabGhar Pakistan. All rights reserved.</p>
        <p className="text-gray-400 font-medium">Made with ❤️ for Pakistan's Book Lovers</p>
      </div>
    </div>
  </footer>
);

/* ==================== WHATSAPP BUTTON ==================== */
const WhatsApp = () => (
  <a
    href="https://wa.me/923001234567?text=Assalam-o-Alaikum!%20KitabGhar%20se%20kuch%20maloomat%20chahiye"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-40 group flex items-center bg-green-500 hover:bg-green-600 text-white p-3.5 rounded-full shadow-2xl transition-all transform hover:scale-105"
    title="Chat on WhatsApp"
  >
    <span className="text-2xl leading-none">💬</span>
    <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 text-sm font-bold">
      WhatsApp Help
    </span>
  </a>
);

/* ==================== BOOK CARD ==================== */
const BookCard = ({ book }: { book: Book }) => {
  const { add, toggleWishlist, isWishlisted } = useStore();
  const wishlisted = isWishlisted(book.id);
  const discountPercent = book.oldPrice
    ? Math.round(((book.oldPrice - book.price) / book.oldPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group overflow-hidden">
      {/* Cover Image Container */}
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        <Link to={`/book/${book.id}`} className="block w-full h-full">
          <img
            src={book.cover}
            alt={book.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-rose-600 text-white text-[11px] font-extrabold px-2 py-1 rounded-md shadow-sm">
            {discountPercent}% OFF
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(book.id)}
          aria-label="Wishlist"
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${
            wishlisted
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/80 hover:bg-white text-gray-700 hover:text-rose-600'
          }`}
        >
          <span className="text-sm block leading-none">{wishlisted ? '❤️' : '🤍'}</span>
        </button>

        {/* Language Pill */}
        <span className="absolute bottom-2 left-2 bg-gray-900/80 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded">
          {book.language}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">{book.category}</span>
          <div className="flex items-center gap-1 text-amber-500 font-semibold">
            <span>★</span>
            <span className="text-gray-700">{book.rating}</span>
          </div>
        </div>

        <Link to={`/book/${book.id}`} className="block">
          <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-emerald-700 transition line-clamp-1">
            {book.title}
          </h3>
          <p className="text-xs font-medium text-emerald-800/80 mt-0.5 line-clamp-1" dir="rtl">
            {book.urdu}
          </p>
        </Link>

        <p className="text-xs text-gray-500 mt-1 line-clamp-1">by {book.author}</p>

        {/* Price & Cart */}
        <div className="mt-auto pt-4 flex items-center justify-between gap-2 border-t border-gray-50">
          <div>
            <div className="text-lg font-black text-emerald-700 leading-tight">
              Rs. {book.price}
            </div>
            {book.oldPrice && (
              <span className="text-xs text-gray-400 line-through">
                Rs. {book.oldPrice}
              </span>
            )}
          </div>

          <button
            onClick={() => add(book)}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm shadow-emerald-200"
          >
            <span>+ Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ==================== HOME PAGE ==================== */
const Home = () => {
  const featured = BOOKS.filter((b) => b.isFeatured);
  const urduNovels = BOOKS.filter((b) => b.language === 'Urdu');

  return (
    <div className="space-y-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center md:text-left">
            <span className="inline-block bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              ✨ Pakistan's No. 1 Online Bookstore
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              کتابیں جو آپ کی <br />
              <span className="text-amber-400 underline decoration-amber-400/30">سوچ بدل دیں</span>
            </h1>
            <p className="text-emerald-100/90 text-base md:text-lg max-w-xl">
              Discover Pakistan's finest collection of Urdu literature, Islamic masterpieces, timeless poetry, and global English bestsellers with prompt Cash on Delivery nationwide.
            </p>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
              <Link
                to="/shop"
                className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold px-7 py-3 rounded-xl shadow-lg transition transform hover:-translate-y-0.5"
              >
                Explore All Books 📚
              </Link>
              <Link
                to="/shop?lang=Urdu"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white/20 backdrop-blur-sm transition"
              >
                اردو ناول و ادب 🖋️
              </Link>
            </div>

            {/* Quick Highlights */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-emerald-700/50 text-xs">
              <div>
                <span className="block font-black text-lg text-white">100%</span>
                <span className="text-emerald-200">Original Prints</span>
              </div>
              <div>
                <span className="block font-black text-lg text-white">2-4 Days</span>
                <span className="text-emerald-200">Fast Delivery</span>
              </div>
              <div>
                <span className="block font-black text-lg text-white">COD</span>
                <span className="text-emerald-200">Cash on Delivery</span>
              </div>
            </div>
          </div>

          {/* Hero Image Showcase */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
              <img
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80"
                alt="KitabGhar Collection"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <span className="bg-amber-500 text-gray-950 text-xs font-black px-2 py-0.5 rounded">Featured Read</span>
                  <h3 className="text-lg font-bold text-white mt-1">Special Discount Week</h3>
                  <p className="text-xs text-gray-200">Up to 40% OFF on Bestselling Urdu & English Books</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Explore by Category</h2>
            <p className="text-xs text-gray-500">Pick your favorite genre</p>
          </div>
          <Link to="/shop" className="text-xs font-bold text-emerald-700 hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {[
            { name: 'Novel', icon: '📖', urdu: 'ناول' },
            { name: 'Poetry', icon: '🖋️', urdu: 'شاعری' },
            { name: 'Self Help', icon: '🧠', urdu: 'خود شناسی' },
            { name: 'Fiction', icon: '🎭', urdu: 'فکشن' },
            { name: 'Finance', icon: '💰', urdu: 'مالیات' },
            { name: 'History', icon: '🏛️', urdu: 'تاریخ' }
          ].map((c) => (
            <Link
              key={c.name}
              to={`/shop?cat=${encodeURIComponent(c.name)}`}
              className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-emerald-500 hover:shadow-md transition text-center group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition transform">{c.icon}</div>
              <h4 className="font-bold text-sm text-gray-800">{c.name}</h4>
              <p className="text-[11px] text-emerald-700 font-medium">{c.urdu}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Books Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Popular Bestsellers 🔥</h2>
            <p className="text-sm text-gray-500">Most loved books by readers this month</p>
          </div>
          <Link to="/shop" className="text-sm font-bold text-emerald-700 hover:underline">
            See All Books →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Urdu Literature Spotlight */}
      <section className="bg-amber-50/60 py-12 border-y border-amber-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-amber-800 text-xs font-bold uppercase tracking-wider">خاص انتخاب</span>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">Urdu Adab & Novels</h2>
              <p className="text-sm text-gray-600">عمیرہ احمد، نمرہ احمد، بانو قدسیہ، علامہ اقبال اور جون ایلیا کے شاہکار</p>
            </div>
            <Link to="/shop?lang=Urdu" className="text-sm font-bold text-amber-800 hover:underline">
              مزید دیکھیں →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {urduNovels.slice(0, 4).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Value Prop */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: '🚚', title: 'Nationwide Delivery', desc: 'Fast delivery across Pakistan in 2-4 business days' },
            { icon: '💳', title: 'Easy & Flexible Payment', desc: 'Cash on Delivery, JazzCash, EasyPaisa, & Cards' },
            { icon: '🛡️', title: 'Original Quality Guarantee', desc: '100% authentic books with superior print binding' },
            { icon: '💬', title: 'Dedicated WhatsApp Support', desc: 'Instant order assistance on +92 300 1234567' }
          ].map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
              <span className="text-4xl block mb-3">{f.icon}</span>
              <h3 className="font-bold text-base text-gray-900 mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900">What Our Readers Say</h2>
          <p className="text-sm text-gray-500 mt-1">Real reviews from book lovers all across Pakistan</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-500 text-sm mb-3">
                  {'★'.repeat(t.rating)}
                </div>
                <p className="text-sm text-gray-700 italic leading-relaxed mb-3">"{t.comment}"</p>
                <p className="text-xs text-emerald-800 font-semibold mb-4" dir="rtl">"{t.urdu}"</p>
              </div>
              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{t.name}</h4>
                  <span className="text-xs text-gray-400">📍 {t.city}, Pakistan</span>
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded">Verified Buyer</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter / Promo banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-8 md:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-amber-300 text-xs font-bold uppercase tracking-wider">🎉 Special Offer</span>
            <h3 className="text-2xl md:text-3xl font-black">Get 10% Discount on Your Order</h3>
            <p className="text-sm text-emerald-100">Use promo code <span className="bg-amber-400 text-gray-900 font-mono font-black px-2 py-0.5 rounded">KITAB10</span> at checkout</p>
          </div>
          <Link
            to="/shop"
            className="bg-white hover:bg-gray-100 text-emerald-800 font-bold px-8 py-3.5 rounded-xl shadow-lg transition whitespace-nowrap"
          >
            Start Shopping Now →
          </Link>
        </div>
      </section>
    </div>
  );
};

/* ==================== SHOP PAGE ==================== */
const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q') || '';
  const cat = searchParams.get('cat') || 'All';
  const lang = searchParams.get('lang') || 'All';
  const [sort, setSort] = useState('popular');

  const setSearch = (q: string) => {
    const next = new URLSearchParams(searchParams);
    if (q) next.set('q', q);
    else next.delete('q');
    setSearchParams(next, { replace: true });
  };

  const setCat = (c: string) => {
    const next = new URLSearchParams(searchParams);
    if (c !== 'All') next.set('cat', c);
    else next.delete('cat');
    setSearchParams(next);
  };

  const setLang = (l: string) => {
    const next = new URLSearchParams(searchParams);
    if (l !== 'All') next.set('lang', l);
    else next.delete('lang');
    setSearchParams(next);
  };

  let list = BOOKS.filter((b) => {
    const s = search.toLowerCase().trim();
    const matchesSearch =
      !s ||
      b.title.toLowerCase().includes(s) ||
      b.urdu.includes(s) ||
      b.author.toLowerCase().includes(s) ||
      b.desc.toLowerCase().includes(s);

    const matchesCat = cat === 'All' || b.category.toLowerCase() === cat.toLowerCase();
    const matchesLang = lang === 'All' || b.language.toLowerCase() === lang.toLowerCase();

    return matchesSearch && matchesCat && matchesLang;
  });

  if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
  if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
  if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
  if (sort === 'pages') list = [...list].sort((a, b) => b.pages - a.pages);

  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
    setSort('popular');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Browse Bookstore</h1>
        <p className="text-sm text-gray-500 mt-1">
          Explore {BOOKS.length} books in fiction, novels, poetry, finance, and self-help.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 mb-8">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by book title, author (e.g. Umera Ahmed, Iqbal), or keywords..."
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-bold text-gray-500 mr-2">Categories:</span>
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                cat === c
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Language & Sorting Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gray-100 text-xs">
          {/* Language filter */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-500">Language:</span>
            {['All', 'Urdu', 'English'].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  lang === l
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-500">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 font-medium text-gray-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="popular">Most Popular</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="pages">Most Pages</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Active Filters Indicator */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-6">
        <span>Showing <b className="text-gray-900">{list.length}</b> books</span>
        {(search || cat !== 'All' || lang !== 'All') && (
          <button
            onClick={resetFilters}
            className="text-emerald-700 hover:underline font-bold"
          >
            Reset all filters ↺
          </button>
        )}
      </div>

      {/* Books Grid */}
      {list.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 max-w-lg mx-auto">
          <span className="text-5xl block mb-3">🔍</span>
          <h3 className="text-lg font-bold text-gray-800">No books found</h3>
          <p className="text-xs text-gray-500 mt-1 mb-4">
            We couldn't find any book matching "{search}". Try searching another title, author, or category.
          </p>
          <button
            onClick={resetFilters}
            className="bg-emerald-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-emerald-700"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {list.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

/* ==================== BOOK DETAIL ==================== */
const BookDetail = () => {
  const { id } = useParams();
  const { add, toggleWishlist, isWishlisted } = useStore();
  const nav = useNavigate();
  const [qty, setQty] = useState(1);

  const book = BOOKS.find((b) => b.id === Number(id));

  if (!book) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <span className="text-5xl block mb-3">📖</span>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Book Not Found</h2>
        <p className="text-xs text-gray-500 mb-6">The book you are looking for might have been moved or removed.</p>
        <Link to="/shop" className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm">
          Return to Shop
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(book.id);
  const related = BOOKS.filter((b) => b.category === book.category && b.id !== book.id).slice(0, 4);
  const discountPercent = book.oldPrice
    ? Math.round(((book.oldPrice - book.price) / book.oldPrice) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link to="/" className="hover:text-emerald-700">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-emerald-700">Shop</Link>
        <span>/</span>
        <Link to={`/shop?cat=${book.category}`} className="hover:text-emerald-700">{book.category}</Link>
        <span>/</span>
        <span className="text-gray-900 font-bold truncate max-w-xs">{book.title}</span>
      </div>

      {/* Main Details Grid */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm grid md:grid-cols-2 gap-10">
        {/* Book Cover Image */}
        <div className="relative flex justify-center bg-gray-50 rounded-2xl p-6 border border-gray-100">
          <div className="max-w-sm w-full aspect-[3/4] rounded-xl overflow-hidden shadow-2xl relative">
            <img
              src={book.cover}
              alt={book.title}
              className="w-full h-full object-cover"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg shadow-md">
                {discountPercent}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Book Info */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                {book.category}
              </span>
              <button
                onClick={() => toggleWishlist(book.id)}
                className={`p-2 rounded-full border transition ${
                  wishlisted
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
                title="Wishlist"
              >
                {wishlisted ? '❤️ Saved' : '🤍 Add to Wishlist'}
              </button>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mt-3 leading-tight">
              {book.title}
            </h1>
            <p className="text-xl font-bold text-emerald-800 mt-1" dir="rtl">
              {book.urdu}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Author: <span className="font-bold text-gray-900">{book.author}</span>
            </p>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-4 text-sm">
              <div className="flex text-amber-500">★★★★★</div>
              <span className="font-bold text-gray-800">{book.rating}</span>
              <span className="text-gray-400">({book.reviewsCount || 120} reviews)</span>
              <span className="text-emerald-600 font-medium">✓ In Stock</span>
            </div>

            {/* Pricing Box */}
            <div className="mt-6 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-baseline gap-4">
              <span className="text-3xl font-black text-emerald-800">Rs. {book.price}</span>
              {book.oldPrice && (
                <span className="text-base text-gray-400 line-through">
                  Rs. {book.oldPrice}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-bold text-rose-600">Save Rs. {book.oldPrice! - book.price}</span>
              )}
            </div>

            {/* Description */}
            <div className="mt-6 space-y-3">
              <h3 className="font-bold text-sm text-gray-900">About this book:</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{book.desc}</p>
              {book.urduDesc && (
                <p className="text-sm text-gray-700 leading-relaxed text-right font-medium" dir="rtl">
                  {book.urduDesc}
                </p>
              )}
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-3 gap-3 my-6 py-4 border-y border-gray-100 text-xs">
              <div>
                <span className="text-gray-400 block">Language</span>
                <span className="font-bold text-gray-800">{book.language}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Pages</span>
                <span className="font-bold text-gray-800">{book.pages} pages</span>
              </div>
              <div>
                <span className="text-gray-400 block">Print</span>
                <span className="font-bold text-gray-800">Paperback</span>
              </div>
            </div>
          </div>

          {/* Quantity & CTA buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-600">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 hover:bg-gray-100 font-bold"
                >
                  −
                </button>
                <span className="px-4 py-1.5 text-sm font-bold">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-3 py-1.5 hover:bg-gray-100 font-bold"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-gray-400">Total: Rs. {book.price * qty}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => add(book, qty)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white py-3.5 px-6 rounded-xl font-bold text-sm transition shadow-md shadow-emerald-200"
              >
                🛒 Add to Cart
              </button>
              <button
                onClick={() => {
                  add(book, qty);
                  nav('/cart');
                }}
                className="flex-1 bg-gray-900 hover:bg-black active:scale-98 text-white py-3.5 px-6 rounded-xl font-bold text-sm transition shadow-md"
              >
                ⚡ Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Books */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Similar Books You'll Love</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ==================== CART PAGE ==================== */
const Cart = () => {
  const { cart, remove, setQty, clear, subtotal, discount, shipping, total, coupon, applyCoupon, removeCoupon } = useStore();
  const nav = useNavigate();
  const [couponInput, setCouponInput] = useState('');

  const freeDeliveryThreshold = 2000;
  const remainingForFreeShipping = Math.max(0, freeDeliveryThreshold - (subtotal - discount));
  const progressPercent = Math.min(100, Math.round(((subtotal - discount) / freeDeliveryThreshold) * 100));

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <span className="text-7xl block mb-4">🛒</span>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Your Shopping Cart is Empty</h2>
        <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
          You haven't added any books to your cart yet. Explore our rich catalog of Urdu and English bestsellers!
        </p>
        <Link
          to="/shop"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition"
        >
          Start Shopping 📚
        </Link>
      </div>
    );
  }

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
      setCouponInput('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Shopping Cart</h1>

      {/* Free shipping progress alert */}
      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl mb-8">
        <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-2">
          <span>
            {remainingForFreeShipping === 0
              ? '🎉 Congratulations! You have unlocked Free Shipping nationwide!'
              : `🚚 Add Rs. ${remainingForFreeShipping} more to get Free Delivery!`}
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full bg-emerald-200/60 rounded-full h-2 overflow-hidden">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm flex gap-4 items-center"
            >
              <Link to={`/book/${item.id}`} className="flex-shrink-0">
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-20 h-28 object-cover rounded-xl shadow-sm"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider">
                  {item.category}
                </span>
                <Link to={`/book/${item.id}`}>
                  <h3 className="font-bold text-gray-900 hover:text-emerald-700 transition truncate text-base">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-xs text-gray-500 mt-0.5" dir="rtl">{item.urdu}</p>
                <p className="text-emerald-700 font-black text-sm mt-1">Rs. {item.price}</p>

                {/* Quantity Controls & Delete */}
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    <button
                      onClick={() => setQty(item.id, item.qty - 1)}
                      className="px-2.5 py-1 text-xs hover:bg-gray-200 font-bold"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-gray-800">{item.qty}</span>
                    <button
                      onClick={() => setQty(item.id, item.qty + 1)}
                      className="px-2.5 py-1 text-xs hover:bg-gray-200 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-xs font-bold text-gray-700">
                    Subtotal: Rs. {item.price * item.qty}
                  </span>

                  <button
                    onClick={() => remove(item.id)}
                    className="text-xs text-rose-600 hover:text-rose-800 font-semibold ml-auto"
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2">
            <Link to="/shop" className="text-xs font-bold text-emerald-700 hover:underline">
              ← Continue Shopping
            </Link>
            <button
              onClick={clear}
              className="text-xs text-gray-500 hover:text-rose-600 font-semibold"
            >
              Clear Entire Cart
            </button>
          </div>
        </div>

        {/* Order Summary & Checkout Box */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-black text-gray-900 mb-4 pb-2 border-b border-gray-100">
              Order Summary
            </h2>

            {/* Coupon Code Section */}
            <div className="mb-4">
              {coupon ? (
                <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-emerald-800 font-bold">
                    🎟️ Coupon applied: <b>{coupon}</b>
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-rose-600 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code (KITAB10)"
                    className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 uppercase"
                  />
                  <button
                    type="submit"
                    className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Price breakdown */}
            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-800">Rs. {subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>- Rs. {discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? <b className="text-emerald-600">FREE</b> : `Rs. ${shipping}`}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-base text-gray-900">
                <span>Estimated Total</span>
                <span className="text-emerald-700">Rs. {total}</span>
              </div>
            </div>

            <button
              onClick={() => nav('/checkout')}
              className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white py-3.5 rounded-xl font-bold text-sm transition shadow-md shadow-emerald-200 flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <span>→</span>
            </button>
          </div>

          {/* Quick info card */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-xs text-gray-500 space-y-2">
            <p className="flex items-center gap-2">
              <span>🔒</span> <b>Secure Checkout:</b> JazzCash, EasyPaisa, Card or COD.
            </p>
            <p className="flex items-center gap-2">
              <span>📦</span> <b>Doorstep Delivery:</b> Tracked shipping via courier.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==================== CHECKOUT PAGE ==================== */
const Checkout = () => {
  const { cart, subtotal, discount, shipping, total, clear, addOrder, user } = useStore();
  const [payment, setPayment] = useState('cod');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [form, setForm] = useState({
    name: user || '',
    email: '',
    phone: '',
    address: '',
    city: 'Lahore'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (cart.length === 0 && !placedOrder) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <span className="text-5xl block mb-3">🛒</span>
        <h2 className="text-xl font-bold text-gray-800">Your cart is empty</h2>
        <p className="text-xs text-gray-500 my-4">Add books to cart before checking out.</p>
        <Link to="/shop" className="bg-emerald-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl">
          Shop Now
        </Link>
      </div>
    );
  }

  // Order Success Screen
  if (placedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-sm">
          ✓
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase">
          Order Placed Successfully!
        </span>
        <h1 className="text-3xl font-black text-gray-900 mt-3 mb-2">Thank You for Your Order!</h1>
        <p className="text-sm text-gray-500 mb-6">
          Order ID: <b className="text-emerald-700">{placedOrder.id}</b>
        </p>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-left mb-6 space-y-3 text-xs">
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-400">Date</span>
            <span className="font-bold text-gray-800">{placedOrder.date}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-400">Payment Mode</span>
            <span className="font-bold uppercase text-emerald-700">{placedOrder.paymentMethod}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-400">Deliver To</span>
            <span className="font-bold text-gray-800 text-right">
              {placedOrder.customer.name} ({placedOrder.customer.phone})<br />
              {placedOrder.customer.address}, {placedOrder.customer.city}
            </span>
          </div>
          <div className="flex justify-between pt-1 font-bold text-sm">
            <span>Total Amount</span>
            <span className="text-emerald-700">Rs. {placedOrder.total}</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-6">
          A confirmation SMS has been prepared for dispatch. Our team will verify and deliver your package within 2 to 4 business days.
        </p>

        <div className="flex justify-center gap-3">
          <Link
            to="/orders"
            className="bg-gray-900 hover:bg-black text-white font-bold text-xs px-6 py-3 rounded-xl transition"
          >
            View My Orders
          </Link>
          <Link
            to="/shop"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Please enter your full name';
    if (!form.phone.trim()) errs.phone = 'Please provide a valid contact number';
    if (!form.address.trim()) errs.address = 'Please specify your shipping street address';
    if (!form.city.trim()) errs.city = 'Please specify your delivery city';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newOrder: Order = {
      id: 'KG-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' }),
      items: [...cart],
      total,
      shipping,
      paymentMethod: payment,
      customer: { ...form }
    };

    addOrder(newOrder);
    setPlacedOrder(newOrder);
    clear();
  };

  const paymentOptions = [
    { id: 'cod', label: '💵 Cash on Delivery (COD)', desc: 'Pay with cash upon receipt of book parcel' },
    { id: 'jazzcash', label: '💳 JazzCash Mobile Wallet', desc: 'Pay via JazzCash app or Till account' },
    { id: 'easypaisa', label: '💚 EasyPaisa Mobile Wallet', desc: 'Pay directly via EasyPaisa account' },
    { id: 'card', label: '💳 Credit / Debit Card', desc: 'Visa, Mastercard or PayPak cards' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Checkout & Shipping</h1>

      <form onSubmit={handleSubmitOrder} className="grid lg:grid-cols-3 gap-8">
        {/* Left Side: Shipping & Payment details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-gray-900 pb-2 border-b border-gray-100">
              1. Shipping Address
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Muhammad Ali"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl text-xs focus:outline-none focus:bg-white transition ${
                    errors.name ? 'border-rose-500' : 'border-gray-200 focus:border-emerald-500'
                  }`}
                />
                {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number (WhatsApp) *</label>
                <input
                  type="tel"
                  placeholder="0300-1234567"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl text-xs focus:outline-none focus:bg-white transition ${
                    errors.phone ? 'border-rose-500' : 'border-gray-200 focus:border-emerald-500'
                  }`}
                />
                {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email (Optional)</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 focus:bg-white transition"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">Street Address *</label>
                <input
                  type="text"
                  placeholder="House #, Street, Sector / Area"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl text-xs focus:outline-none focus:bg-white transition ${
                    errors.address ? 'border-rose-500' : 'border-gray-200 focus:border-emerald-500'
                  }`}
                />
                {errors.address && <p className="text-[11px] text-rose-600 mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">City *</label>
                <select
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                >
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Multan">Multan</option>
                  <option value="Peshawar">Peshawar</option>
                  <option value="Quetta">Quetta</option>
                  <option value="Sialkot">Sialkot</option>
                  <option value="Gujranwala">Gujranwala</option>
                  <option value="Other">Other City</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-gray-900 pb-2 border-b border-gray-100">
              2. Payment Method
            </h2>

            <div className="space-y-3">
              {paymentOptions.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                    payment === opt.id
                      ? 'border-emerald-600 bg-emerald-50/50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === opt.id}
                    onChange={() => setPayment(opt.id)}
                    className="mt-1 accent-emerald-600"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-gray-900">{opt.label}</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary & Place Order */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-black text-gray-900 mb-4 pb-2 border-b border-gray-100">
              Review Items ({cart.length})
            </h2>

            <div className="max-h-64 overflow-y-auto space-y-3 mb-4 pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs">
                  <img src={item.cover} alt={item.title} className="w-12 h-16 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-800 truncate">{item.title}</h4>
                    <p className="text-gray-400">Qty: {item.qty}</p>
                    <p className="font-bold text-emerald-700">Rs. {item.price * item.qty}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-800">Rs. {subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>- Rs. {discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? <b className="text-emerald-600">FREE</b> : `Rs. ${shipping}`}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-base text-gray-900">
                <span>Total Due</span>
                <span className="text-emerald-700">Rs. {total}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white py-3.5 rounded-xl font-bold text-sm transition shadow-md shadow-emerald-200"
            >
              Confirm & Place Order 📦
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

/* ==================== WISHLIST PAGE ==================== */
const Wishlist = () => {
  const { wishlist, add } = useStore();
  const wishlistedBooks = BOOKS.filter((b) => wishlist.includes(b.id));

  if (wishlistedBooks.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <span className="text-6xl block mb-4">🤍</span>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Your Wishlist is Empty</h2>
        <p className="text-xs text-gray-500 mb-6">
          Save your favorite Urdu novels, poetry, and bestsellers to read later!
        </p>
        <Link to="/shop" className="bg-emerald-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md">
          Explore Books
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">My Saved Wishlist ❤️</h1>
          <p className="text-sm text-gray-500">{wishlistedBooks.length} books saved for later</p>
        </div>
        <button
          onClick={() => wishlistedBooks.forEach((b) => add(b))}
          className="text-xs bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl hover:bg-emerald-700 transition"
        >
          Add All to Cart 🛒
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistedBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

/* ==================== ORDERS PAGE ==================== */
const Orders = () => {
  const { orders } = useStore();

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <span className="text-6xl block mb-4">📦</span>
        <h2 className="text-2xl font-black text-gray-900 mb-2">No Orders Placed Yet</h2>
        <p className="text-xs text-gray-500 mb-6">You have not ordered any books yet.</p>
        <Link to="/shop" className="bg-emerald-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-gray-900 mb-2">My Orders History</h1>
      <p className="text-sm text-gray-500 mb-8">Track and review your recent book purchases</p>

      <div className="space-y-6">
        {orders.map((o) => (
          <div key={o.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3 text-xs">
              <div>
                <span className="text-gray-400">Order ID: </span>
                <span className="font-bold text-gray-900">{o.id}</span>
                <span className="text-gray-300 mx-2">|</span>
                <span className="text-gray-400">Date: </span>
                <span className="font-semibold text-gray-700">{o.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full uppercase text-[10px]">
                  Processing Delivery
                </span>
                <span className="font-black text-gray-900 text-sm">Rs. {o.total}</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {o.items.map((i) => (
                <div key={i.id} className="flex gap-3 text-xs">
                  <img src={i.cover} alt={i.title} className="w-12 h-16 object-cover rounded-lg" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-800 truncate">{i.title}</h4>
                    <p className="text-gray-400">Qty: {i.qty}</p>
                    <p className="font-bold text-emerald-700">Rs. {i.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-xs text-gray-500 flex flex-wrap justify-between border-t border-gray-50">
              <span>📍 Delivered to: {o.customer.address}, {o.customer.city}</span>
              <span>Payment Mode: <b className="uppercase">{o.paymentMethod}</b></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ==================== ABOUT PAGE ==================== */
const About = () => (
  <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
    <div className="text-center space-y-4">
      <span className="bg-emerald-50 text-emerald-700 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
        Our Story & Mission
      </span>
      <h1 className="text-4xl md:text-5xl font-black text-gray-900">About KitabGhar Pakistan</h1>
      <p className="text-lg text-emerald-800 font-serif" dir="rtl">
        علم و آگہی کا وہ چراغ جو ہر گھر کو روشن کرے۔
      </p>
    </div>

    <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm space-y-6 text-gray-700 leading-relaxed text-sm md:text-base">
      <p>
        Founded with a passionate belief that reading shapes minds, <b>KitabGhar</b> is Pakistan’s leading online destination for book lovers. Whether you are seeking spiritual novels by Umera Ahmed, philosophical Urdu poetry by Allama Iqbal and Jaun Elia, or international bestsellers on psychology, finance, and habits, we deliver original books safely across all cities and towns.
      </p>
      <p>
        We are proud to serve readers across Lahore, Karachi, Islamabad, Rawalpindi, Peshawar, Quetta, Multan, and hundreds of remote towns where quality bookstores are scarce. With our prompt Cash on Delivery (COD) and fast shipping, high-quality literature is always just a click away.
      </p>

      <div className="grid sm:grid-cols-3 gap-6 pt-6 border-t border-gray-100 text-center">
        <div>
          <span className="text-3xl font-black text-emerald-700 block">50,000+</span>
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Books Delivered</span>
        </div>
        <div>
          <span className="text-3xl font-black text-emerald-700 block">4.9 ★</span>
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Reader Rating</span>
        </div>
        <div>
          <span className="text-3xl font-black text-emerald-700 block">100%</span>
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Authentic Print</span>
        </div>
      </div>
    </div>
  </div>
);

/* ==================== CONTACT PAGE ==================== */
const Contact = () => {
  const { showToast } = useStore();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      showToast('Please fill out your name and message', 'error');
      return;
    }
    setSent(true);
    showToast('Thank you! Your message has been sent.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-gray-900">Contact Us & FAQs</h1>
        <p className="text-sm text-gray-500">We are here to help you find your next read</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
          {sent ? (
            <div className="text-center py-12 space-y-3">
              <span className="text-5xl block">✉️</span>
              <h3 className="text-xl font-bold text-emerald-800">Message Received!</h3>
              <p className="text-xs text-gray-500">
                Thank you for reaching out. Our support team will get back to you shortly.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-xs font-bold text-emerald-600 hover:underline pt-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-bold text-base text-gray-900 mb-2">Send us a message</h3>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Usman Tariq"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="usman@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone / WhatsApp</label>
                <input
                  type="tel"
                  placeholder="0300-1234567"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Message *</label>
                <textarea
                  rows={4}
                  placeholder="Which book are you searching for or what query do you have?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition shadow-md shadow-emerald-200"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Quick Contacts & FAQs */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-gray-900">Direct Support</h3>
            <a
              href="https://wa.me/923001234567?text=Assalam-o-Alaikum!%20KitabGhar%20se%20kuch%20maloomat%20chahiye"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl text-xs transition shadow-md"
            >
              <span>💬</span> Chat on WhatsApp (+92 300 1234567)
            </a>
            <div className="text-xs text-gray-500 space-y-1.5 pt-2">
              <p>📍 Gulberg III, Lahore, Punjab, Pakistan</p>
              <p>✉️ support@kitabghar.pk</p>
              <p>⏰ Mon - Sat: 9:00 AM – 9:00 PM PKT</p>
            </div>
          </div>

          {/* FAQs Accordion */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
            <h3 className="font-bold text-base text-gray-900 mb-2">Frequently Asked Questions</h3>
            {FAQS.map((faq, i) => (
              <details key={i} className="group border-b border-gray-100 pb-3 text-xs">
                <summary className="font-bold text-gray-800 cursor-pointer list-none flex justify-between items-center group-hover:text-emerald-700">
                  <span>{faq.q}</span>
                  <span className="text-gray-400 group-open:rotate-180 transition">▼</span>
                </summary>
                <p className="text-gray-500 mt-2 pl-2 leading-relaxed">{faq.a}</p>
                <p className="text-emerald-800 mt-1 pl-2 font-medium text-right" dir="rtl">{faq.u}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==================== LOGIN PAGE ==================== */
const Login = () => {
  const { login } = useStore();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = email ? email.split('@')[0] : 'Reader';
    login(name.charAt(0).toUpperCase() + name.slice(1));
    nav('/shop');
  };

  const handleDemoLogin = () => {
    login('Ahmed Ali');
    nav('/shop');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
        <div className="text-center mb-6">
          <span className="text-4xl block mb-2">📚</span>
          <h1 className="text-2xl font-black text-gray-900">Welcome Back</h1>
          <p className="text-xs text-gray-500 mt-1">Sign in to your KitabGhar account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email or Username</label>
            <input
              type="text"
              required
              placeholder="reader@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-1.5 text-gray-500 cursor-pointer">
              <input type="checkbox" className="accent-emerald-600 rounded" defaultChecked />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-emerald-700 font-bold hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold py-3 rounded-xl text-xs transition shadow-md shadow-emerald-200"
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 rounded-xl text-xs transition"
          >
            1-Click Demo Login 👤
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-emerald-700 font-bold hover:underline">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

/* ==================== SIGNUP PAGE ==================== */
const Signup = () => {
  const { login } = useStore();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(name || 'New Reader');
    nav('/shop');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
        <div className="text-center mb-6">
          <span className="text-4xl block mb-2">📚</span>
          <h1 className="text-2xl font-black text-gray-900">Create an Account</h1>
          <p className="text-xs text-gray-500 mt-1">Join thousands of readers across Pakistan</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Ayesha Siddiqui"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="ayesha@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="Create strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold py-3 rounded-xl text-xs transition shadow-md shadow-emerald-200"
          >
            Create Account & Shop
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-700 font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

/* ==================== 404 NOT FOUND ==================== */
const NotFound = () => (
  <div className="max-w-md mx-auto py-24 text-center px-4">
    <span className="text-7xl block mb-4">📜</span>
    <h1 className="text-4xl font-black text-gray-900 mb-2">404</h1>
    <h2 className="text-lg font-bold text-gray-700 mb-2">صفحہ دستیاب نہیں ہے (Page Not Found)</h2>
    <p className="text-xs text-gray-500 mb-6">
      The page you requested could not be found. Please return to the bookstore home.
    </p>
    <Link
      to="/"
      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition"
    >
      Return to Home 🏠
    </Link>
  </div>
);

/* ==================== ROOT APP COMPONENT ==================== */
const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50 text-gray-800 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      <ScrollToTop />
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <WhatsApp />
      <ToastContainer />
    </div>
  );
};

export default App;