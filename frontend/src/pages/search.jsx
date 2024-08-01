import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './CSS/search.css';

const SearchResults = () => {
  const { searchTerm } = useParams();
  const [query, setQuery] = useState(searchTerm || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState(''); 
  const inputRef = useRef();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    setQuery(searchTerm || '');
  }, [searchTerm]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`https://backend-beryl-nu-15.vercel.app//allproducts`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const products = await response.json();
        setSearchResults(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filteredProducts = searchResults;

    if (query.trim() !== '') {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (minPrice !== '') {
      filteredProducts = filteredProducts.filter(product => product.new_price >= parseInt(minPrice));
    }
    if (maxPrice !== '') {
      filteredProducts = filteredProducts.filter(product => product.new_price <= parseInt(maxPrice));
    }

    
    if (sortOrder === 'lowToHigh') {
      filteredProducts.sort((a, b) => a.new_price - b.new_price);
    } else if (sortOrder === 'highToLow') {
      filteredProducts.sort((a, b) => b.new_price - a.new_price);
    }

    return filteredProducts;
  }, [query, minPrice, maxPrice, sortOrder, searchResults]);

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
      <div className="price-filter">
        <label>Max Price:</label>
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Max Price"
        />
        <label>Min Price:</label>
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Min Price"
        />

        <div className="sort-by">
          <label>Sort by:</label>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="search-results">
        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <Link to={`/product/${product.id}`} key={product.id} className="product-card">
                <img className="product-image" src={product.image} alt={product.name} />
                <h2 className="product-name">{product.name}</h2>
                <p className="product-price">Price: ৳{product.new_price}</p>
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
