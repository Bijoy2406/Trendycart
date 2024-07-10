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
      await fetch('http://localhost:4001/allproducts')
        .then((res) => res.json())
        .then((data) => { setAllProducts(data) });
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
      body: JSON.stringify({ id: id })
    });

    if (response.ok) {
      // Update the local state to remove the product
      setAllProducts(currentProducts => currentProducts.filter(product => product.id !== id));
    } else {
      alert('Failed to delete the product.');
    }
  };

  const edit_product = (product) => {
    navigate('/addproduct', { state: { product } });
  };

  const goBack = () => {
    navigate('/admin'); // Navigate back to the Admin component
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
        {allproducts.map((product, index) => {
          return (
            <div key={index}>
              <div className="listproduct-format-main listproduct-format">
                <img src={product.image} alt="" className="listproduct-product-icon" />
                <p>{product.name}</p>
                <p>৳{product.old_price}</p>
                <p>৳{product.new_price}</p>
                <p>{product.category}</p>
                <div className="icon-container">
                  <img onClick={() => { remove_product(product.id) }} className='listproduct-remove-icon' src={cross_icon} alt="Remove" />
                  <img onClick={() => { edit_product(product) }} className='listproduct-edit-icon' src={edit_icon} alt="Edit" />
                </div>
              </div>
              <hr />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Listproduct;
