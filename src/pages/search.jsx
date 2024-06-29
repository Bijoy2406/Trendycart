import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import all_products from '../components/Assets/all_product'; 
import './CSS/search.css';

const SearchResults = () => {
  const { searchTerm } = useParams();
  const [query, setQuery] = useState(searchTerm || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const inputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(searchTerm || '');
  }, [searchTerm]);

  const searchResults = useMemo(() => {
    let filteredProducts = all_products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );

    if (minPrice !== '') {
      filteredProducts = filteredProducts.filter(product => product.new_price >= minPrice);
    }
    if (maxPrice !== '') {
      filteredProducts = filteredProducts.filter(product => product.new_price <= maxPrice);
    }

    return filteredProducts;
  }, [query, minPrice, maxPrice]);

  const onSubmit = (e) => {
    e.preventDefault();
    const value = inputRef.current.value.trim();
    if (value === '') return;
    setQuery(value);
    navigate(`/search/${value}`);
    inputRef.current.value = '';
  };

  return (
    <div className="search-container">
      <form onSubmit={onSubmit}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="search"
          ref={inputRef}
          placeholder="Search products..."
        />
        <button type="submit">Search</button>
      </form>

      <div className="price-filter">
        <label>Min Price:</label>
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Min Price"
        />
        <label>Max Price:</label>
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Max Price"
        />
      </div>

      <div className="search-results">
        {searchResults.length > 0 ? (
          <div className="products-grid">
            {searchResults.map(product => (
              <Link to={`/product/${product.id}`} key={product.id} className="product-card">
                <img className="product-image" src={product.image} alt={product.name} />
                <h2 className="product-name">{product.name}</h2>
                <p className="product-price">Price: {product.new_price}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className='not-found'> 
            <h2>We're sorry.</h2>
            <p>We cannot find any matches for your search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
