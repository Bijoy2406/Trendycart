import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../Addproduct/Addproduct.css';
import upload_area from '../../components/Assets/upload_area.svg';
import back_icon from '../../components/Assets/back.png';
import { ShopContext } from '../Context/ShopContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../Loader';

const EditProduct = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const { all_product } = useContext(ShopContext);

  const [productDetails, setProductDetails] = useState({
    name: '',
    image: '',
    category: '',
    new_price: '',
    old_price: '',
    description: '',
    sizes: []
  });
  const navigate = useNavigate();
  const { setAll_Product } = useContext(ShopContext);

  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://backend-beryl-nu-15.vercel.app/product/${id}`);
        const data = await res.json();
        setProductDetails({
          name: data.name || '',
          image: data.image || '',
          category: data.category || '',
          new_price: data.new_price || '',
          old_price: data.old_price || '',
          description: data.description || '',
          sizes: data.sizes || []
        });
        setSelectedSizes(data.sizes || []);
        if (data.image) {
          setImage(data.image);
        }
      } catch (error) {
        console.error('Failed to fetch product details:', error);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);
  useEffect(() => {
    if (id && all_product.length > 0) {
      const product = all_product.find(p => p.id === parseInt(id));
      if (product) {
        setProductDetails({
          name: product.name,
          image: product.image,
          category: product.category,
          new_price: product.new_price,
          old_price: product.old_price,
          description: product.description,
          sizes: product.sizes || []
        });
        setSelectedSizes(product.sizes || []);
        setImage(product.image);
      }
    }
  }, [id, all_product]);




  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const imageHandler = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setProductDetails({ ...productDetails, image: file });
  };

  const handleSizeChange = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const updateProduct = async () => {
    setLoading(true);
    let responseData;
    let product = { ...productDetails, sizes: selectedSizes };
    let formData = new FormData();

    if (image && image !== productDetails.image) {
      let formData = new FormData();
      formData.append('product', image);
      try {
        const uploadRes = await fetch('https://backend-beryl-nu-15.vercel.app/upload', {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData,
        });
        const responseData = await uploadRes.json();
        if (responseData.success) {
          product.image = responseData.image_url;
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        setLoading(false);
        toast.error('Failed to upload image');
        return;
      }
    }

    try {
      const updateRes = await fetch(`https://backend-beryl-nu-15.vercel.app/updateproduct/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product),
      });
      const updateData = await updateRes.json();
      setLoading(false);
      if (updateData.success) {
        toast.success('Product Updated');
        // Update the product list in the context
        const allProductsRes = await fetch('https://backend-beryl-nu-15.vercel.app/allproducts');
        const allProductsData = await allProductsRes.json();
        setAll_Product(allProductsData);
        setTimeout(() => navigate('/admin'), 1500);
      } else {
        toast.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setLoading(false);
      toast.error('An error occurred. Please try again.');
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
      {loading && <Loader />}
      <div className="addproduct-itemfields">
        <p>Product Title</p>
        <input
          value={productDetails.name || ''}
          onChange={changeHandler}
          type="text"
          name='name'
          placeholder='Enter name'
        />

      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfields">
          <p>Price</p>
          <input
            value={productDetails.old_price || ''}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder='Old price'
          />
        </div>
        <div className="addproduct-itemfields">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price || ''}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder='New price'
          />
        </div>
      </div>
      <div className="addproduct-itemfields">
        <p>Product Category</p>
        <select
          value={productDetails.category || ''}
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
        <p>Product Description</p>
        <textarea
          value={productDetails.description || ''}
          onChange={changeHandler}
          name="description"
          placeholder="Enter product description"
          rows="4"
        />
      </div>
      <div className="addproduct-itemfields">
        <p>Product Sizes</p>
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
      <div className="addproduct-itemfields" onClick={() => document.getElementById('file-input').click()}>
        <label>
          <img
            src={image || productDetails.image || upload_area}
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
    </div>
  );
};

export default EditProduct;
