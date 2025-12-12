import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ArrowLeft, ShoppingBag, Check, AlertCircle } from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart } = useShop();
  
  const product = products.find(p => p.id === id);
  
  // State for selections
  const [selectedFinish, setSelectedFinish] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [added, setAdded] = useState(false);
  
  // Image Gallery State
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    if (product) {
      // Set initial image
      if (product.images && product.images.length > 0) {
        setActiveImage(product.images[0]);
      } else {
        setActiveImage(product.image || '');
      }

      // Set initial variants
      if (product.variants && product.variants.length > 0) {
        // Default to first finish
        const firstVariant = product.variants[0];
        setSelectedFinish(firstVariant.finish);
        setAvailableSizes(firstVariant.sizes);
        if (firstVariant.sizes.length > 0) {
            setSelectedSize(firstVariant.sizes[0]);
        }
      } else if (product.sizes.length > 0) {
        // Fallback for legacy simple sizes
        setSelectedFinish(''); // No specific finish
        setAvailableSizes(product.sizes);
        setSelectedSize(product.sizes[0]);
      }
    }
  }, [product]);

  // Update sizes when finish changes
  const handleFinishChange = (finish: string) => {
    setSelectedFinish(finish);
    const variant = product?.variants.find(v => v.finish === finish);
    if (variant) {
        setAvailableSizes(variant.sizes);
        if (variant.sizes.length > 0) {
            setSelectedSize(variant.sizes[0]);
        }
    }
  };

  const handleAddToCart = () => {
    if (product && selectedSize) {
        addToCart(product, selectedSize, selectedFinish);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    }
  };

  if (!product) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDF5E6]">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
                <button onClick={() => navigate('/shop')} className="mt-4 text-orange-600 underline">Back to Shop</button>
            </div>
        </div>
    );
  }

  const isOutOfStock = !product.isAvailable;
  
  // Determine images list
  const galleryImages = product.images && product.images.length > 0 
    ? product.images 
    : (product.image ? [product.image] : []);

  return (
    <div className="min-h-screen bg-[#FDF5E6] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6 transition-colors"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-orange-100 flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="w-full md:w-1/2 bg-gray-50 flex flex-col">
             {/* Main Active Image */}
             <div className="relative h-64 md:h-96 w-full">
                {activeImage ? (
                    <img src={activeImage} alt={product.name} className="w-full h-full object-contain p-4" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
                )}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-4 py-2 text-lg font-bold uppercase rounded">Unavailable</span>
                    </div>
                )}
             </div>

             {/* Thumbnails */}
             {galleryImages.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto border-t border-gray-200">
                    {galleryImages.map((img, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setActiveImage(img)}
                            className={`w-16 h-16 rounded border-2 flex-shrink-0 overflow-hidden ${
                                activeImage === img ? 'border-orange-600' : 'border-gray-200 hover:border-orange-300'
                            }`}
                        >
                            <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
             )}
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col">
             <div className="flex items-start justify-between mb-4">
                 <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {product.category}
                 </span>
                 {product.isNewArrival && (
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">New</span>
                 )}
             </div>

             <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
             <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

             <div className="space-y-6 mb-8 flex-grow">
                {/* Finish Selection */}
                {product.variants && product.variants.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Finishing</label>
                        <div className="flex flex-wrap gap-3">
                            {product.variants.map(v => (
                                <button
                                    key={v.finish}
                                    onClick={() => handleFinishChange(v.finish)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium border transition-all ${
                                        selectedFinish === v.finish 
                                        ? 'border-orange-600 bg-orange-50 text-orange-700 ring-1 ring-orange-600' 
                                        : 'border-gray-200 text-gray-600 hover:border-orange-300'
                                    }`}
                                >
                                    {v.finish}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Size Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Size</label>
                    <div className="flex flex-wrap gap-3">
                        {availableSizes.map(size => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`px-4 py-2 rounded-md text-sm font-medium border transition-all ${
                                    selectedSize === size 
                                    ? 'border-orange-600 bg-orange-50 text-orange-700 ring-1 ring-orange-600' 
                                    : 'border-gray-200 text-gray-600 hover:border-orange-300'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                    {availableSizes.length === 0 && (
                        <p className="text-sm text-gray-400 italic">No sizes available for this finish.</p>
                    )}
                </div>
             </div>

             {/* Action Button */}
             <div className="pt-6 border-t border-gray-100">
                <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || !selectedSize}
                    className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                        isOutOfStock 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : added 
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-900 text-white hover:bg-gray-800 active:transform active:scale-[0.99]'
                    }`}
                >
                    {added ? (
                        <>
                            <Check size={24} /> Added to Inquiry List
                        </>
                    ) : isOutOfStock ? (
                        <>
                           <AlertCircle size={24} /> Unavailable
                        </>
                    ) : (
                        <>
                           <ShoppingBag size={24} /> Add to Inquiry List
                        </>
                    )}
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">
                    Add items to your list and request a quote via WhatsApp.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};