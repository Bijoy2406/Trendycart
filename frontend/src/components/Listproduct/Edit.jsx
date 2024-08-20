import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../Addproduct/Addproduct.css'; // Reuse the same CSS file
import upload_area from '../../components/Assets/upload_area.svg';
import back_icon from '../../components/Assets/back.png';
import { ShopContext } from '../Context/ShopContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProduct = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: '',
    image: '',
    category: '',
    new_price: '',
    old_price: ''
  });
  const navigate = useNavigate();
  const { setAll_Product } = useContext(ShopContext); // Get setAll_Product from context

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:4001/product/${id}`);
        const data = await res.json();
        setProductDetails(data);
      } catch (error) {
        console.error('Failed to fetch product details:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const imageHandler = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setProductDetails({ ...productDetails, image: file });
  };

  const updateProduct = async () => {
    let responseData;
    let product = { ...productDetails };
    let formData = new FormData();
    
    if (image) {
      formData.append('product', image);
      await fetch('http://localhost:4001/upload', {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        body: formData,
      }).then((resp) => resp.json())
        .then((data) => {
          responseData = data;
        });

      if (responseData.success) {
        product.image = responseData.image_url;
      }
    }

    await fetch(`http://localhost:4001/updateproduct/${id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product),
    }).then((resp) => resp.json()).then((data) => {
      if (data.success) {
        toast.success('Product Updated');
        // Update the product list in the context
        fetch('http://localhost:4001/allproducts')
          .then((response) => response.json())
          .then((data) => {
            setAll_Product(data); // Update context
          })
          .catch((error) => console.error('Failed to update product list:', error));
        navigate('/admin');
      } else {
        toast.error('Failed to update product');
      }
    });
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className='addproduct'>
      <button onClick={goBack} className='addproduct-back-btn'>
        <img src={back_icon} alt="Back" />
      </button>
      <div className="addproduct-itemfields">
        <p>Product Title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name='name'
          placeholder='Type here'
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfields">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder='Type here'
          />
        </div>
        <div className="addproduct-itemfields">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder='Type here'
          />
        </div>
      </div>
      <div className="addproduct-itemfields">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className='add-product-selector'
        >
          <option value="">Select category</option>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="addproduct-itemfields" onClick={() => document.getElementById('file-input').click()}>
        <label>
          <img
            src={image ? URL.createObjectURL(image) : productDetails.image || upload_area}
            className='addproduct-thumbnail-image'
            alt=""
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name='image'
          id='file-input'
          style={{ display: 'none' }}
        />
      </div>
      <button onClick={updateProduct} className='addproduct-btn'>UPDATE</button>
      <ToastContainer />
    </div>
  );
};

export default EditProduct;
