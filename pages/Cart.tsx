import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Trash2, Plus, Minus, Send, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useShop();
  const [customerName, setCustomerName] = useState("");
  const [error, setError] = useState("");

  const handleSendToWhatsApp = () => {
    if (!customerName.trim()) {
      setError("Please enter your name to proceed.");
      return;
    }
    setError("");

    // Construct Message
    let message = `*Order Inquiry from ${customerName}*\n\n`;
    message += `I am interested in buying the following hardware items:\n\n`;
    
    cart.forEach((item, index) => {
      const finishText = item.selectedFinish ? ` - ${item.selectedFinish}` : '';
      message += `${index + 1}. *${item.name}* (${item.selectedSize}${finishText})\n`;
      message += `   Quantity: ${item.quantity}\n`;
    });
    
    message += `\nPlease provide a price quotation and availability details.`;

    const encodedMessage = encodeURIComponent(message);
    // WhatsApp URL
    const url = `https://wa.me/918431123556?text=${encodedMessage}`;
    
    window.open(url, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-[#FDF5E6]">
        <div className="w-24 h-24 bg-[#FAEBD7] rounded-full flex items-center justify-center mb-6">
          <MessageCircle className="h-12 w-12 text-orange-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your List is Empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">Looks like you haven't added any hardware items to your inquiry list yet.</p>
        <Link to="/shop" className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF5E6] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          Your Inquiry List <span className="text-lg font-normal text-gray-500">({cart.length} items)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={`${item.id}-${item.selectedSize}-${item.selectedFinish}`} className="bg-white p-4 rounded-lg shadow-sm border border-orange-100 flex gap-4">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md bg-gray-100" />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">No Image</div>
                )}
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <div className="text-sm text-gray-500 space-y-1">
                        <p>{item.category}</p>
                        <p>Size: {item.selectedSize}</p>
                        {item.selectedFinish && <p>Finish: {item.selectedFinish}</p>}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button 
                    onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedFinish)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                  
                  <div className="flex items-center gap-3 bg-[#FDF5E6] rounded-md p-1">
                    <button 
                      onClick={() => updateCartQuantity(item.id, item.selectedSize, item.selectedFinish, -1)}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:bg-gray-100"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-medium w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQuantity(item.id, item.selectedSize, item.selectedFinish, 1)}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:bg-gray-100"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <button 
              onClick={clearCart}
              className="text-red-600 text-sm font-medium hover:underline mt-4"
            >
              Clear List
            </button>
          </div>

          {/* Checkout / User Info */}
          <div className="lg:col-span-1">
            <div className="bg-[#FAEBD7] p-6 rounded-lg shadow-md border border-orange-100 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Inquiry Summary</h3>
              
              <div className="space-y-3 mb-6 border-b border-orange-200 pb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Total Items</span>
                  <span>{cart.reduce((a, b) => a + b.quantity, 0)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  *Prices will be provided via WhatsApp based on quantity.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-[#FFDAB9] placeholder-gray-600 text-gray-900"
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>

              <button
                onClick={handleSendToWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Send size={18} /> Request Price Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};