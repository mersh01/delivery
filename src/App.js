import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Help from './pages/Help';
import List from './pages/List';
import Menu from './pages/Menu';
import Shopmenu from './pages/Shopmenu';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Placedorder from './pages/Placedorder';
import Navbars from './components/Navbars';
import { UserProvider } from './components/Usercontext'; // Import UserProvider
import PaymentPage from './pages/Paymentpage';
import 'slick-carousel/slick/slick.css'; // Import slick-carousel styles
import 'slick-carousel/slick/slick-theme.css';
import Registration from './pages/Registration';

function App() {
  return (
    <UserProvider>
      
        <Router basename="/delivery"> {/* Add basename */}
          <Navbars />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />
            <Route path="/list" element={<List />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/menu/:id" element={<Menu />} />
            <Route path="/shopmenu/:id" element={<Shopmenu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/placedorder" element={<Placedorder />} />
            <Route path="/paymentpage" element={<PaymentPage />} />
          </Routes>
        </Router>
    </UserProvider>
  );
}

export default App;