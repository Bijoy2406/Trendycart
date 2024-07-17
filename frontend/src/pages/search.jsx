import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import all_products from '../components/Assets/all_product'; 
=======
>>>>>>> origin/basic
import './CSS/search.css';

const SearchResults = () => {
  const { searchTerm } = useParams();
  const [query, setQuery] = useState(searchTerm || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
<<<<<<< HEAD
  const inputRef = useRef();
  const navigate = useNavigate();
=======
  const [sortOrder, setSortOrder] = useState(''); // State for sort order
  const inputRef = useRef();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
>>>>>>> origin/basic

  useEffect(() => {
    setQuery(searchTerm || '');
  }, [searchTerm]);

<<<<<<< HEAD
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
=======
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`https://backend-beryl-nu-15.vercel.app/allproducts`);
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

    // Sort products based on sortOrder
    if (sortOrder === 'lowToHigh') {
      filteredProducts.sort((a, b) => a.new_price - b.new_price);
    } else if (sortOrder === 'highToLow') {
      filteredProducts.sort((a, b) => b.new_price - a.new_price);
    }

    return filteredProducts;
  }, [query, minPrice, maxPrice, sortOrder, searchResults]);
>>>>>>> origin/basic

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
<<<<<<< HEAD
    

      <div className="price-filter">
        <label>Min Price:</label>
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Min Price"
        />
=======
      <div className="price-filter">
>>>>>>> origin/basic
        <label>Max Price:</label>
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Max Price"
        />
<<<<<<< HEAD
      </div>

      <div className="search-results">
        {searchResults.length > 0 ? (
          <div className="products-grid">
            {searchResults.map(product => (
              <Link to={`/product/${product.id}`} key={product.id} className="product-card">
                <img className="product-image" src={product.image} alt={product.name} />
                <h2 className="product-name">{product.name}</h2>
                <p className="product-price">Price: {product.new_price}</p>
=======
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
>>>>>>> origin/basic
              </Link>
            ))}
          </div>
        ) : (
<<<<<<< HEAD
          <div className='not-found'> 
=======
          <div className='not-found'>
>>>>>>> origin/basic
            <h2>We're sorry.</h2>
            <p>We cannot find any matches for your search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
