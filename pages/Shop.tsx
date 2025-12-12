import React, { useState, useMemo, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { ProductListItem } from '../components/ProductListItem';
import { CATEGORIES, Product } from '../types';
import { Search, Filter, LayoutGrid, List, ShoppingBag, AlertCircle, ArrowRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Shop: React.FC = () => {
  const { products } = useShop();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  // Default to List View (false)
  const [isGridView, setIsGridView] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FDF5E6] pb-20">
      {/* Header */}
      <div className="bg-[#FAEBD7] shadow-sm py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Catalog</h1>
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search hardware items..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Mobile Category hint */}
            <div className="md:hidden w-full flex items-center gap-2 text-sm text-gray-500">
               <Filter size={16} /> Scroll below to filter
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-[#FAEBD7] p-4 rounded-lg shadow-sm border border-orange-100 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Filter size={18} /> Categories
            </h3>
            <div className="space-y-2 max-h-60 md:max-h-none overflow-y-auto">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedCategory === cat 
                      ? 'bg-orange-100 text-orange-800 font-medium' 
                      : 'text-gray-600 hover:bg-[#FDF5E6]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid/List */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-500">
              Showing {filteredProducts.length} items
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-orange-100">
              <button 
                onClick={() => setIsGridView(true)}
                className={`p-2 rounded-md transition-colors ${isGridView ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:bg-gray-50'}`}
                title="Grid View"
              >
                <LayoutGrid size={20} />
              </button>
              <button 
                onClick={() => setIsGridView(false)}
                className={`p-2 rounded-md transition-colors ${!isGridView ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:bg-gray-50'}`}
                title="List View"
              >
                <List size={20} />
              </button>
            </div>
          </div>
          
          {isGridView ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredProducts.map(product => (
                <ProductListItem key={product.id} product={product} />
              ))}
            </div>
          )}
          
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              <button 
                onClick={() => {setSelectedCategory("All"); setSearchQuery("");}}
                className="mt-4 text-orange-600 font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};