import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Addproduct.css';
import upload_area from '../../components/Assets/upload_area.svg';
import { ShopContext } from '../Context/ShopContext';
import back_icon from '../../components/Assets/back.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../Loader'; 
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Addproduct = () => {
    const { setAll_Product, all_product } = useContext(ShopContext);
    const [image, setImage] = useState(false);
    const [loading, setLoading] = useState(false); 
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [dragging, setDragging] = useState(false); 

    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "",
        new_price: "",
        old_price: "",
        description: "" 
    });
    const navigate = useNavigate();

    const handleSizeChange = (size) => {
        if (selectedSizes.includes(size)) {
            setSelectedSizes(selectedSizes.filter(s => s !== size));
        } else {
            setSelectedSizes([...selectedSizes, size]);
        }
    };

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    const imageHandler = (e) => {
        const file = e.target.files[0];
        if (file && !file.type.startsWith('image/')) {
            toast.error('Only image files are allowed!');
            return;
        }
        setImage(file);
        setProductDetails({ ...productDetails, image: file });
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && !file.type.startsWith('image/')) {
            toast.error('Only image files are allowed!');
            return;
        }
        setImage(file);
        setProductDetails({ ...productDetails, image: file });
    };

    const Add_product = async () => {
        const { name, category, new_price, old_price, image, description } = productDetails;

        if (!name || !category || !new_price || !old_price || !image || !description || selectedSizes.length === 0) {
            const missingFields = [];

            if (!name) missingFields.push("Product Title");
            if (!category) missingFields.push("Product Category");
            if (!new_price) missingFields.push("Offer Price");
            if (!old_price) missingFields.push("Price");
            if (!image) missingFields.push("Product Image");
            if (selectedSizes.length === 0) missingFields.push("Product Sizes"); 

            toast.error(`Please fill out the following fields: ${missingFields.join(', ')}`);
            return;
        }

        setLoading(true); 
        let responseData;
        let product = {
            ...productDetails,
            sizes: selectedSizes,
            description: description 
        };
        let formData = new FormData();
        formData.append('product', image);

        try {
            const uploadResponse = await fetch('http://localhost:4001/upload', {
                method: 'POST',
                headers: {
                    Accept: 'application/json'
                },
                body: formData,
            });
            responseData = await uploadResponse.json();

            if (responseData.success) {
                product.image = responseData.image_url;

                const addProductResponse = await fetch('http://localhost:4001/addproduct', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify(product),
                });
                const addProductData = await addProductResponse.json();

                setLoading(false); 

                if (addProductData.success) {
                    toast.success("Product Added");
                    setAll_Product([...all_product, product]); 
                    setTimeout(() => {
                        navigate('/admin');
                        window.location.reload();
                    }, 1000);
                } else {
                    toast.error("Failed to add product");
                }
            } else {
                setLoading(false); 
                toast.error("Failed to upload image");
            }
        } catch (error) {
            setLoading(false); 
            toast.error("An error occurred. Please try again.");
        }
    };

    const goBack = () => {
        navigate(-1);
    };
    const removeImage = (e) => {
        e.stopPropagation(); 
        setImage(false);
        setProductDetails({ ...productDetails, image: '' });
    };
    
    return (
        <div className='addproduct'>
            <button onClick={goBack} className='addproduct-back-btn'>
                <img src={back_icon} alt="Back" />
            </button>
            {loading && <Loader />} 
            <div className="addproduct-itemfields">
                <h1>Product Title</h1>
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
                    <h1>Price</h1>
                    <input
                        value={productDetails.old_price}
                        onChange={changeHandler}
                        type="text"
                        name="old_price"
                        placeholder='Type here'
                    />
                </div>
                <div className="addproduct-itemfields">
                    <h1>Offer Price</h1>
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
                <h1>Product Category</h1>
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
            <div className="addproduct-itemfields">
                <h1>Product Description</h1>
                <ReactQuill
                    value={productDetails.description}
                    onChange={(content, delta, source, editor) => {
                        setProductDetails({ ...productDetails, description: editor.getHTML() });
                    }}
                    placeholder="Enter product description"
                    modules={{
                        toolbar: [
                            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                            [{size: []}],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{'list': 'ordered'}, {'list': 'bullet'}],
                        ],
                    }}
                    formats={[
                        'header', 'font', 'size', 
                        'bold', 'italic', 'underline', 'strike', 'blockquote',
                        'list', 'bullet',
                    ]}
                />

            </div>
            <div className="addproduct-itemfields">
                <h1>Product Sizes</h1>
                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <label key={size} className="size-checkbox">
                        <input
                            type="checkbox"
                            value={size}
                            checked={selectedSizes.includes(size)}
                            onChange={() => handleSizeChange(size)}
                        />
                        <span>{size}</span>
                    </label>
                ))}
            </div>
            <div 
                className={`addproduct-itemfields ${dragging ? 'dragging' : ''}`}
                onClick={() => document.getElementById('file-input').click()}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <label>
                    {image ? ( 
                        <>
                            <img
                                src={URL.createObjectURL(image)}
                                className='addproduct-thumbnail-image'
                                alt=""
                            />
                            <button className="remove-image" onClick={removeImage}> 
                                &times; 
                            </button>
                        </>
                    ) : ( 
                        <div className="upload-instructions">
                            <img src={upload_area} alt="Upload Area" />
                            <p>Click here or drag & drop to upload</p>
                        </div>
                    )}
                </label>
                <input
                    onChange={imageHandler}
                    type="file"
                    name='image'
                    id='file-input'
                    style={{ display: 'none' }}
                />
            </div>
            <button onClick={Add_product} className='addproduct-btn' disabled={!productDetails.name || !productDetails.category || !productDetails.new_price || !productDetails.old_price || !productDetails.image || !productDetails.description}>
                ADD
            </button>
            <ToastContainer />
        </div>
    );
};

export default Addproduct;
