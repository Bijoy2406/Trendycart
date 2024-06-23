import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import Shop from './pages/Shop';
import ShopCategory from './pages/ShopCategory';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/login'; 
import Footer from './components/Footer/Footer';

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    {/* Define a route for Login with no Navbar */}
                    <Route path='/login/*' element={<Login />} />
                    
                    {/* Define other routes with Navbar */}
                    <Route path='/' element={<WithNavbar />}>
                        <Route index element={<Shop />} />
                        <Route path='mens' element={<ShopCategory category='mens' />} />
                        <Route path='womens' element={<ShopCategory category='womens' />} />
                        <Route path='kids' element={<ShopCategory category='kids' />} />
                        <Route path='product' element={<Product />} />
                        <Route path='cart' element={<Cart />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

// Component to wrap routes that should have Navbar
function WithNavbar() {
    return (
        <div>
            <Navbar />
            <Routes>
                <Route path='/' element={<Shop />} />
                <Route path='mens' element={<ShopCategory category='mens' />} />
                <Route path='womens' element={<ShopCategory category='womens' />} />
                <Route path='kids' element={<ShopCategory category='kids' />} />
                <Route path='product' element={<Product />} />
                <Route path='cart' element={<Cart />} />
            </Routes>
            <Footer/>
        </div>
    );
}

export default App;
