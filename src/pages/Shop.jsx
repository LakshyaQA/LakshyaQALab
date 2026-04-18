import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNetwork } from '../context/NetworkContext'
import { useLogger } from '../context/LoggerContext'
import Sidebar from '../components/navigation/Sidebar'
import ControlCenter from '../components/sandbox/ControlCenter'

const SHOP_PRODUCTS = [
  {
    id: 101,
    name: 'Ultra Gaming Laptop',
    price: 1499.99,
    category: 'Computing',
    rating: 4.9,
    img: '💻',
    stock: 5,
    description: 'High-performance gaming beast with RTX 4080.',
  },
  {
    id: 102,
    name: 'Pro Wireless Mouse',
    price: 79.99,
    category: 'Accessories',
    rating: 4.7,
    img: '🖱️',
    stock: 20,
    description: 'Lightweight, lag-free precision.',
  },
  {
    id: 103,
    name: '4K Ultra-Wide Monitor',
    price: 549.0,
    category: 'Computing',
    rating: 4.8,
    img: '🖥️',
    stock: 8,
    description: 'Immersive 34-inch curved display.',
  },
  {
    id: 104,
    name: 'Mechanical RGB Keyboard',
    price: 129.5,
    category: 'Accessories',
    rating: 4.6,
    img: '⌨️',
    stock: 15,
    description: 'Tactile switches with custom lighting.',
  },
  {
    id: 105,
    name: 'Noise-Cancelling Pods',
    price: 199.99,
    category: 'Audio',
    rating: 4.5,
    img: '🎧',
    stock: 12,
    description: 'Crystal clear sound and silent ANC.',
  },
  {
    id: 106,
    name: 'Smart Mesh Router',
    price: 299.0,
    category: 'Networking',
    rating: 4.4,
    img: '🌐',
    stock: 10,
    description: 'Whole-home seamless Wi-Fi coverage.',
  },
  {
    id: 107,
    name: 'Ergonomic Desk Pro',
    price: 450.0,
    category: 'Furniture',
    rating: 4.9,
    img: '🪑',
    stock: 4,
    description: 'Sleek dark wood with motorized height adjustment.',
  },
  {
    id: 108,
    name: 'Creator Webcam 4K',
    price: 159.0,
    category: 'Accessories',
    rating: 4.3,
    img: '📷',
    stock: 30,
    description: 'Professional streaming quality for desktops.',
  },
]

