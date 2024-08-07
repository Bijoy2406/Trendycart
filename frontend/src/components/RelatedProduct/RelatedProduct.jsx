import React from 'react';
import Item from '../Item/Item';
import './RelatedProduct.css';

const RelatedProduct = ({ all_product = [], category, currentProductId }) => {
    const relatedProducts = all_product
        .filter((product) => product.category === category && product.id !== currentProductId)
        .slice(0, 4); // Limit to 4 related products

    return (
        <div className="relatedproducts">
            <h1>Related Products</h1>
            <hr />
            <div className="relatedproducts-item">
                {relatedProducts.map((product) => (
                    <Item
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        image={product.image}
                        new_price={product.new_price}
                        old_price={product.old_price}
                    />
                ))}
            </div>
        </div>
    );
};

export default RelatedProduct;
