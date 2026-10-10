import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  Heart,
  Menu,
  Search,
  Sparkles,
  X,
  ShoppingBag,
  Truck,
  Mail,
  MapPin,
  ShieldCheck,
  Star
} from 'lucide-react';
import '../components/Home.css';


const API = import.meta.env.VITE_API_BASE_URL || 'https://api.rjrinfinity.com/api';
const SHOP_API = `${API}/griphill`;

import A1_1 from '../assets/WEBP/A1_Web/A1_1.webp';
import A1_2 from '../assets/WEBP/A1_Web/A1_2.webp';
import A1_3 from '../assets/WEBP/A1_Web/A1_3.webp';
import A1_4 from '../assets/WEBP/A1_Web/A1_4.webp';
import A1_5 from '../assets/WEBP/A1_Web/A1_5.webp';

import A2_1 from '../assets/WEBP/A2_Web/A2_1.webp';
import A2_2 from '../assets/WEBP/A2_Web/A2_2.webp';
import A2_3 from '../assets/WEBP/A2_Web/A2_3.webp';
import A2_5 from '../assets/WEBP/A2_Web/A2_5.webp';
import A2_6 from '../assets/WEBP/A2_Web/A2_6.webp';

import B1_1 from '../assets/WEBP/B1_Web/B1_1.webp';
import B1_2 from '../assets/WEBP/B1_Web/B1_2.webp';
import B1_3 from '../assets/WEBP/B1_Web/B1_3.webp';
import B1_4 from '../assets/WEBP/B1_Web/B1_4.webp';
import B1_5 from '../assets/WEBP/B1_Web/B1_5.webp';

import B2_1 from '../assets/WEBP/B2_Web/B2_1.webp';
import B2_2 from '../assets/WEBP/B2_Web/B2_2.webp';
import B2_3 from '../assets/WEBP/B2_Web/B2_3.webp';
import B2_4 from '../assets/WEBP/B2_Web/B2_4.webp';
import B2_5 from '../assets/WEBP/B2_Web/B2_5.webp';

import C3_1 from '../assets/WEBP/C3_Web/C3_1.webp';
import C3_2 from '../assets/WEBP/C3_Web/C3_2.webp';
import C3_3 from '../assets/WEBP/C3_Web/C3_3.webp';
import C3_4 from '../assets/WEBP/C3_Web/C3_4.webp';
import C3_5 from '../assets/WEBP/C3_Web/C3_5.webp';

import C4_1 from '../assets/WEBP/C4_Web/C4_1.webp';
import C4_3 from '../assets/WEBP/C4_Web/C4_3.webp';
import C4_4 from '../assets/WEBP/C4_Web/C4_4.webp';

import D3_1 from '../assets/WEBP/D3_Web/D3_1.webp';
import D3_2 from '../assets/WEBP/D3_Web/D3_2.webp';
import D3_3 from '../assets/WEBP/D3_Web/D3_3.webp';
import D3_4 from '../assets/WEBP/D3_Web/D3_4.webp';
import D3_5 from '../assets/WEBP/D3_Web/D3_5.webp';

import E1_1 from '../assets/WEBP/E1_Web/E1_1.webp';
import E1_2 from '../assets/WEBP/E1_Web/E1_2.webp';
import E1_3 from '../assets/WEBP/E1_Web/E1_3.webp';
import E1_4 from '../assets/WEBP/E1_Web/E1_4.webp';
import E1_5 from '../assets/WEBP/E1_Web/E1_5.webp';

