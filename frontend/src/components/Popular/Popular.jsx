import React, { useState, useEffect } from 'react'; 
import './Popular.css';
import Item from '../Item/Item';

const Popular = () => {
  const [data_product, setPopularProducts] = useState([]); 

  useEffect(() => {
    fetch('https://backend-beryl-nu-15.vercel.app//polpularinwoman')
      .then((response) => response.json())
      .then((data) => setPopularProducts(data));
     
  }, []); 

  return (
    <div className='popular'>
       <h1>POPULAR IN WOMEN</h1> 
       <hr />
       <div className="popular-item">
        {data_product.map((item, i) => (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
        ))}
       </div>
    </div>
  );
};

export default Popular;
