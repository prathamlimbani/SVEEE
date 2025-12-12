import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Plus } from 'lucide-react';
import { QuickAddModal } from './QuickAddModal';

export const ProductListItem: React.FC<{ product: Product }> = ({ product }) => {
  const navigate = useNavigate();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsQuickAddOpen(true);
  };

  // Helper to get display sizes (mix of finish/sizes or just sizes)
  const displaySizes = useMemo(() => {
    if (product.variants && product.variants.length > 0) {
       return `${product.variants.length} Finishes Available`;
    }
    return product.sizes.join(', ');
  }, [product]);

  return (
    <>
      <div 
        onClick={() => navigate(`/product/${product.id}`)}
        className="bg-white rounded-lg shadow-sm border border-orange-100 p-3 sm:p-4 flex flex-row gap-3 sm:gap-4 items-center cursor-pointer hover:bg-orange-50/30 transition-colors"
      >
        {/* Image */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden relative">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0 text-left">
          <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] sm:text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">{product.category}</span>
              {product.isNewArrival && <span className="text-[10px] sm:text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">New</span>}
          </div>
          <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">{product.name}</h3>
          <p className="text-xs sm:text-sm text-gray-500 line-clamp-1 mb-2">{product.description}</p>
          
          <p className="text-xs text-gray-500">
            {displaySizes}
          </p>
        </div>

        {/* Action */}
        <div className="flex-shrink-0 flex gap-2">
          {product.isAvailable && (
             <button
               onClick={handleQuickAddClick}
               className="flex items-center justify-center p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-orange-600 hover:text-white transition-colors border border-gray-200"
               title="Quick Add"
             >
               <Plus size={20} />
             </button>
          )}

          <button
            className={`flex items-center justify-center gap-1 p-2 sm:px-4 sm:py-2 rounded-md text-sm font-medium transition-colors ${
              !product.isAvailable
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
            }`}
          >
            {product.isAvailable ? (
              <ArrowRight size={20} />
            ) : (
              <span className="text-xs">Unavailable</span>
            )}
          </button>
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