const Shop = () => {
  const { isAuthenticated, logout } = useAuth()
  const { mockFetch } = useNetwork()
  const { addLog } = useLogger()
  const navigate = useNavigate()

  // --- UI State ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState(null) // null, 'shipping', 'payment', 'confirm'

  // --- Filter State ---
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [priceRange, setPriceRange] = useState(2000)

  // --- Cart State ---
  const [cart, setCart] = useState([])

  // --- Header Handling (Same as Dashboard/Sandbox) ---
  useEffect(() => {
    document.title = 'Shop | LakshyaQALab'

    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.innerWidth < 768) {
            setIsScrolled(false)
            ticking = false
            return
          }
          const y = window.scrollY
          setIsScrolled(prev => {
            if (!prev && y > 80) return true
            if (prev && y < 20) return false
            return prev
          })
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // --- Logic ---
  const filteredProducts = useMemo(() => {
    return SHOP_PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === 'All' || p.category === category
      const matchesPrice = p.price <= priceRange
      return matchesSearch && matchesCategory && matchesPrice
    })
  }, [search, category, priceRange])

  const addToCart = product => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item))
      }
      return [...prev, { ...product, qty: 1 }]
    })
    addLog('action', `Added to shop cart: ${product.name}`)
  }

  const updateQty = (id, delta) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(1, item.qty + delta)
          return { ...item, qty: newQty }
        }
        return item
      })
    )
  }

  const removeFromCart = id => {
    setCart(prev => prev.filter(item => item.id !== id))
    addLog('action', `Removed item from shop cart: ID ${id}`)
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  const handleCheckout = async e => {
    e.preventDefault()
    addLog('action', 'Checkout initiated')
    setCheckoutStep('confirm')

    try {
      await mockFetch('/api/v1/shop/checkout')
      addLog('info', 'Order processed successfully')
      setTimeout(() => {
        setCart([])
        setCheckoutStep(null)
        setIsCartOpen(false)
        alert('Order Placed Successfully! Mock order #QA-' + Math.floor(Math.random() * 9000))
      }, 1500)
    } catch (err) {
      addLog('error', `Checkout failed: ${err.message}`)
    }
  }

  if (!isAuthenticated) return null

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* ───── Cart Drawer ───── */}
      <div
        className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsCartOpen(false)}
        />
        <aside
          className={`absolute top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-500 ease-out transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
          data-testid="cart-drawer"
        >
          <div className="flex flex-col h-full">
            <header className="px-6 py-5 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
              <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                Shopping Cart ({cart.length})
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                data-testid="close-cart"
              >
                <svg
                  className="w-5 h-5 focus:outline-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <span className="text-6xl mb-4">🛒</span>
                  <p className="font-bold text-gray-500 uppercase tracking-widest text-xs">
                    Your cart is empty
                  </p>
                </div>
              ) : (
                cart.map(item => (
                  <div
                    key={item.id}
                    className="flex gap-4 bg-gray-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-gray-100 dark:border-slate-800"
                    data-testid={`cart-item-${item.id}`}
                  >
                    <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-3xl shadow-sm">
                      {item.img}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                        {item.name}
                      </h4>
                      <p className="text-indigo-600 font-black text-xs">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="w-6 h-6 rounded bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 flex items-center justify-center text-xs"
                          data-testid="qty-minus"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold w-4 text-center" data-testid="item-qty">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-6 h-6 rounded bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 flex items-center justify-center text-xs"
                          data-testid="qty-plus"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-rose-500 transition-colors p-1 self-start"
                      data-testid="remove-item"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            <footer className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                  Subtotal
                </span>
                <span
                  className="text-2xl font-black text-gray-900 dark:text-white"
                  data-testid="cart-total"
                >
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
              <button
                disabled={cart.length === 0}
                onClick={() => setCheckoutStep('shipping')}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                data-testid="checkout-btn"
              >
                Proceed to Checkout
              </button>
            </footer>
          </div>
        </aside>
      </div>

      {/* ───── Checkout Modal ───── */}
      {checkoutStep && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            onClick={() => setCheckoutStep(null)}
          />
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <header className="p-6 border-b border-gray-100 dark:border-slate-800">
              <h2 className="text-xl font-black uppercase tracking-tighter">Secure Checkout</h2>
            </header>
            <div className="p-8">
              {checkoutStep === 'confirm' ? (
                <div className="py-10 text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center animate-pulse mb-6 text-3xl">
                    📡
                  </div>
                  <h3 className="text-lg font-bold mb-2">Processing Order...</h3>
                  <p className="text-sm text-gray-500">Contacting mock payment gateway...</p>
                </div>
              ) : (
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="QA Tester"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      data-testid="checkout-name"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                      Shipping Address
                    </label>
                    <textarea
                      required
                      placeholder="123 Test Lane, Automation City"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                      data-testid="checkout-address"
                    ></textarea>
                  </div>
                  <div className="bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 flex justify-between items-center mb-6">
                    <div>
                      <p className="text-[10px] font-black uppercase text-indigo-400">
                        Total Charged
                      </p>
                      <p className="text-xl font-black text-indigo-700 dark:text-indigo-300">
                        ${cartTotal.toFixed(2)}
                      </p>
                    </div>
                    <span className="text-[10px] bg-indigo-600 text-white px-2 py-1 rounded font-bold">
                      MOCK PAYMENT
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep(null)}
                      className="flex-1 py-3 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:scale-105 transition-transform"
                      data-testid="place-order-btn"
                    >
                      Place Order
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ───── Main App UI ───── */}
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
        {/* Sticky Header */}
        <div
          className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'px-0 pt-0' : 'pt-8 px-8'}`}
        >
          <div
            className={`transition-all duration-500 ${isScrolled ? 'max-w-none w-full' : 'max-w-7xl mx-auto'}`}
          >
            <header
              className={`flex justify-between items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-gray-100 dark:border-slate-800 transition-all duration-500 ${isScrolled ? 'p-3 px-8 rounded-none' : 'p-5 rounded-3xl'}`}
            >
              <div
                className={`flex items-center justify-between w-full ${isScrolled ? 'max-w-7xl mx-auto' : ''}`}
              >
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2.5 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                    data-testid="sidebar-toggle"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                  <div className="flex flex-col">
                    <h1
                      className={`font-black uppercase tracking-tighter text-gray-900 dark:text-white transition-all duration-300 ${isScrolled ? 'text-lg' : 'text-2xl'}`}
                    >
                      E-Comm Shop
                    </h1>
                    {!isScrolled && (
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                        Realistic Sandbox
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-gray-700 dark:text-white transition-all group"
                    data-testid="header-cart-btn"
                  >
                    <svg
                      className="w-5 h-5 group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-in zoom-in duration-200">
                        {cart.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      logout()
                      navigate('/login')
                    }}
                    className="px-6 py-2.5 bg-rose-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-rose-600 shadow-lg shadow-rose-500/20 active:scale-95 transition-all"
                  >
                    Exit
                  </button>
                </div>
              </div>
            </header>
          </div>
        </div>

        <main className="max-w-7xl mx-auto p-8 pt-6 pb-40">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* ──────── Sidebar Filters ──────── */}
            <aside className="w-full lg:w-64 flex-shrink-0 space-y-10">
              <section>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                  Discovery
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Products..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-5 pr-5 py-3.5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                    data-testid="shop-search"
                  />
                </div>
              </section>

              <section>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  {['All', 'Computing', 'Accessories', 'Audio', 'Networking', 'Furniture'].map(
                    cat => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${category === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 translate-x-1' : 'text-gray-500 hover:bg-white dark:hover:bg-slate-900 hover:text-indigo-500'}`}
                        data-testid={`category-${cat.toLowerCase()}`}
                      >
                        {cat}
                        <span className="text-[10px] opacity-60">
                          {cat === 'All'
                            ? SHOP_PRODUCTS.length
                            : SHOP_PRODUCTS.filter(p => p.category === cat).length}
                        </span>
                      </button>
                    )
                  )}
                </div>
              </section>

              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Price Up To
                  </h3>
                  <span className="text-xs font-black text-indigo-600">${priceRange}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={priceRange}
                  onChange={e => setPriceRange(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  data-testid="shop-price-range"
                />
              </section>
            </aside>

            {/* ──────── Product Listing ──────── */}
            <div className="flex-1">
              <header className="flex justify-between items-center mb-8 bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800">
                <p className="text-xs font-bold text-gray-500">
                  Showing{' '}
                  <span className="text-gray-900 dark:text-white">{filteredProducts.length}</span>{' '}
                  results
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30' : 'text-gray-400 hover:bg-gray-50'}`}
                    data-testid="grid-view"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30' : 'text-gray-400 hover:bg-gray-50'}`}
                    data-testid="list-view"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </header>

              {filteredProducts.length === 0 ? (
                <div className="py-24 text-center">
                  <div className="text-6xl mb-6">🏜️</div>
                  <h3 className="text-xl font-bold mb-2">No Matching Products</h3>
                  <p className="text-gray-500">Try adjusting your filters or search keywords.</p>
                </div>
              ) : (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                      : 'flex flex-col gap-4'
                  }
                  data-testid="shop-product-list"
                >
                  {filteredProducts.map(product => (
                    <div
                      key={product.id}
                      className={`bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-1 relative group overflow-hidden ${viewMode === 'list' ? 'flex p-4 gap-6' : 'p-6 flex flex-col'}`}
                      data-testid={`product-card-${product.id}`}
                    >
                      <div
                        className={`bg-gray-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0 transition-transform duration-500 group-hover:scale-110 ${viewMode === 'list' ? 'w-32 h-32' : 'w-full h-48 mb-6'}`}
                      >
                        {product.img}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                            {product.category}
                          </span>
                          <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-950/20 px-2 py-0.5 rounded-lg text-yellow-600 dark:text-yellow-400 text-[10px] font-black">
                            ⭐ {product.rating}
                          </div>
                        </div>
                        <h3
                          className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2 truncate"
                          data-testid="product-name"
                        >
                          {product.name}
                        </h3>
                        <p
                          className={`text-xs text-gray-500 dark:text-gray-400 mb-6 leading-relaxed ${viewMode === 'grid' ? 'line-clamp-2' : ''}`}
                        >
                          {product.description}
                        </p>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 dark:border-slate-800/50">
                          <span
                            className="text-2xl font-black text-gray-900 dark:text-white"
                            data-testid="product-price"
                          >
                            ${product.price.toFixed(2)}
                          </span>
                          <button
                            onClick={() => addToCart(product)}
                            className="bg-slate-900 dark:bg-indigo-600 text-white p-3 rounded-2xl hover:scale-110 active:scale-90 transition-all shadow-xl shadow-slate-900/10 dark:shadow-indigo-600/20"
                            data-testid="add-to-cart-btn"
                            aria-label="Add to cart"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </button>
                        </div>
                        {product.stock < 10 && (
                          <p className="text-[9px] font-black text-rose-500 uppercase tracking-tighter mt-2">
                            Only {product.stock} units left in stock!
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <ControlCenter />
    </>
  )
}

export default Shop
