// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import Shop from './pages/Shop';
import ShopCategory from './pages/ShopCategory';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/login';
import Footer from './components/Footer/Footer';
import men_banner from './components/Assets/banner_mens.png';
import women_banner from './components/Assets/banner_women.png';
import kids_banner from './components/Assets/banner_kids.png';
import ShopContextProvider from './components/Context/ShopContext'; // Import ShopContextProvider

function App() {
  return (
    <div>
      <ShopContextProvider> {/* Wrap the entire app with ShopContextProvider */}
        <BrowserRouter>
          <Routes>
          <Route path='/login/*' element={<Login />} />
            <Route path='/' element={<WithNavbar />}>
              <Route index element={<Shop />} />
              <Route path='mens' element={<ShopCategory banner={men_banner} category='men' />} />
              <Route path='womens' element={<ShopCategory banner={women_banner} category='women' />} />
              <Route path='kids' element={<ShopCategory banner={kids_banner} category='kid' />} />
              <Route path='product/:productId' element={<Product />} />
              <Route path='cart' element={<Cart />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ShopContextProvider>
    </div>
  );
}

function WithNavbar() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Shop />} />
        <Route path='mens' element={<ShopCategory banner={men_banner} category='men' />} />
        <Route path='womens' element={<ShopCategory banner={women_banner} category='women' />} />
        <Route path='kids' element={<ShopCategory banner={kids_banner} category='kid' />} />
        <Route path='product/:productId' element={<Product />} />
        <Route path='cart' element={<Cart />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