const FALLBACK_PRODUCTS = [
  {
    id: 1,
    sku: 'A1',
    name: 'Trek Trip Black',
    category: 'Laptop Backpack',
    description: 'Designed for the ultimate daily routine, The Omni-Blend features a convenient vertical front-zip pocket for fast, effortless access to your essentials. Weighing 1kg with dimensions of 32 cm x 46 cm x 18 cm, this pack effortlessly fits a 15.6-inch laptop. Built from advanced PU waterproof and mildew-proof fabric, it protects your gear in any weather while delivering a seamless balance of active utility and modern style.',
    price: 2499,
    mrp: 4998,
    stock_quantity: 0,
    inventory_managed: false,
    images: [
      { url: A1_1 },
      { url: A1_2 },
      { url: A1_3 },
      { url: A1_4 },
      { url: A1_5 }
    ]
  },

  {
    id: 2,
    sku: 'A2',
    name: 'Trek Trip Grey',
    category: 'Laptop Backpack',
    description: 'Designed for the ultimate daily routine, The Omni-Blend features a convenient vertical front-zip pocket for fast, effortless access to your essentials. Weighing 1kg with dimensions of 32 cm x 46 cm x 18 cm, this pack effortlessly fits a 15.6-inch laptop. Built from advanced PU waterproof and mildew-proof fabric, it protects your gear in any weather while delivering a seamless balance of active utility and modern style.',
    price: 2499,
    mrp: 4998,
    stock_quantity: 0,
    inventory_managed: false,
    images: [
      { url: A2_1 },
      { url: A2_2 },
      { url: A2_3 },
      { url: A2_5 },
      { url: A2_6 }
    ]
  },

  {
    id: 3,
    sku: 'B1',
    name: 'Aero Hybrid Grey',
    category: 'Laptop Backpack',
    description: 'Built for the fast-paced city lifestyle, Aero Hybrid champions an ultra-clean, minimalist front profile that pairs effortlessly with any professional wardrobe. Weighing 1kg and measuring 32 cm x 46 cm x 18 cm, it securely houses a 15.6-inch laptop within its structured interior. Crafted from durable PU waterproof and mildew-proof fabric, it keeps your tech safe, dry, and looking sharp through the urban commute.',
    price: 2499,
    mrp: 4998,
    stock_quantity: 0,
    inventory_managed: false,
    images: [
      { url: B1_1 },
      { url: B1_2 },
      { url: B1_3 },
      { url: B1_4 },
      { url: B1_5 }
    ]
  },

  {
    id: 4,
    sku: 'B2',
    name: 'Aero Hybrid Black',
    category: 'Laptop Backpack',
    description: 'Built for the fast-paced city lifestyle, Aero Hybrid champions an ultra-clean, minimalist front profile that pairs effortlessly with any professional wardrobe. Weighing 1kg and measuring 32 cm x 46 cm x 18 cm, it securely houses a 15.6-inch laptop within its structured interior. Crafted from durable PU waterproof and mildew-proof fabric, it keeps your tech safe, dry, and looking sharp through the urban commute.',
    price: 2499,
    mrp: 4998,
    stock_quantity: 0,
    inventory_managed: false,
    images: [
      { url: B2_1 },
      { url: B2_2 },
      { url: B2_3 },
      { url: B2_4 },
      { url: B2_5 }
    ]
  },

  {
    id: 5,
    sku: 'C3',
    name: 'Metro Merge Blue',
    category: 'Laptop Backpack',
    description: 'Engineered for travel and longer commutes, Metro Merge introduces a distinctive top-flap compartment layout for advanced multi-zone organization. Offering generous dimensions of 32 cm x 46 cm x 18 cm at a lightweight 1kg, it easily accommodates a 15.6-inch laptop and travel gear. Formulated with resilient PU waterproof and mildew-proof fabric, this pack ensures your belongings stay completely fresh, protected, and organized wherever your journey takes you',
    price: 2499,
    mrp: 4998,
    stock_quantity: 0,
    inventory_managed: false,
    images: [
      { url: C3_1 },
      { url: C3_2 },
      { url: C3_3 },
      { url: C3_4 },
      { url: C3_5 }
    ]
  },

  {
    id: 6,
    sku: 'C4',
    name: 'Metro Merge Black',
    category: 'Laptop Backpack',
    description: 'Engineered for travel and longer commutes, Metro Merge introduces a distinctive top-flap compartment layout for advanced multi-zone organization. Offering generous dimensions of 32 cm x 46 cm x 18 cm at a lightweight 1kg, it easily accommodates a 15.6-inch laptop and travel gear. Formulated with resilient PU waterproof and mildew-proof fabric, this pack ensures your belongings stay completely fresh, protected, and organized wherever your journey takes you',
    price: 2499,
    mrp: 4998,
    stock_quantity: 0,
    inventory_managed: false,
    images: [
      { url: C4_1 },
      { url: C4_3 },
      { url: C4_4 }
    ]
  },

  {
    id: 7,
    sku: 'D3',
    name: 'The Omni-Blend',
    category: 'Laptop Backpack',
    description: 'Combining high-security tech organization with sharp urban utility, The Fusion Vault is crafted to protect your valuables on the move. Weighing just 1kg with a 32 cm x 46 cm x 18 cm frame, it comfortably fits a 15.6-inch laptop alongside daily gear. Constructed from premium PU waterproof and mildew-proof fabric, it delivers ultimate all-weather defense and a confident, locked-down security experience for the modern professional.',
    price: 2499,
    mrp: 4998,
    stock_quantity: 0,
    inventory_managed: false,
    images: [
      { url: D3_1 },
      { url: D3_2 },
      { url: D3_3 },
      { url: D3_4 },
      { url: D3_5 }
    ]
  },

  {
    id: 8,
    sku: 'E1',
    name: 'The Fusion Vault',
    category: 'Laptop Backpack',
    description: 'Combining high-security tech organization with sharp urban utility, The Fusion Vault is crafted to protect your valuables on the move. Weighing just 1kg with a 32 cm x 46 cm x 18 cm frame, it comfortably fits a 15.6-inch laptop alongside daily gear. Constructed from premium PU waterproof and mildew-proof fabric, it delivers ultimate all-weather defense and a confident, locked-down security experience for the modern professional.',
    price: 2499,
    mrp: 4998,
    stock_quantity: 0,
    inventory_managed: false,
    images: [
      { url: E1_1 },
      { url: E1_2 },
      { url: E1_3 },
      { url: E1_4 },
      { url: E1_5 }
    ]
  }
];

const money = (v) => `₹${Number(v || 0).toLocaleString('en-IN')}`;
const discount = (p) => p.mrp > p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0;
const CAMPAIGN_BANNERS = [
  { src: '/banners/bomag-boy-travel.jpeg', alt: 'Bomag Boy travel campaign', title: 'Travel ready.' },
  { src: '/banners/bomag-boy-business.jpeg', alt: 'Bomag Boy business campaign', title: 'Work with confidence.' },
  { src: '/banners/bomag-boy-ride.jpeg', alt: 'Bomag Boy ride campaign', title: 'Built for every journey.' },
];

