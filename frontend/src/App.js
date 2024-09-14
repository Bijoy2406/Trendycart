import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import Admin from './pages/Admin/Admin';
import Addproduct from './components/Addproduct/Addproduct';
import Listproduct from './components/Listproduct/Listproduct';
import Shop from './pages/Shop';
import ShopCategory from './pages/ShopCategory';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/login';
import Footer from './components/Footer/Footer';
import men_banner from './components/Assets/banner_mens.png';
import women_banner from './components/Assets/banner_women.png';
import kids_banner from './components/Assets/banner_kids.png';
import ShopContextProvider from './components/Context/ShopContext';
import SearchResults from './pages/search';
import Profile from './components/Profile/profile';
import Loader from './Loader';
import Userlist from './pages/Userlist'; // Import the Userlist component
import Productdisplay from './components/Productdisplay/Productdisplay';
import Payment from './components/Payment/Payment';
import PaymentCart from './components/CartItems/PaymentCart';
import listproduct from './components/Listproduct/Listproduct';
import EditProduct from './components/Listproduct/Edit';
import Orders from './components/Order/Order';
import Chart from './pages/Chart';
import VerifyEmail from './pages/VerifyEmail';
function App() {
  return (
    <ShopContextProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path='/login/*' element={<Login />} />
          <Route path='/addproduct' element={<Addproduct />} />
          <Route path='/listproduct' element={<Listproduct />} />
          <Route path='*' element={<WithNavbar />} />
        </Routes>
      </BrowserRouter>
    </ShopContextProvider>
  );
}

function WithNavbar() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000); // Adjust delay as needed
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <Navbar />
      {loading ? (
        <Loader />
      ) : (
        <Routes>
          <Route index element={<Shop />} />
          <Route path='mens' element={<ShopCategory banner={men_banner} category='men' />} />
          <Route path='womens' element={<ShopCategory banner={women_banner} category='women' />} />
          <Route path='kids' element={<ShopCategory banner={kids_banner} category='kid' />} />
          <Route path='product/:productId' element={<Product />} />
          <Route path='cart' element={<Cart />} />
          <Route path='search/:searchTerm' element={<SearchResults />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/Userlist' element={<Userlist />} /> {/* Add the Userlist route */}
          <Route path='/chart' element={<Chart />} /> {/* Add the Userlist route */}
          <Route path="/product/:id" element={<Productdisplay />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/cart/payment" element={<PaymentCart />} />
          <Route path="/listproducts" element={<Listproduct />} />
          <Route path="/editproduct/:id" element={<EditProduct />} />
          <Route path="/order" element={<Orders />} />

        </Routes>
      )}
      <Footer />
    </div>
  );
}

export default App;