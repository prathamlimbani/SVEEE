import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES, Product, ProductVariant } from '../types';
import { Trash2, Edit2, Check, X, Plus, LogOut, Package, Upload, MinusCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Admin: React.FC = () => {
  const { 
    isAdminLoggedIn, 
    loginAdmin, 
    logoutAdmin, 
    products, 
    addProduct, 
    deleteProduct, 
    updateProduct
  } = useShop();
  
  const navigate = useNavigate();
  
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Form State
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  // Custom Category State
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  // Variant State
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [currentFinish, setCurrentFinish] = useState('');
  const [currentSizes, setCurrentSizes] = useState(''); // Comma separated

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'General Hardware',
    description: '',
    image: '',
    images: [],
    stock: 100,
    isAvailable: true,
    isNewArrival: false
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin') {
      const success = loginAdmin(password);
      if (success) {
        setLoginError('');
      } else {
        setLoginError('Invalid password');
      }
    } else {
      setLoginError('Invalid admin ID');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'General Hardware',
      description: '',
      image: '',
      images: [],
      stock: 100,
      isAvailable: true,
      isNewArrival: false
    });
    setVariants([]);
    setCurrentFinish('');
    setCurrentSizes('');
    setCustomCategory('');
    setIsCustomCategory(false);
    setIsEditing(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const promises = filesArray.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file as Blob);
        });
      });

      Promise.all(promises).then(imagesBase64 => {
        setFormData(prev => {
          // If editing or adding, append to existing images, or initialize array
          const currentImages = prev.images && prev.images.length > 0 ? prev.images : (prev.image ? [prev.image] : []);
          const newImages = [...currentImages, ...imagesBase64];
          return { 
            ...prev, 
            images: newImages,
            // Ensure main image is always the first one
            image: newImages.length > 0 ? newImages[0] : ''
          };
        });
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => {
      const currentImages = prev.images || [];
      const newImages = currentImages.filter((_, i) => i !== index);
      return {
        ...prev,
        images: newImages,
        image: newImages.length > 0 ? newImages[0] : ''
      };
    });
  };

  const addVariant = () => {
    if (!currentSizes.trim()) {
        alert("Please enter sizes.");
        return;
    }
    const finishName = currentFinish.trim() || 'Standard';
    const parsedSizes = currentSizes.split(',').map(s => s.trim()).filter(s => s.length > 0);
    
    setVariants(prev => [...prev, { finish: finishName, sizes: parsedSizes }]);
    setCurrentFinish('');
    setCurrentSizes('');
  };

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalCategory = isCustomCategory ? customCategory : formData.category || 'General Hardware';

    let finalVariants = [...variants];
    if (finalVariants.length === 0 && currentSizes.trim()) {
         const finishName = currentFinish.trim() || 'Standard';
         const parsedSizes = currentSizes.split(',').map(s => s.trim()).filter(s => s.length > 0);
         finalVariants.push({ finish: finishName, sizes: parsedSizes });
    }

    const allSizes = Array.from(new Set(finalVariants.flatMap(v => v.sizes)));
    const mainImage = formData.image || (formData.images && formData.images.length > 0 ? formData.images[0] : '');
    const allImages = formData.images && formData.images.length > 0 ? formData.images : (mainImage ? [mainImage] : []);

    const productData = {
      ...formData,
      image: mainImage,
      images: allImages,
      category: finalCategory,
      variants: finalVariants,
      sizes: allSizes.length > 0 ? allSizes : ['Standard'],
      stock: 100
    };

    if (isEditing) {
      updateProduct(isEditing, productData);
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: productData.name || 'New Item',
        category: productData.category || 'General',
        description: productData.description || '',
        image: mainImage,
        images: allImages,
        variants: finalVariants,
        sizes: allSizes.length > 0 ? allSizes : ['Standard'],
        stock: 100,
        isAvailable: productData.isAvailable ?? true,
        isNewArrival: productData.isNewArrival ?? false
      };
      addProduct(newProduct);
    }
    resetForm();
  };

  const handleEditClick = (product: Product) => {
    setIsEditing(product.id);
    
    const imagesList = product.images && product.images.length > 0 
      ? product.images 
      : (product.image ? [product.image] : []);

    setFormData({
      ...product,
      images: imagesList,
      image: imagesList[0] || ''
    });
    
    if (CATEGORIES.includes(product.category)) {
        setIsCustomCategory(false);
    } else {
        setIsCustomCategory(true);
        setCustomCategory(product.category);
    }

    if (product.variants && product.variants.length > 0) {
        setVariants(product.variants);
    } else {
        setVariants([{ finish: 'Standard', sizes: product.sizes }]);
    }
    
    setCurrentFinish('');
    setCurrentSizes('');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteProduct(id);
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        {/* Login Form */}
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Owner Login</h2>
            <p className="text-gray-500">Sri Vijayalaxmi Enterprise</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Admin ID</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              Access Dashboard
            </button>
          </form>
          <div className="mt-4 text-center">
             <button onClick={() => navigate('/')} className="text-sm text-gray-500 hover:underline">Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package /> Inventory Dashboard
          </h1>
          <button 
            onClick={() => { logoutAdmin(); navigate('/'); }}
            className="flex items-center gap-2 text-red-600 hover:text-red-800"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Device Sync Warning */}
        <div className="lg:col-span-3 bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-2 rounded-r-md">
            <div className="flex">
                <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                    <p className="text-sm text-yellow-700 font-medium">
                        Device Synchronization Notice
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                        This application uses <strong>Local Storage</strong>. 
                        Products added or deleted on this device will <strong>NOT</strong> appear on other devices (like your mobile phone or another PC).
                    </p>
                </div>
            </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow sticky top-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              {isEditing ? <Edit2 size={18} /> : <Plus size={18} />}
              {isEditing ? 'Edit Product' : 'Add New Item'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="mt-1 block w-full bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  {!isCustomCategory ? (
                    <select 
                        value={formData.category}
                        onChange={e => {
                            if(e.target.value === 'Other') {
                                setIsCustomCategory(true);
                                setCustomCategory('');
                            } else {
                                setFormData({...formData, category: e.target.value});
                            }
                        }}
                        className="mt-1 block w-full bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    >
                        {CATEGORIES.filter(c => c !== "All").map(c => (
                        <option key={c} value={c}>{c}</option>
                        ))}
                        <option value="Other">Add New...</option>
                    </select>
                  ) : (
                    <div className="flex gap-1 mt-1">
                        <input 
                            type="text"
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            placeholder="Enter Category"
                            className="block w-full bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm py-2 px-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        />
                        <button 
                            type="button" 
                            onClick={() => setIsCustomCategory(false)}
                            className="p-2 text-gray-500 hover:text-red-500"
                        >
                            <X size={16}/>
                        </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Variants Section */}
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">Finishes & Sizes</label>
                
                {/* List added variants */}
                <ul className="space-y-2 mb-3">
                    {variants.map((v, idx) => (
                        <li key={idx} className="flex justify-between items-start text-xs bg-white p-2 rounded border border-gray-200">
                            <div>
                                <span className="font-bold text-gray-800">{v.finish || 'Standard'}</span>
                                <div className="text-gray-500">{v.sizes.join(', ')}</div>
                            </div>
                            <button type="button" onClick={() => removeVariant(idx)} className="text-red-500 hover:text-red-700">
                                <MinusCircle size={16} />
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Add new variant inputs */}
                <div className="space-y-2">
                    <input 
                        type="text" 
                        value={currentFinish}
                        onChange={e => setCurrentFinish(e.target.value)}
                        placeholder="Finish Name (e.g. Brass, Black)"
                        className="block w-full bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:ring-orange-500"
                    />
                    <input 
                        type="text" 
                        value={currentSizes}
                        onChange={e => setCurrentSizes(e.target.value)}
                        placeholder="Sizes (e.g. 1 inch, 2 inch)"
                        className="block w-full bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:ring-orange-500"
                    />
                    <button 
                        type="button" 
                        onClick={addVariant}
                        className="w-full py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300 font-medium"
                    >
                        Add Finish Variation
                    </button>
                </div>
              </div>

              {/* Images Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Images</label>
                <div className="mt-1 flex items-center">
                  <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-50 hover:text-orange-600">
                    <Upload size={24} />
                    <span className="mt-2 text-base leading-normal">Select files</span>
                    {/* Allow multiple files */}
                    <input type='file' accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                  </label>
                </div>
                {/* Image Previews */}
                {formData.images && formData.images.length > 0 && (
                   <div className="mt-4 grid grid-cols-3 gap-2">
                      {formData.images.map((img, idx) => (
                          <div key={idx} className="relative h-20 w-full rounded border border-gray-200 overflow-hidden group">
                              <img src={img} alt={`Preview ${idx}`} className="h-full w-full object-cover" />
                              <button 
                                type="button" 
                                onClick={() => removeImage(idx)}
                                className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                  <X size={12} />
                              </button>
                              {idx === 0 && (
                                <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center">Main</span>
                              )}
                          </div>
                      ))}
                   </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="mt-1 block w-full bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center">
                  <input 
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={e => setFormData({...formData, isAvailable: e.target.checked})}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Available</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={e => setFormData({...formData, isNewArrival: e.target.checked})}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">New Arrival</span>
                </label>
              </div>

              <div className="flex gap-2">
                <button 
                  type="submit" 
                  className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 font-medium"
                >
                  {isEditing ? 'Update Item' : 'Add Item'}
                </button>
                {isEditing && (
                  <button 
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Product List ({products.length})</h2>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
             <ul className="divide-y divide-gray-200">
               {products.map(product => (
                 <li key={product.id} className="p-4 flex flex-col sm:flex-row items-center gap-4 hover:bg-gray-50 transition">
                    {product.image ? (
                       <img src={product.image} alt={product.name} className="h-16 w-16 object-cover rounded" />
                    ) : (
                       <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">No Img</div>
                    )}
                    
                    <div className="flex-1 text-center sm:text-left">
                       <h3 className="text-sm font-bold text-gray-900">{product.name}</h3>
                       <p className="text-xs text-gray-500">{product.category}</p>
                       <p className="text-xs text-gray-500 mt-1">
                          Finishes: {product.variants && product.variants.length > 0 
                             ? product.variants.map(v => v.finish).join(', ') 
                             : 'Standard'}
                       </p>
                    </div>
                    <div className="flex items-center gap-2">
                       {product.isAvailable ? 
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center gap-1"><Check size={10}/> Active</span> : 
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full flex items-center gap-1"><X size={10}/> Hidden</span>
                       }
                    </div>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => handleEditClick(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => handleDelete(e, product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                 </li>
               ))}
               {products.length === 0 && (
                 <li className="p-8 text-center text-gray-500">No products added yet.</li>
               )}
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};