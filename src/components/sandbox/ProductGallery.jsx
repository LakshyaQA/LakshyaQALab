import React, { useState, useMemo } from 'react';
import { useLogger } from '../../context/LoggerContext';

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Precision Gaming Mouse', price: 59.99, category: 'Electronics', rating: 4.8, img: '🖱️', stock: 15 },
  { id: 2, name: 'Mechanical Keyboard (Blue Switch)', price: 129.99, category: 'Electronics', rating: 4.9, img: '⌨️', stock: 5 },
  { id: 3, name: 'Noise Canceling Headphones', price: 199.99, category: 'Electronics', rating: 4.7, img: '🎧', stock: 0 },
  { id: 4, name: 'Ergonomic Desk Chair', price: 299.00, category: 'Furniture', rating: 4.5, img: '🪑', stock: 8 },
  { id: 5, name: 'Minimalist LED Desk Lamp', price: 45.50, category: 'Furniture', rating: 4.3, img: '💡', stock: 22 },
  { id: 6, name: 'Stainless Steel Water Bottle', price: 25.00, category: 'Lifestyle', rating: 4.6, img: '🧴', stock: 50 },
  { id: 7, name: 'Leather Bound Notebook', price: 18.00, category: 'Lifestyle', rating: 4.4, img: '📓', stock: 12 },
  { id: 8, name: 'USB-C Fast Charger', price: 35.00, category: 'Electronics', rating: 4.2, img: '🔌', stock: 100 },
];

const ProductGallery = () => {
  const { addLog } = useLogger();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('none');
  const [cart, setCart] = useState([]);

  const filteredProducts = useMemo(() => {
    let result = INITIAL_PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || p.category === category;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'price-low') result.sort((a,b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a,b) => b.price - a.price);
    if (sortBy === 'rating') result.sort((a,b) => b.rating - a.rating);

    return result;
  }, [search, category, sortBy]);

  const handleAddToCart = (product) => {
    setCart(prev => [...prev, product.id]);
    addLog('action', `Product added to cart: ${product.name} ($${product.price})`);
  };

  const handleSearch = (val) => {
    setSearch(val);
    addLog('action', `Product search filtered: "${val}"`);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden" id="products" data-testid="product-gallery">
      {/* Header & Controls */}
      <div className="p-8 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Product Gallery</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Practice list extraction, dynamic filtering, and price verification.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-black text-xs uppercase tracking-widest">
               Cart: {cart.length} Items
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              data-testid="product-search-input"
            />
            <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>

          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            data-testid="product-category-filter"
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Lifestyle">Lifestyle</option>
          </select>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            data-testid="product-sort"
          >
            <option value="none">Sort By: Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating: Top Rated</option>
          </select>
        </div>
      </div>

      {/* Product List */}
      <div className="p-8">
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
             <div className="text-4xl mb-4">🔍</div>
             <p className="text-gray-500 font-medium">No products match your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="product-list">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="group border border-gray-100 dark:border-slate-700 rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 bg-white dark:bg-slate-800/50"
                data-testid={`product-card-${product.id}`}
              >
                <div className="h-32 bg-gray-50 dark:bg-slate-900 rounded-xl mb-4 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-500">
                  {product.img}
                </div>
                <div className="mb-1 text-[10px] font-black text-blue-500 uppercase tracking-widest">{product.category}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1" data-testid="product-name">{product.name}</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-black text-gray-900 dark:text-white" data-testid="product-price">${product.price.toFixed(2)}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-xs">⭐</span>
                    <span className="text-xs font-bold text-gray-500 dark:text-slate-400" data-testid="product-rating">{product.rating}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 ${
                    product.stock === 0 
                      ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-95'
                  }`}
                  data-testid="add-to-cart-btn"
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                
                {product.stock > 0 && product.stock < 10 && (
                  <p className="mt-2 text-[10px] text-center text-rose-500 font-bold uppercase tracking-tight">Only {product.stock} left!</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Automation Reference */}
      <div className="bg-gray-50 dark:bg-slate-900/50 p-6 border-t border-gray-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs">🤖</div>
           <p className="text-xs text-gray-500 font-medium">Scenarios: List extraction, regex price validation, state checking (out of stock).</p>
        </div>
        <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">data-testid="product-list"</div>
      </div>
    </div>
  );
};

export default ProductGallery;
