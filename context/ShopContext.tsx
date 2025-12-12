import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem } from '../types';

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  isAdminLoggedIn: boolean;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addToCart: (product: Product, size: string, finish: string) => void;
  removeFromCart: (id: string, size: string, finish: string) => void;
  updateCartQuantity: (id: string, size: string, finish: string, delta: number) => void;
  clearCart: () => void;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Steel Nails (Assorted)',
    category: 'Nails',
    description: 'High quality steel nails, mixed sizes box (1kg).',
    image: 'https://picsum.photos/seed/nails1/400/400',
    variants: [],
    sizes: ['1kg Box'],
    stock: 50,
    isAvailable: true,
    isNewArrival: false
  },
  {
    id: '2',
    name: 'Modern Kitchen Handle',
    category: 'Kitchen Handles',
    description: 'Chrome finish sleek handle for cabinets.',
    image: 'https://picsum.photos/seed/handle1/400/400',
    variants: [
        { finish: 'Chrome', sizes: ['4 inch', '6 inch'] },
        { finish: 'Matte Black', sizes: ['4 inch', '6 inch', '8 inch'] }
    ],
    sizes: ['4 inch', '6 inch', '8 inch'],
    stock: 100,
    isAvailable: true,
    isNewArrival: true
  },
  {
    id: '3',
    name: 'Heavy Duty Door Hinge',
    category: 'Hinges',
    description: 'Stainless steel soft-close hinge.',
    image: 'https://picsum.photos/seed/hinge1/400/400',
    variants: [],
    sizes: ['Standard', 'Large'],
    stock: 200,
    isAvailable: true,
    isNewArrival: false
  },
  {
    id: '4',
    name: 'Main Door Lock Set',
    category: 'Locks',
    description: 'Secure locking mechanism with 3 keys.',
    image: 'https://picsum.photos/seed/lock1/400/400',
    variants: [],
    sizes: ['Universal'],
    stock: 15,
    isAvailable: true,
    isNewArrival: true
  },
  {
    id: '5',
    name: 'Industrial Wood Gum',
    category: 'Adhesives/Gum',
    description: 'Strong adhesive for furniture making.',
    image: 'https://picsum.photos/seed/gum1/400/400',
    variants: [],
    sizes: ['250ml', '500ml', '1L', '5L'],
    stock: 40,
    isAvailable: true,
    isNewArrival: false
  },
  {
    id: '6',
    name: 'Tandem Box Drawer System',
    category: 'Tandem Boxes',
    description: 'Soft close drawer system, grey finish.',
    image: 'https://picsum.photos/seed/tandem/400/400',
    variants: [],
    sizes: ['450mm', '500mm', '550mm'],
    stock: 10,
    isAvailable: true,
    isNewArrival: true
  },
  {
    id: '7',
    name: 'Concrete Nails (Black)',
    category: 'Nails',
    description: 'Hardened steel concrete nails for masonry work.',
    image: 'https://picsum.photos/seed/concrete/400/400',
    variants: [],
    sizes: ['1 inch', '1.5 inch', '2 inch', '2.5 inch', '3 inch'],
    stock: 500,
    isAvailable: true,
    isNewArrival: true
  }
];

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load from local storage or use initial
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('sve_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('sve_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    localStorage.setItem('sve_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sve_cart', JSON.stringify(cart));
  }, [cart]);

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addToCart = (product: Product, size: string, finish: string) => {
    setCart(prev => {
      // Check for existing item with same ID, Size AND Finish
      const existing = prev.find(item => 
        item.id === product.id && 
        item.selectedSize === size && 
        item.selectedFinish === finish
      );

      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.selectedSize === size && item.selectedFinish === finish) 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, selectedSize: size, selectedFinish: finish, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string, size: string, finish: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedSize === size && item.selectedFinish === finish)));
  };

  const updateCartQuantity = (id: string, size: string, finish: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.selectedSize === size && item.selectedFinish === finish) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const loginAdmin = (password: string) => {
    if (password === 'admin@2025') {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => setIsAdminLoggedIn(false);

  return (
    <ShopContext.Provider value={{
      products,
      cart,
      isAdminLoggedIn,
      addProduct,
      updateProduct,
      deleteProduct,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      loginAdmin,
      logoutAdmin
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};