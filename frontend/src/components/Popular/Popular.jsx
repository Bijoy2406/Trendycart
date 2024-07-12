import React, { useState, useEffect } from 'react';
import './Popular.css';
import Item from '../Item/Item';

const Popular = () => {
  const [popularItems, setPopularItems] = useState([]);

  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        const response = await fetch('http://localhost:4001/allproducts');
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

export default Popular;
