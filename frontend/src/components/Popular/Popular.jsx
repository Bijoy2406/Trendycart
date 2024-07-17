<<<<<<< HEAD
import React, { useState, useEffect } from 'react'; 
=======
import React, { useState, useEffect } from 'react';
>>>>>>> origin/basic
import './Popular.css';
import Item from '../Item/Item';

const Popular = () => {
<<<<<<< HEAD
  const [data_product, setPopularProducts] = useState([]); 

  useEffect(() => {
    fetch('http://localhost:4001/polpularinwoman')
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
=======
  const [popularItems, setPopularItems] = useState([]);

  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        const response = await fetch('https://backend-beryl-nu-15.vercel.app/allproducts');
        if (response.ok) {
          const data = await response.json();
          const womenItems = data.filter(item => item.category === 'women').slice(0, 4);
          setPopularItems(womenItems);
        } else {
          console.error('Failed to fetch popular items');
        }
      } catch (error) {
        console.error('Error fetching popular items:', error);
      }
    };

    fetchPopularItems();
  }, []);

  return (
    <div className='popular'>
      <h1>POPULAR IN WOMEN</h1> 
      <hr />
      <div className="popular-item">
        {popularItems.map((item, i) => (
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
}
>>>>>>> origin/basic

export default Popular;
