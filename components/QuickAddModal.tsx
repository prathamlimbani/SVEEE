import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { X, ShoppingBag, Check } from 'lucide-react';

interface Props {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAddModal: React.FC<Props> = ({ product, isOpen, onClose }) => {
  const { addToCart } = useShop();
  const [selectedFinish, setSelectedFinish] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [added, setAdded] = useState(false);

  // Reset state when product opens
  useEffect(() => {
    if (isOpen) {
      setAdded(false);
      if (product.variants && product.variants.length > 0) {
        // Default to first finish
        const firstVariant = product.variants[0];
        setSelectedFinish(firstVariant.finish);
        setAvailableSizes(firstVariant.sizes);
        if (firstVariant.sizes.length > 0) {
            setSelectedSize(firstVariant.sizes[0]);
        } else {
            setSelectedSize('');
        }
      } else if (product.sizes.length > 0) {
        // Fallback for simple sizes
        setSelectedFinish('');
        setAvailableSizes(product.sizes);
        setSelectedSize(product.sizes[0]);
      } else {
         // No sizes defined
         setSelectedFinish('');
         setAvailableSizes([]);
         setSelectedSize('');
      }
    }
  }, [isOpen, product]);

  const handleFinishChange = (finish: string) => {
    setSelectedFinish(finish);
    const variant = product?.variants.find(v => v.finish === finish);
    if (variant) {
        setAvailableSizes(variant.sizes);
        if (variant.sizes.length > 0) {
            setSelectedSize(variant.sizes[0]);
        } else {
            setSelectedSize('');
        }
    }
  };

  const handleAddToCart = () => {
    if (selectedSize) {
      addToCart(product, selectedSize, selectedFinish);
      setAdded(true);
      setTimeout(() => {
        setAdded(false);
        onClose();
      }, 1000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
           <h3 className="font-bold text-gray-900 truncate pr-4">Add to Cart</h3>
           <button onClick={onClose} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
             <X size={20} />
           </button>
        </div>

        <div className="p-6 overflow-y-auto">
           <div className="flex gap-4 mb-6">
              <div className="w-20 h-20 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                 {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                 )}
              </div>
              <div>
                 <h4 className="font-bold text-lg text-gray-900 leading-tight">{product.name}</h4>
                 <p className="text-sm text-gray-500 mt-1">{product.category}</p>
              </div>
           </div>

           {/* Selections */}
           <div className="space-y-4">
                {product.variants && product.variants.length > 0 && (
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Finish</label>
                        <div className="flex flex-wrap gap-2">
                            {product.variants.map(v => (
                                <button
                                    key={v.finish}
                                    onClick={() => handleFinishChange(v.finish)}
                                    className={`px-3 py-1.5 rounded-md text-sm border transition-all ${
                                        selectedFinish === v.finish 
                                        ? 'border-orange-600 bg-orange-50 text-orange-700 font-bold shadow-sm' 
                                        : 'border-gray-200 text-gray-600 hover:border-orange-300'
                                    }`}
                                >
                                    {v.finish}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Size</label>
                    <div className="flex flex-wrap gap-2">
                        {availableSizes.length > 0 ? (
                            availableSizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-3 py-1.5 rounded-md text-sm border transition-all ${
                                        selectedSize === size 
                                        ? 'border-orange-600 bg-orange-50 text-orange-700 font-bold shadow-sm' 
                                        : 'border-gray-200 text-gray-600 hover:border-orange-300'
                                    }`}
                                >
                                    {size}
                                </button>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 italic">No sizes available.</p>
                        )}
                    </div>
                </div>
           </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-gray-100 bg-white">
           <button
             onClick={handleAddToCart}
             disabled={!selectedSize}
             className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                added 
                    ? 'bg-green-600 text-white'
                    : !selectedSize
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
             }`}
           >
              {added ? <><Check size={20} /> Added</> : <><ShoppingBag size={20} /> Add Item</>}
           </button>
        </div>
      </div>
    </div>
  );
};