import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductListItem } from '../components/ProductListItem';

export const Home: React.FC = () => {
  const { products } = useShop();
  const navigate = useNavigate();
  
  // Get latest 4 new arrivals
  const newArrivals = products
    .filter(p => p.isNewArrival && p.isAvailable)
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FDF5E6]">
      <div className="flex flex-col flex-grow">
        
        {/* Compact Hero Section */}
        <section className="bg-[#FAEBD7] pt-16 pb-8 px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-4">
                <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-wide text-gray-900">
                    Sri Vijayalaxmi Enterprise
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
                    Premium Hardware Solution & Wholesale
                </p>
                
                <div className="pt-4">
                    <Link 
                    to="/shop" 
                    className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full font-medium text-sm transition-colors shadow-sm"
                    >
                    Browse Catalog <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </section>

        {/* New Arrivals - Continues immediately */}
        <section className="py-10 flex-grow relative bg-[#FDF5E6]">
            {/* Subtle Watermark */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="" 
                  className="w-[70%] opacity-[0.03] object-contain grayscale"
                />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4">
              <div className="flex justify-between items-center mb-8 border-b border-orange-200 pb-4">
                  <h2 className="text-2xl font-serif font-bold text-gray-900">New Arrivals</h2>
                  <Link to="/shop" className="text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-1 text-sm">
                  View All <ArrowRight size={16} />
                  </Link>
              </div>

              {/* Vertical List Layout */}
              <div className="flex flex-col gap-4">
                  {newArrivals.length > 0 ? (
                  newArrivals.map(product => (
                      <ProductListItem key={product.id} product={product} />
                  ))
                  ) : (
                  <p className="text-center text-gray-400 py-12">No new arrivals at the moment.</p>
                  )}
              </div>
            </div>
        </section>

        {/* Owner Login Section */}
        <section className="bg-gray-900 py-8 relative z-10 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-white">
                <div>
                    <h3 className="text-lg font-semibold">Store Administration</h3>
                    <p className="text-gray-400 text-sm">Restricted area for store owners.</p>
                </div>
                <button 
                    onClick={() => navigate('/admin')} 
                    className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-semibold transition-all border border-white/20 text-sm"
                >
                    <Lock size={14} /> Owner Login
                </button>
            </div>
        </section>
      </div>
    </div>
  );
};