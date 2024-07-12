import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { useNavigate } from 'react-router-dom';
import './Listproduct.css';
import cross_icon from '../../components/Assets/cross_icon.png';
import edit_icon from '../../components/Assets/edit_icon.png';

const Listproduct = () => {
  const [allproducts, setAllProducts] = useState([]);
  const { removeProduct } = useContext(ShopContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInfo = async () => {
      const response = await fetch('https://backend-beryl-nu-15.vercel.app/allproducts');
      const data = await response.json();
      setAllProducts(data);
    };

    fetchInfo();
  }, []);

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
      setAllProducts(currentProducts => currentProducts.filter(product => product.id !== id));
    } else {
      alert('Failed to delete the product.');
    }
  };

  const edit_product = (product) => {
    navigate('/addproduct', { state: { product } });
  };

  const goBack = () => {
    navigate('/admin');
  };

  return (
    <div className='listproduct'>
      <button onClick={goBack} className='addproduct-back-btn'>Back</button>
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
                <img onClick={() => remove_product(product.id)} className='listproduct-remove-icon' src={cross_icon} alt="Remove" />
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
