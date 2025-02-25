import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home'; // Your home page component
import Navbar from './Navbar'; // Your navbar component

function App() {
  return (
    <BrowserRouter basename="/delivery">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add other routes if needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
