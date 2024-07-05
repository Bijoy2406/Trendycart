import React, { useState } from 'react';
import './Addproduct.css';
import upload_area from '../../Assets/upload_area.svg';

const Addproduct = () => {
    const [image, setImage] = useState(false);

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    };

    return (
        <div className='addproduct'>
            <div className="addproduct-itemfields">
                <p>Product Title</p>
                <input type="text" name='name' placeholder='Type here' />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfields">
                    <p>Price</p>
                    <input type="text" name="old_price" placeholder='Type here' />
                </div>
                <div className="addproduct-itemfields">
                    <p>Offer Price</p>
                    <input type="text" name="new_price" placeholder='Type here' />
                </div>
            </div>
            <div className="addproduct-itemfields">
                <p>Product Category</p>
                <select name="category" className='add-product-selector'>
                    <option value="" disabled selected hidden>Select category</option>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kid</option>
                </select>
            </div>
            <div className="addproduct-itemfields" onClick={() => document.getElementById('file-input').click()}>
                <label>
                    <img src={image ? URL.createObjectURL(image) : upload_area} className='addproduct-thumbnail-image' alt="" />
                </label>
                <input
                    onChange={imageHandler}
                    type="file"
                    name='image'
                    id='file-input'
                    style={{ display: 'none' }}
                />
            </div>
            <button className='addproduct-btn'>ADD</button>
        </div>
    );
}

export default Addproduct;
