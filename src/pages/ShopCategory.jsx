import React, { useContext } from 'react';
import './CSS/ShopCategory.css';
import { ShopContext } from '../components/Context/ShopContext';

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);

  
  return (
    <div className='shop-category'>
      
        <img src={props.banner} alt="Category Banner" />
      
    </div>
  );
};

export default ShopCategory;
