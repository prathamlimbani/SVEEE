import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Navbar: React.FC = () => {
  const { cart, isAdminLoggedIn } = useShop();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path ? 'text-orange-600 font-bold' : 'text-gray-600 hover:text-orange-600';

  return (
    <nav className="bg-[#FAEBD7] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              {/* Logo Area - Assuming logo.png is in public folder or user replaces src */}
              <div className="flex items-center gap-3">
                 <img 
                   src="/logo.png" 
                   alt="SVE Logo" 
                   className="h-14 w-auto object-contain"
                   onError={(e) => {
                     e.currentTarget.style.display = 'none';
                     const fallback = document.getElementById('logo-fallback');
                     if(fallback) fallback.style.display = 'flex';
                   }} 
                 />
                 <div id="logo-fallback" className="hidden flex-col">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-8 w-8 text-orange-600" />
                      <h1 className="text-xl font-bold text-gray-900 leading-tight">Sri Vijayalaxmi</h1>
                    </div>
                    <p className="text-xs text-gray-500 font-medium tracking-wider pl-10">ENTERPRISE</p>
                 </div>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/shop" className={isActive('/shop')}>Shop Products</Link>
            {isAdminLoggedIn && (
              <Link to="/admin" className="text-purple-600 font-bold">Admin Panel</Link>
            )}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Link to="/cart" className="relative p-2 mr-4 text-gray-600">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-[#FDF5E6] focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#FAEBD7] border-t border-orange-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link onClick={() => setIsMenuOpen(false)} to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-[#FDF5E6]">Home</Link>
            <Link onClick={() => setIsMenuOpen(false)} to="/shop" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-[#FDF5E6]">Shop Products</Link>
            {isAdminLoggedIn && (
               <Link onClick={() => setIsMenuOpen(false)} to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-purple-600 hover:bg-purple-50">Admin Panel</Link>
            )}
            <Link onClick={() => setIsMenuOpen(false)} to="/cart" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-[#FDF5E6]">Cart ({totalItems})</Link>
          </div>
        </div>
      )}
    </nav>
  );
};