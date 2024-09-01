import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { useNavigate } from 'react-router-dom';
import './Listproduct.css';
import edit_icon from '../../components/Assets/edit_icon.png';
import back_icon from '../../components/Assets/back.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Listproduct = () => {
  const [allproducts, setAllProducts] = useState([]);
  const { setAll_Product } = useContext(ShopContext); // Get removeProductFromCart from context
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch('https://backend-beryl-nu-15.vercel.app/allproducts');
        const data = await res.json();
        setAllProducts(data);
        setAll_Product(data); // Keep the context in sync
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchInfo();
  }, [setAll_Product]); // Include setAll_Product as a dependency

  const remove_product = async (id) => {
    const response = await fetch('https://backend-beryl-nu-15.vercel.app/remove', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id })
    });

    if (response.ok) {
      const updatedProducts = allproducts.filter(product => product.id !== id);
      setAllProducts(updatedProducts);
      setAll_Product(updatedProducts); // Update context to reflect the changes
    } else {
      toast.error('Failed to delete the product.');
    }
  };

  const edit_product = (id) => {
    navigate(`/editproduct/${id}`);
  };
  

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className='listproduct'>
      <button onClick={goBack} className='addproduct-back-btn'>
        <img src={back_icon} alt="Back" />
      </button>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old price</p>
        <p>New price</p>
        <p>Category</p>
        <p>Edit</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product, index) => (
          <div key={index}>
            <div className="listproduct-format-main listproduct-format">
              <img src={product.image} alt="" className="listproduct-product-icon" />
              <p>{product.name}</p>
              <p>৳{product.old_price}</p>
              <p>৳{product.new_price}</p>
              <p>{product.category}</p>
              <div className="icon-container">
                <div className="delete">
                  <button className="button-delete" onClick={() => remove_product(product.id)}>
                    <span className="text">Delete</span>
                    <span className="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
                      </svg>
                    </span>
                  </button>
                </div>

                <button onClick={() => edit_product(product.id)} className='button-edit'>
                  <img className='listproduct-edit-icon' src={edit_icon} alt="Edit" />
                </button>
              </div>
            </div>
            <hr />
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Listproduct;
