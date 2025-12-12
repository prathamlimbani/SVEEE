import React, { useState } from 'react';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, AlertCircle, ArrowRight, Plus } from 'lucide-react';
import { QuickAddModal } from './QuickAddModal';

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const navigate = useNavigate();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsQuickAddOpen(true);
  };

  return (
    <>
      <div 
        onClick={() => navigate(`/product/${product.id}`)}
        className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100 cursor-pointer group relative"
      >
        <div className="relative h-48 overflow-hidden rounded-t-lg bg-gray-100">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          
          {/* Availability / Status Badges */}
          {!product.isAvailable ? (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-3 py-1 text-sm font-bold uppercase tracking-wider rounded">Unavailable</span>
            </div>
          ) : (
             <>
                {product.isNewArrival && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="bg-green-500 text-white px-2 py-1 text-xs font-bold uppercase rounded shadow-sm">New</span>
                  </div>
                )}
                {/* Quick Add Button - Floating on Image */}
                <button
                  onClick={handleQuickAddClick}
                  className="absolute bottom-2 right-2 z-10 bg-white/90 hover:bg-orange-600 hover:text-white text-gray-800 p-2 rounded-full shadow-md backdrop-blur-sm transition-all transform hover:scale-105"
                  title="Quick Add to List"
                >
                  <Plus size={20} strokeWidth={2.5} />
                </button>
             </>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">{product.category}</span>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-1 leading-snug">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
          
          <div className="mt-auto pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-orange-600 font-medium">View Details</span>
              <div className="bg-orange-100 p-2 rounded-full text-orange-600">
                <ArrowRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <QuickAddModal 
        product={product} 
        isOpen={isQuickAddOpen} 
        onClose={() => setIsQuickAddOpen(false)} 
      />
    </>
  );
};