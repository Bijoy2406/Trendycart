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
    
    // Append the image file
    if (image) {
        formData.append('product', image);
    }

    // Upload image if there's a new one
    if (image) {
        await fetch('https://backend-beryl-nu-15.vercel.app/upload', {
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

        product.image = responseData.image_url; // Store the MongoDB image URL
    }

    // Add or update product logic
    const apiUrl = product.id ? 'https://backend-beryl-nu-15.vercel.app/updateproduct' : 'https://backend-beryl-nu-15.vercel.app/addproduct';

    await fetch(apiUrl, {
        method: product.id ? 'PUT' : 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
    }).then((resp) => resp.json()).then((data) => {
        if (data.success) {
            if (product.id) {
                updateProduct(product);
                alert("Product updated successfully");
            } else {
                addProduct(product);
                alert("Product added successfully");
            }
            navigate('/admin');
        } else {
            alert("Failed to save product");
        }
    });
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
