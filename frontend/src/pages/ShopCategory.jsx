import React, { useContext, useEffect, useState } from 'react';
import './CSS/ShopCategory.css';
import { ShopContext } from '../components/Context/ShopContext';
import dropdown_icon from '../components/Assets/dropdown_icon.png';
import Item from '../components/Item/Item';

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Update the filteredProducts state whenever all_product changes
  useEffect(() => {
    const updatedProducts = all_product.filter(item => item.category === props.category);
    setFilteredProducts(updatedProducts);
  }, [all_product, props.category]);

  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={props.banner} alt="Category Banner" />
      <div className="shopcategory-indexsort">
        <p>
          <span>Showing 1-{filteredProducts.length} </span> out of {filteredProducts.length} products
        </p>

        <div className="shopcategory-sort">
          Sort by <img src={dropdown_icon} alt="Sort Icon" />
        </div>
      </div>
      <div className="shopcategory-products">
        {filteredProducts.map((item, index) => (
          <Item key={index}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
      {filteredProducts.length > 0 && (
        <div className="shopcategory-loadmore">
          Explore More
        </div>
      )}
    </div>
  );
};

export default ShopCategory;
