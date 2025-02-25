import React from 'react';
import Features from '../components/Features';
import AppDownload from '../components/AppDownload';
import Testimonials from '../components/Testimonials';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

function Home() {
  return (
    <div className="home">
      <Navbar />
      <Hero />
      <Features />
      <AppDownload />
      <Testimonials />
      <Footer />
      
    </div>
  );
}

export default Home;
