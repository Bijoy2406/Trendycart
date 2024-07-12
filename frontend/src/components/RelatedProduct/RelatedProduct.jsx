import React, { useState, useEffect } from 'react';
import './RelatedProduct.css';
import axios from 'axios';
import Item from '../Item/Item';

const RelatedProduct = ({ category }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`https://backend-beryl-nu-15.vercel.app/allproducts?category=${category}`);
                setProducts(response.data.slice(0, 4)); // Limit to the first 4 products
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [category]);

    return (
        <div className='relatedproducts'>
            <h1>Related Products</h1>
            <hr />
            <div className="relatedproducts-item">
                {products.map((item, i) => (
                    <Item key={i}
                        id={item.id}
                        name={item.name}
                        image={item.image}
                        new_price={item.new_price}
                        old_price={item.old_price} />
                ))}
            </div>
        </div>
    );
};

export default RelatedProduct;
