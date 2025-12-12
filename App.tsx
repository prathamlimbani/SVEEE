import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Cart } from './pages/Cart';
import { Admin } from './pages/Admin';
import { ProductDetails } from './pages/ProductDetails';
import { Footer } from './components/Footer';
import { ShopProvider } from './context/ShopContext';

function App() {
  return (
    <ShopProvider>
      <div className="min-h-screen flex flex-col bg-[#FDF5E6]">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ShopProvider>
  );
}

export default App;