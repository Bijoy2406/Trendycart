import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Addproduct.css';
import upload_area from '../../components/Assets/upload_area.svg';
import { ShopContext } from '../Context/ShopContext';

const Addproduct = () => {
  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    id: null,
    name: "",
    image: "",
    category: "",
    new_price: "",
    old_price: ""
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { addProduct, updateProduct } = useContext(ShopContext);

  useEffect(() => {
    if (location.state && location.state.product) {
      setProductDetails(location.state.product);
    }
  }, [location.state]);

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const imageHandler = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setProductDetails({ ...productDetails, image: file });
  };

  const handleSubmit = async () => {
    let responseData;
    let product = { ...productDetails };
    let formData = new FormData();
    formData.append('product', image);

    // Upload image if there's a new one
    if (image) {
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

      if (!responseData.success) {
        alert("Failed to upload image");
        return;
      }

      product.image = responseData.image_url;
    }

    if (product.id) {
      // Update product
      await fetch('http://localhost:4001/updateproduct', {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify(product),
      }).then((resp) => resp.json()).then((data) => {
        if (data.success) {
          updateProduct(product);
          alert("Product updated successfully");
          navigate('/admin');
        } else {
          alert("Failed to update product");
        }
      });
    } else {
      // Add new product
      await fetch('http://localhost:4001/addproduct', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify(product),
      }).then((resp) => resp.json()).then((data) => {
        if (data.success) {
          addProduct(product);
          alert("Product added successfully");
          navigate('/admin');
        } else {
          alert("Failed to add product");
        }
      });
    }
  };

  const goBack = () => {
    navigate('/admin'); // Navigate back to the Admin component
  };

  return (
    <div className='addproduct'>
      <div className="addproduct-itemfields">
        <button onClick={goBack} className='addproduct-back-btn'>
          <img src={require('../../components/Assets/back.png')} alt="Back" />
        </button>

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
                        src={image ? URL.createObjectURL(image) : upload_area}
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
            <button onClick={handleSubmit} className='addproduct-btn'>SAVE</button>
        </div>
  );
};

export default Addproduct;