function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector('script[data-razorpay]');
    if (existing) {
      existing.addEventListener('load', () => resolve(true), { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.razorpay = 'true';
    script.onload = () => resolve(true);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

function ImageCard({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className={`image-fallback ${className}`}><span>GRIP HILL</span></div>;
  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />;
}

function ProductCard({ product, onDetails, onAdd }) {
  const image = product.images?.[0]?.url;
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        {discount(product) > 0 && <span className="product-badge">{discount(product)}% OFF</span>}
        <button className="heart-button" type="button" aria-label={`Save ${product.name}`}><Heart size={18} strokeWidth={1.7} /></button>
        <ImageCard src={image} alt={product.name} className="product-image" />
        <button className="quick-add" type="button" onClick={() => onAdd(product)}>Add to cart <ArrowRight size={15} /></button>
      </div>
      <div className="product-info">
        <p className="eyebrow">{product.category}</p>
        <h3>{product.name}</h3>
        <div className="product-pricing"><span>{money(product.price)}</span>{Number(product.mrp) > Number(product.price) && <><del>{money(product.mrp)}</del><b>{discount(product)}% OFF</b></>}</div>
        <p className="product-description">{product.description}</p>
        <div className="product-actions">
          <button type="button" className="product-details-link" onClick={() => onDetails(product)}>View details <ArrowRight size={15} /></button>
          <button type="button" className="notify-button" onClick={() => onAdd(product)}>Add to cart</button>
        </div>
      </div>
    </article>
  );
}

function Modal({ children, onClose, className = '' }) {
  return <div className="modal-backdrop" onClick={onClose}><div className={`modal-panel ${className}`} onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="Close"><X size={22} /></button>{children}</div></div>;
}

export default function Home() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [testimonials, setTestimonials] = useState([]);
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('griphill_cart') || '[]'); } catch { return []; }
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [trackOpen, setTrackOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  useEffect(() => { localStorage.setItem('griphill_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { if (window.location.pathname === '/track-order') setTrackOpen(true); }, []);
  useEffect(() => {
    fetch(`${SHOP_API}/products`).then(r => r.json()).then(d => { if (d.success && d.products?.length) setProducts(d.products); }).catch(() => {}).finally(() => setLoadingProducts(false));
  }, []);
useEffect(() => {
  fetch(`${SHOP_API}/testimonials`)
    .then(r => r.json())
    .then(d => {
      if (d.success && Array.isArray(d.testimonials)) {
        setTestimonials(d.testimonials);
      }
    })
    .catch(() => {});
}, []);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0), [cart]);

  const addToCart = (product) => {
    setCart(current => {
      const totalUnits = current.reduce((sum, item) => sum + item.quantity, 0);
      const found = current.find(i => i.productId === product.id);
      if (totalUnits >= 2) {
        setCheckoutError('Maximum 2 items can be ordered in one guest checkout.');
        return current;
      }
      if (found) return current.map(i => i.productId === product.id ? { ...i, quantity: Math.min(2, i.quantity + 1) } : i);
      return [...current, { productId: product.id, sku: product.sku, name: product.name, price: Number(product.price), image: product.images?.[0]?.url, quantity: 1 }];
    });
    setCartOpen(true);
  };
  const changeQty = (id, delta) => setCart(c => { const total = c.reduce((s,i)=>s+i.quantity,0); return c.map(i => i.productId === id ? { ...i, quantity: Math.max(1, Math.min(2, i.quantity + delta + (delta > 0 && total >= 2 ? -delta : 0))) } : i); });
  const removeCart = (id) => setCart(c => c.filter(i => i.productId !== id));

  const startCheckout = () => { if (!cart.length) return; setCartOpen(false); setCheckoutError(''); setCheckoutOpen(true); };

  const pay = async (customer) => {
    setCheckoutLoading(true); setCheckoutError('');
    try {
      const response = await fetch(`${SHOP_API}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customer, items: cart.map(i => ({ productId: i.productId, quantity: i.quantity })) }) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Unable to create your order.');
      await loadRazorpay();
      const options = {
        key: data.razorpay.keyId,
        amount: data.razorpay.amount,
        currency: data.razorpay.currency,
        name: 'Grip Hill',
        description: data.razorpay.description,
        order_id: data.razorpay.orderId,
        prefill: data.razorpay.prefill,
        notes: data.razorpay.notes,
        theme: data.razorpay.theme,
        handler: async (payment) => {
          try {
            const verify = await fetch(`${SHOP_API}/payments/verify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payment) });
            const verified = await verify.json();
            if (!verify.ok || !verified.success) throw new Error(verified.error || 'Payment verification failed.');
            setCart([]); setCheckoutOpen(false); setOrderResult({ success: true, orderNumber: verified.order.orderNumber });
          } catch (err) { setCheckoutError(err.message); }
        },
        modal: { ondismiss: () => setCheckoutLoading(false) },
      };
      const checkout = new window.Razorpay(options);
      checkout.on('payment.failed', async (response) => {
        setCheckoutLoading(false);
        try { await fetch(`${SHOP_API}/payments/failure`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ razorpay_order_id:data.razorpay.orderId, razorpay_payment_id:response.error?.metadata?.payment_id || '', error:response.error || {} }) }); } catch {}
        setCheckoutOpen(false);
        setCheckoutError('');
        setOrderResult({ success: false, orderNumber: data.order.orderNumber });
      });
      checkout.open();
    } catch (error) { setCheckoutError(error.message); }
    finally { setCheckoutLoading(false); }
  };

  return (
    <div className="site-shell">
      <div className="announcement"><Sparkles size={14} /><span>Grip Hill is now available to shop.</span><a href="#new">Shop the collection</a></div>
      <header className="navbar">
        <a className="brand" href="#top"><img src="/Glogo.png" alt="Grip Hill" /><span>GRIP HILL</span></a>
        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <a href="#new" onClick={() => setMenuOpen(false)}>Shop</a>
          <a href="#lifestyle" onClick={() => setMenuOpen(false)}>Lifestyle</a>
          <a href="#craft" onClick={() => setMenuOpen(false)}>Craft</a>
          <a href="#journal" onClick={() => setMenuOpen(false)}>Journal</a>
          <button onClick={() => { setTrackOpen(true); setMenuOpen(false); }}>Track order</button>
          <button onClick={() => { setContactOpen(true); setMenuOpen(false); }}>Write to us</button>
        </nav>
        <div className="nav-actions">
          <button onClick={() => setSearchOpen(true)} aria-label="Search"><Search size={20} /></button>
          <button className="cart-nav" onClick={() => setCartOpen(true)} aria-label="Cart"><ShoppingBag size={20} /><span>{cartCount}</span></button>
          <button className="menu-button" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <video className="hero-video" src="/Promo2.mp4" autoPlay muted loop playsInline />
          <div className="hero-overlay" />
          <div className="hero-content"><p className="hero-kicker">GRIP HILL / NEW COLLECTION</p><h1>Carry what<br />moves you.</h1><p className="hero-copy">Premium bags and everyday essentials, designed around the way modern life actually moves.</p><div className="hero-buttons"><a className="button button-light" href="#new">Shop collection <ArrowRight size={17} /></a><a className="text-link light-link" href="#story">Our story</a></div></div>
          <div className="hero-scroll">SCROLL TO EXPLORE ↓</div>
        </section>

        <section className="intro section"><div><p className="eyebrow">THE GRIP HILL IDEA</p><h2>Designed for the life you carry.</h2></div><p className="intro-copy">A bag should do more than hold your things. It should fit your rhythm, protect what matters and look right wherever the day takes you.</p></section>

        <section className="campaign-section section" aria-label="Grip Hill campaigns"><div className="section-heading"><div><p className="eyebrow">GRIP HILL / CAMPAIGN</p><h2>Carry confidence everywhere.</h2></div><p className="campaign-note">Explore the new Bomag Boy campaign and then choose your bag below.</p></div><div className="campaign-grid">{CAMPAIGN_BANNERS.map(b => <article className="campaign-card" key={b.src}><img src={b.src} alt={b.alt} /><div className="campaign-caption"><span>{b.title}</span><a href="#new">Shop collection <ArrowRight size={14}/></a></div></article>)}</div></section>

        <section className="section" id="new">
          <div className="section-heading"><div><p className="eyebrow">NEW / 2026</p><h2>The latest. Made to move with you.</h2></div><button className="text-link" onClick={() => setCartOpen(true)}>Cart ({cartCount}) <ArrowRight size={16} /></button></div>
          {loadingProducts ? <div className="loading-state">Loading collection…</div> : <div className="product-row">{products.map(p => <ProductCard key={p.id} product={p} onAdd={addToCart} onDetails={setProductOpen} />)}</div>}
        </section>

        <section className="sales-ready section"><div><p className="eyebrow">READY TO ORDER</p><h2>Simple checkout. Secure payment. Clear delivery.</h2></div><div className="sales-ready-grid"><div><Check size={18}/><strong>Guest checkout</strong><span>No account required.</span></div><div><CreditCardIcon/><strong>Razorpay payment</strong><span>UPI, cards and supported methods.</span></div><div><Mail size={18}/><strong>Email updates</strong><span>Order and payment notifications.</span></div><div><Truck size={18}/><strong>Track delivery</strong><span>Use your order number and email.</span></div></div></section>

        <section className="campaign-feature section"><img src="/banners/bomag-boy-premium.jpeg" alt="Bomag Boy premium laptop backpack" /><div><p className="eyebrow">PREMIUM / LAPTOP BACKPACK</p><h2>Designed for modern travellers.</h2><p>15.6-inch laptop compatible, water and mildew resistant, premium PU fabric, anti-theft password lock and multi-compartment storage.</p><a className="button button-dark" href="#new">Shop the collection <ArrowRight size={16}/></a></div></section>

        <section className="offer-banner section"><img src="/banners/bomag-boy-offer.jpeg" alt="Grip Hill Bomag Boy offer" /><div><p className="eyebrow">LAUNCH OFFER</p><h2>50% off selected backpacks.</h2><p>Current collection pricing starts at ₹2,499 against ₹4,998 MRP on the showcased products.</p><a className="button button-dark" href="#new">Shop now <ArrowRight size={16}/></a></div></section>

        <section className="feature-banner" id="story"><ImageCard src="/products/A1_Web/A1_1.webp" alt="Grip Hill bag" className="feature-image" /><div className="feature-overlay" /><div className="feature-copy"><p className="eyebrow light-eyebrow">ONE BAG. MANY LIVES.</p><h2>From first coffee<br />to final boarding call.</h2><p>One considered system for work, travel, weekends and everything in between.</p><a className="button button-light" href="#lifestyle">Explore lifestyles <ArrowRight size={17} /></a></div></section>

        <section className="difference section" id="craft"><div className="section-heading"><div><p className="eyebrow">THE GRIP HILL DIFFERENCE</p><h2>Quietly engineered.<br />Obviously better.</h2></div></div><div className="difference-grid"><div><span>01</span><ShieldIcon /><h3>Built to last</h3><p>Materials and construction selected for everyday use, not just the first impression.</p></div><div><span>02</span><Sparkles /><h3>Smart organisation</h3><p>Purposeful pockets and clean access keep your essentials where you expect them.</p></div><div><span>03</span><Check /><h3>Premium utility</h3><p>Function-first details meet a refined silhouette that works across the city and beyond.</p></div><div><span>04</span><Truck /><h3>Made for movement</h3><p>Comfortable carry, balanced proportions and details that make daily movement easier.</p></div></div></section>

        <section className="craft-banner section"><ImageCard src="/products/A1_Web/A1_5.webp" alt="Grip Hill craft detail" className="craft-image" /><div><p className="eyebrow">MATERIAL / CRAFT</p><h2>Every detail has a purpose.</h2><p>We obsess over the details you notice every day: the feel of a handle, the movement of a zip, the placement of a pocket and the way the bag sits when fully loaded.</p><button className="text-link" onClick={() => setContactOpen(true)}>Write to us <ArrowRight size={16} /></button></div></section>

        <section className="lifestyle section" id="lifestyle"><div className="section-heading"><div><p className="eyebrow">CHOOSE YOUR RHYTHM</p><h2>Built around your lifestyle.</h2></div></div><div className="lifestyle-grid">{[['Work','For the days that don\'t slow down.','/products/A2_Web/A2_2.webp'],['Travel','Go further. Carry smarter.','/products/B2_Web/B2_1.webp'],['Weekend','Leave the routine behind.','/products/E1_Web/E1_1.webp']].map(([title,sub,image]) => <article key={title} className="lifestyle-card"><ImageCard src={image} alt={title} className="lifestyle-image" /><div className="lifestyle-overlay" /><div><p className="eyebrow light-eyebrow">GRIP HILL</p><h3>{title}</h3><p>{sub}</p><a href="#new" className="text-link light-link">Shop the edit <ArrowRight size={15} /></a></div></article>)}</div></section>

        <section className="journal section" id="journal"><div><p className="eyebrow">THE JOURNAL</p><h2>Stories from the road.</h2></div><div><p>Notes on travel, design, everyday carry and the people who refuse to stand still.</p><button className="text-link" onClick={() => setProductOpen({ article: true })}>Read the journal <ArrowRight size={16} /></button></div></section>

        <section className="testimonials-section section" id="testimonials">
  <div className="section-heading">
    <div>
      <p className="eyebrow">THE GRIP HILL COMMUNITY</p>
      <h2>Carried by people<br />who move.</h2>
    </div>

    <p className="testimonials-intro">
      Real experiences from people who choose Grip Hill for work,
      travel and everyday movement.
    </p>
  </div>

  {testimonials.length > 0 ? (
    <div className="testimonials-grid">
      {testimonials.map((testimonial) => (
        <article
          className="testimonial-card"
          key={testimonial.id}
        >
          <div className="testimonial-top">
            <div className="testimonial-stars" aria-label={`${testimonial.rating || 5} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={14}
                  strokeWidth={1.6}
                  fill={index < Number(testimonial.rating || 5) ? "currentColor" : "none"}
                />
              ))}
            </div>

            {testimonial.is_featured && (
              <span className="testimonial-featured">
                FEATURED
              </span>
            )}
          </div>

          <blockquote>
            “{testimonial.feedback}”
          </blockquote>

          <div className="testimonial-customer">
            {testimonial.photo_url ? (
              <img
                src={testimonial.photo_url}
                alt={testimonial.customer_name}
              />
            ) : (
              <div className="testimonial-avatar">
                {testimonial.customer_name
                  ?.charAt(0)
                  ?.toUpperCase() || "G"}
              </div>
            )}

            <div>
              <strong>{testimonial.customer_name}</strong>

              {testimonial.customer_role && (
                <span>{testimonial.customer_role}</span>
              )}

              {testimonial.customer_location && (
                <small>{testimonial.customer_location}</small>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  ) : null}
</section>

        <section className="support-band section"><div><p className="eyebrow">NEED HELP?</p><h2>Questions about your order?</h2></div><div><p>Track an existing order or write directly to the Grip Hill team.</p><div className="support-actions"><button className="button button-dark" onClick={() => setTrackOpen(true)}>Track order <Truck size={16} /></button><button className="text-link" onClick={() => setContactOpen(true)}>Write to us <Mail size={16} /></button></div></div></section>
      </main>

      <footer className="footer"><div className="footer-top"><div className="footer-brand"><a className="brand footer-logo" href="#top"><img src="/Glogo.png" alt="Grip Hill" /><span>GRIP HILL</span></a><p>Carry With Confidence.</p></div><div className="footer-column"><h4>Collection</h4><a href="#new">Shop all</a><a href="#lifestyle">Lifestyle</a></div><div className="footer-column"><h4>About</h4><a href="#story">Discover our bags</a><a href="#craft">Craft</a><a href="#journal">Journal</a></div><div className="footer-column"><h4>Help</h4><button onClick={() => setTrackOpen(true)}>Track order</button><button onClick={() => setContactOpen(true)}>Write to us</button><a href="/privacy">Privacy</a><a href="/terms">Terms & Conditions</a></div></div><div className="footer-bottom"><span>© 2026 Grip Hill. All rights reserved.</span><span>RJ R Infinity</span></div></footer>

      {searchOpen && <Modal onClose={() => setSearchOpen(false)}><p className="eyebrow">SEARCH GRIP HILL</p><h2>Find your carry.</h2><input autoFocus className="modal-input" placeholder="Search bags, collections..." onChange={(e) => { const q = e.target.value.toLowerCase(); if (q.length > 1) setProducts(prev => [...prev].sort((a,b) => `${a.name}${a.category}`.toLowerCase().includes(q) ? -1 : `${b.name}${b.category}`.toLowerCase().includes(q) ? 1 : 0)); }} /><div className="search-suggestions"><a href="#new" onClick={() => setSearchOpen(false)}>Shop all products</a><a href="#lifestyle" onClick={() => setSearchOpen(false)}>Lifestyle</a><button onClick={() => { setSearchOpen(false); setTrackOpen(true); }}>Track order</button></div></Modal>}

      {productOpen && !productOpen.article && <Modal className="product-modal" onClose={() => setProductOpen(null)}><ProductDetail product={productOpen} onAdd={() => { addToCart(productOpen); setProductOpen(null); }} /></Modal>}
      {productOpen?.article && <Modal onClose={() => setProductOpen(null)}><p className="eyebrow">THE JOURNAL / FIELD NOTE 01</p><h2>What makes a great everyday bag?</h2><p className="modal-copy">An everyday carry is an extension of your routine. We focus on the friction points of modern commuting: sudden rain, fast access to keys, secure laptop storage and the desire to look professional without feeling weighed down.</p><p className="modal-copy">Grip Hill is built around proportion, access, comfort and the small decisions that change how a product feels.</p></Modal>}
      {cartOpen && <Modal className="cart-modal" onClose={() => setCartOpen(false)}><Cart cart={cart} subtotal={subtotal} changeQty={changeQty} removeCart={removeCart} checkout={startCheckout} /></Modal>}
      {checkoutOpen && <Modal className="checkout-modal" onClose={() => !checkoutLoading && setCheckoutOpen(false)}><Checkout cart={cart} subtotal={subtotal} onPay={pay} loading={checkoutLoading} error={checkoutError} /></Modal>}
      {trackOpen && <Modal className="track-modal" onClose={() => setTrackOpen(false)}><TrackOrder /></Modal>}
      {contactOpen && <Modal className="contact-modal" onClose={() => setContactOpen(false)}><ContactForm onDone={() => setContactOpen(false)} /></Modal>}
      {orderResult && <Modal onClose={() => setOrderResult(null)}><div className={`result-icon ${orderResult.success ? 'success' : 'failed'}`}>{orderResult.success ? <Check /> : <X />}</div><p className="eyebrow">GRIP HILL</p><h2>{orderResult.success ? 'Order confirmed.' : 'Payment unsuccessful.'}</h2><p className="modal-copy">{orderResult.success ? `Your order ${orderResult.orderNumber} has been received. A confirmation email has been sent to you.` : `Payment for order ${orderResult.orderNumber} was not completed. You can retry from Track order.`}</p><button className="button button-dark full-width" onClick={() => { setOrderResult(null); if (!orderResult.success) setTrackOpen(true); }}>Continue <ArrowRight size={17} /></button></Modal>}
    </div>
  );
}

function ShieldIcon() { return <ShieldCheck size={25} strokeWidth={1.5} />; }
function CreditCardIcon() { return <span className="sales-ready-icon">₹</span>; }

function ProductDetail({ product, onAdd }) {
  const [selected, setSelected] = useState(0);
  const images = product.images || [];
  return <div><p className="eyebrow">{product.category}</p><h2>{product.name}</h2><div className="detail-grid"><div><ImageCard src={images[selected]?.url} alt={product.name} className="detail-main-image" /><div className="thumb-row">{images.map((im,i)=><button key={im.url} className={i===selected?'active':''} onClick={()=>setSelected(i)}><img src={im.url} alt={`${product.name} ${i+1}`} /></button>)}</div></div><div><div className="detail-price">{money(product.price)} {Number(product.mrp)>Number(product.price)&&<><del>{money(product.mrp)}</del><b>{discount(product)}% OFF</b></>}</div><p className="modal-copy">{product.description}</p><ul className="feature-list"><li><Check size={16}/> Premium everyday utility</li><li><Check size={16}/> Designed for movement</li><li><Check size={16}/> Anti-Theft lock</li><li><Check size={16}/> Powerbank Junction</li><li><Check size={16}/> Best for Travelling</li></ul><button className="button button-dark full-width" onClick={onAdd}>Add to cart <ShoppingBag size={17}/></button></div></div></div>;
}

function Cart({ cart, subtotal, changeQty, removeCart, checkout }) {
  const totalUnits = cart.reduce((s,i)=>s+i.quantity,0);
  return <div><p className="eyebrow">YOUR BAG</p><h2>{cart.length ? `${totalUnits} item(s)` : 'Your cart is empty'}</h2>{!cart.length ? <div className="empty-state"><ShoppingBag size={32}/><p>Add a product to begin your order.</p><button className="button button-dark" onClick={()=>window.location.hash='new'}>Shop collection <ArrowRight size={16}/></button></div> : <><div className="cart-lines">{cart.map(item=><div className="cart-line" key={item.productId}><img src={item.image} alt={item.name}/><div className="cart-line-main"><strong>{item.name}</strong><span>{money(item.price)}</span><div className="qty"><button onClick={()=>changeQty(item.productId,-1)} disabled={item.quantity<=1}>−</button><span>{item.quantity}</span><button onClick={()=>totalUnits<2&&changeQty(item.productId,1)} disabled={totalUnits>=2}>+</button><button className="remove" onClick={()=>removeCart(item.productId)}>Remove</button></div></div></div>)}</div><div className="cart-total"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div className="cart-policy">Maximum 2 items per guest order · Secure Razorpay checkout · Delivery tracking available.</div><button className="button button-dark full-width" onClick={checkout}>Checkout <ArrowRight size={17}/></button></>}</div>;
}

function Checkout({ cart, subtotal, onPay, loading, error }) {
  const [form, setForm] = useState({ name:'', email:'', phone:'', addressLine1:'', addressLine2:'', city:'', state:'', pincode:'', country:'India' });
  const set = (e) => setForm(f=>({...f,[e.target.name]:e.target.value}));
  const submit = (e) => { e.preventDefault(); onPay(form); };
  return <div><p className="eyebrow">CHECKOUT</p><h2>Complete your order.</h2><form className="checkout-form" onSubmit={submit}><div className="checkout-grid">{[['name','Full name'],['email','Email address'],['phone','Phone number'],['addressLine1','Address line 1'],['addressLine2','Address line 2'],['city','City'],['state','State'],['pincode','PIN code']].map(([name,label])=><label key={name} className={name==='addressLine1'||name==='addressLine2'?'span-2':''}>{label}{name!=='addressLine2'&&' *'}<input name={name} value={form[name]} onChange={set} required={name!=='addressLine2'} /></label>)}</div><div className="checkout-summary"><span>Items</span><strong>{cart.reduce((s,i)=>s+i.quantity,0)}</strong><span>Subtotal</span><strong>{money(subtotal)}</strong><span>Shipping</span><strong>Free / confirmed by store</strong><span>Total before payment</span><strong>{money(subtotal)}</strong></div>{error&&<div className="form-error">{error}</div>}<button className="button button-dark full-width" disabled={loading}>{loading?'Opening secure payment…':'Proceed to secure payment'} <ArrowRight size={17}/></button><p className="microcopy">You will be redirected to Razorpay Checkout. Your card/UPI credentials are never stored by Grip Hill.</p></form></div>;
}

function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');

  const [state, setState] = useState({
    loading: false,
    error: '',
    order: null
  });

  // -------------------------------------------------------
  // LOAD ORDER FROM URL
  // Example:
  // /track-order?order=GH-2026-000011&email=abc@gmail.com
  // -------------------------------------------------------
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const urlOrder = params.get('order') || '';
    const urlEmail = params.get('email') || '';

    console.log('TRACK ORDER URL');
    console.log('Order:', urlOrder);
    console.log('Email:', urlEmail);

    if (urlOrder) {
      setOrderNumber(urlOrder);
    }

    if (urlEmail) {
      setEmail(urlEmail);
    }

    // Automatically search when both values exist
    if (urlOrder && urlEmail) {
      loadOrder(urlOrder, urlEmail);
    }
  }, []);

  // -------------------------------------------------------
  // FETCH ORDER
  // -------------------------------------------------------
  const loadOrder = async (orderNo, customerEmail) => {
    const cleanOrder = String(orderNo || '').trim();
    const cleanEmail = String(customerEmail || '').trim();

    if (!cleanOrder || !cleanEmail) {
      setState({
        loading: false,
        error: 'Order number and email address are required.',
        order: null
      });

      return;
    }

    setState({
      loading: true,
      error: '',
      order: null
    });

    try {
      const url =
        `${SHOP_API}/orders/${encodeURIComponent(cleanOrder)}` +
        `?email=${encodeURIComponent(cleanEmail)}`;

      console.log('TRACK ORDER API:', url);

      const response = await fetch(url);

      console.log(
        'TRACK ORDER STATUS:',
        response.status
      );

      const data = await response.json();

      console.log(
        'TRACK ORDER RESPONSE:',
        data
      );

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
          data.message ||
          'Order not found. Please check your order number and email address.'
        );
      }

      setState({
        loading: false,
        error: '',
        order: data.order
      });

    } catch (error) {
      console.error(
        'TRACK ORDER ERROR:',
        error
      );

      setState({
        loading: false,
        error:
          error.message ||
          'Unable to retrieve order tracking information.',
        order: null
      });
    }
  };

  // -------------------------------------------------------
  // MANUAL FORM SUBMIT
  // -------------------------------------------------------
  const submit = async (e) => {
    e.preventDefault();

    await loadOrder(
      orderNumber,
      email
    );
  };

  // -------------------------------------------------------
  // STATUS LABEL
  // -------------------------------------------------------
  const statusLabel = (status) => {
    const labels = {
      PENDING_PAYMENT: 'Payment Pending',
      PAYMENT_PENDING: 'Payment Pending',
      PAYMENT_FAILED: 'Payment Failed',
      PAID: 'Payment Confirmed',
      PROCESSING: 'Processing',
      PACKED: 'Packed',
      SHIPPED: 'Shipped',
      OUT_FOR_DELIVERY: 'Out for Delivery',
      DELIVERED: 'Delivered',
      CANCELLED: 'Cancelled',
      REFUNDED: 'Refunded'
    };

    return (
      labels[status] ||
      String(status || '')
        .replaceAll('_', ' ')
    );
  };

  // -------------------------------------------------------
  // PAYMENT STATUS LABEL
  // -------------------------------------------------------
  const paymentLabel = (status) => {
    const labels = {
      CREATED: 'Payment Pending',
      CAPTURED: 'Payment Successful',
      FAILED: 'Payment Failed'
    };

    return (
      labels[status] ||
      String(status || '')
        .replaceAll('_', ' ')
    );
  };

  return (
    <div>

      <p className="eyebrow">
        ORDER TRACKING
      </p>

      <h2>
        Track your order.
      </h2>

      <form
        className="track-form"
        onSubmit={submit}
      >

        <label>
          Order number

          <input
            value={orderNumber}
            onChange={(e) =>
              setOrderNumber(e.target.value)
            }
            placeholder="GH-2026-000001"
            required
          />
        </label>

        <label>
          Email address

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="your@email.com"
            required
          />
        </label>

        <button
          className="button button-dark full-width"
          disabled={state.loading}
        >
          {state.loading
            ? 'Checking…'
            : 'Track order'}

          <Truck size={17} />
        </button>

      </form>

      {/* ERROR */}
      {state.error && (
        <div className="form-error">
          {state.error}
        </div>
      )}

      {/* ORDER RESULT */}
      {state.order && (
        <div className="tracking-result">

          {/* HEADER */}
          <div className="tracking-head">

            <strong>
              #{state.order.order_number}
            </strong>

            <span>
              {statusLabel(
                state.order.status
              )}
            </span>

          </div>

          {/* CUSTOMER / TOTAL */}
          <p>
            {state.order.customer_name}
            {' · '}
            {money(
              state.order.total_amount
            )}
          </p>

          {/* PAYMENT */}
          <div
            className="tracking-box"
            style={{
              marginTop: '12px'
            }}
          >

            <div>

              <strong>
                Payment
              </strong>

              <span>
                {paymentLabel(
                  state.order.payment_status
                )}
              </span>

            </div>

          </div>

          {/* PRODUCTS */}
          {Array.isArray(
            state.order.items
          ) &&
            state.order.items.length > 0 && (
              <div
                className="tracking-box"
                style={{
                  marginTop: '12px',
                  display: 'block'
                }}
              >

                <strong>
                  Products
                </strong>

                <div
                  style={{
                    marginTop: '10px'
                  }}
                >

                  {state.order.items.map(
                    (item, index) => (
                      <div
                        key={`${item.sku}-${index}`}
                        style={{
                          display: 'flex',
                          justifyContent:
                            'space-between',
                          gap: '12px',
                          padding:
                            '8px 0',
                          borderBottom:
                            '1px solid #eee'
                        }}
                      >

                        <span>
                          {item.name}
                          {' × '}
                          {item.quantity}
                        </span>

                        <strong>
                          {money(
                            item.lineTotal
                          )}
                        </strong>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

          {/* TIMELINE */}
          <div className="timeline">

            {state.order.history?.map(
              (h, i) => (
                <div
                  className="timeline-item"
                  key={`${h.status}-${i}`}
                >

                  <div className="timeline-dot">

                    {i ===
                    state.order.history
                      .length - 1 ? (
                      <Check size={12} />
                    ) : (
                      ''
                    )}

                  </div>

                  <div>

                    <strong>
                      {statusLabel(
                        h.status
                      )}
                    </strong>

                    <small>
                      {new Date(
                        h.createdAt
                      ).toLocaleString(
                        'en-IN'
                      )}
                    </small>

                    {h.remarks && (
                      <p>
                        {h.remarks}
                      </p>
                    )}

                  </div>

                </div>
              )
            )}

          </div>

          {/* DELIVERY */}
          <div
            className="tracking-box"
            style={{
              marginTop: '15px'
            }}
          >

            <Truck size={18} />

            <div>

              <strong>
                {state.order.courier_name ||
                  'Delivery'}
              </strong>

              <span>
                {state.order.tracking_number ||
                  'Tracking number will appear after dispatch'}
              </span>

              {state.order.estimated_delivery_date && (
                <span>
                  Estimated delivery:{' '}
                  {new Date(
                    state.order
                      .estimated_delivery_date
                  ).toLocaleDateString(
                    'en-IN'
                  )}
                </span>
              )}

            </div>

          </div>

          {/* SHIPPING ADDRESS */}
          <div
            className="tracking-box"
            style={{
              marginTop: '15px'
            }}
          >

            <div>

              <strong>
                Shipping address
              </strong>

              <span>
                {state.order.shipping_address}
              </span>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

function ContactForm({ onDone }) {
  const [form,setForm]=useState({name:'',email:'',phone:'',subject:'Order Support',orderNumber:'',message:''}); const [state,setState]=useState({loading:false,error:'',success:''});
  const set=e=>setForm(f=>({...f,[e.target.name]:e.target.value}));
  const submit=async e=>{e.preventDefault();setState({loading:true,error:'',success:''});try{const r=await fetch(`${SHOP_API}/contact`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});const d=await r.json();if(!r.ok||!d.success)throw new Error(d.error||'Unable to send message.');setState({loading:false,error:'',success:`Message received. Reference ${d.reference}.`});}catch(err){setState({loading:false,error:err.message,success:''});}};
  return <div><p className="eyebrow">WRITE TO US</p><h2>How can we help?</h2><form className="checkout-form" onSubmit={submit}><div className="checkout-grid"><label>Name *<input name="name" value={form.name} onChange={set} required /></label><label>Email *<input name="email" type="email" value={form.email} onChange={set} required /></label><label>Phone<input name="phone" value={form.phone} onChange={set} /></label><label>Subject<select name="subject" value={form.subject} onChange={set}><option>Order Support</option><option>Product Question</option><option>Shipping</option><option>Return / Exchange</option><option>Other</option></select></label><label>Order number<input name="orderNumber" value={form.orderNumber} onChange={set} /></label><label className="span-2">Message *<textarea name="message" value={form.message} onChange={set} required rows="5" /></label></div>{state.error&&<div className="form-error">{state.error}</div>}{state.success&&<div className="form-success"><Check size={16}/>{state.success}</div>}<button className="button button-dark full-width" disabled={state.loading}>{state.loading?'Sending…':'Send message'} <Mail size={16}/></button></form></div>;
}
