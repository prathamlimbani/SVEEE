import React from 'react';
import { Phone, MapPin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Sri Vijayalaxmi Enterprise</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted partner for quality wholesale hardware essentials. We provide top-grade materials for all your construction and furniture needs.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-500">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#/shop" className="hover:text-white">Shop Catalog</a></li>
              <li><a href="#/cart" className="hover:text-white">Request Quote</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-500">Contact Us</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center gap-3">
                 <Phone size={18} className="text-orange-500 flex-shrink-0" />
                 <span>+91 8431123556</span>
              </div>
              <div className="flex items-center gap-3">
                 <Mail size={18} className="text-orange-500 flex-shrink-0" />
                 <span>svehsd2020@gmail.com</span>
              </div>
              <div className="flex items-start gap-3">
                 <MapPin size={18} className="text-orange-500 mt-1 flex-shrink-0" />
                 <span className="leading-tight">Sri Vijayalaxmi Enterprise, opposite Indian Oil Pump, Huliyar road, Hosadurga, Chitradurga DIST, Karnataka-577527</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs text-gray-500">
          <p>© 2025 Sri Vijayalaxmi Enterprise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};