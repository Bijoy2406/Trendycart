import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { useNavigate } from 'react-router-dom';
import './Listproduct.css';
import edit_icon from '../../components/Assets/edit_icon.png';
import back_icon from '../../components/Assets/back.png';

const Listproduct = () => {
  const [allproducts, setAllProducts] = useState([]);
  const { removeProduct } = useContext(ShopContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch('http://localhost:4001/allproducts');
        const data = await res.json();
        setAllProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchInfo();
  }, []);

  const remove_product = async (id) => {
    const response = await fetch('http://localhost:4001/remove', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id })
    });

    if (response.ok) {
      setAllProducts(currentProducts => currentProducts.filter(product => product.id !== id));
    } else {
      alert('Failed to delete the product.');
    }
  };

  const edit_product = (product) => {
    navigate('/addproduct', { state: { product } });
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

                <img onClick={() => edit_product(product)} className='listproduct-edit-icon' src={edit_icon} alt="Edit" />
              </div>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Listproduct;
