import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Addproduct.css';
import upload_area from '../../components/Assets/upload_area.svg';
import { ShopContext } from '../Context/ShopContext';
import back_icon from '../../components/Assets/back.png';

const Addproduct = () => {
    const { setAll_Product, all_product } = useContext(ShopContext);
    const [image, setImage] = useState(false);
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "",
        new_price: "",
        old_price: ""
    });
    const navigate = useNavigate();

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    const imageHandler = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setProductDetails({ ...productDetails, image: file });
    };

    const Add_product = async () => {
        let responseData;
        let product = { ...productDetails };
        let formData = new FormData();
        formData.append('product', image);

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

        if (responseData.success) {
            product.image = responseData.image_url;

            await fetch('https://backend-beryl-nu-15.vercel.app/addproduct', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(product),
            }).then((resp) => resp.json()).then((data) => {
                if (data.success) {
                    alert("Product Added");
                    setAll_Product([...all_product, product]); // Update context
                    navigate('/admin');
                } else {
                    alert("Failed to add product");
                }
            });
        }
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
            <button onClick={Add_product} className='addproduct-btn'>ADD</button>
        </div>
    );
};

export default Addproduct;
