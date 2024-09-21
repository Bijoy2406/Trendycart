import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './CSS/search.css';

const SearchResults = () => {
  const { searchTerm } = useParams();
  const [query, setQuery] = useState(searchTerm || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState('default'); // Default sorting option
  const [category, setCategory] = useState(''); // Added category state
  const inputRef = useRef();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    setQuery(searchTerm || '');
  }, [searchTerm]);

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

    if (category) {
      filteredProducts = filteredProducts.filter(product =>
        product.category === category
      );
    }

    if (minPrice !== '') {
      filteredProducts = filteredProducts.filter(product => product.new_price >= parseInt(minPrice));
    }
    if (maxPrice !== '') {
      filteredProducts = filteredProducts.filter(product => product.new_price <= parseInt(maxPrice));
    }

    // Sort based on the selected option
    if (sortOrder === 'lowToHigh') {
      filteredProducts.sort((a, b) => a.new_price - b.new_price);
    } else if (sortOrder === 'highToLow') {
      filteredProducts.sort((a, b) => b.new_price - a.new_price);
    }

    return filteredProducts;
  }, [query, minPrice, maxPrice, sortOrder, searchResults, category]);

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
        <div className="max-price-filter">
          <label>Max Price:</label>
          <input
            type="number"
            className="max-price-input"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max Price"
          />
        </div>

        <div className="min-price-filter">
          <label>Min Price:</label>
          <input
            type="number"
            className="min-price-input"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min Price"
          />
        </div>

        <div className="sort-by-filter">
          <label>Sort by:</label>
          <select
            className="sort-by-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="lowToHigh">Low to High</option>
            <option value="highToLow">High to Low</option>
          </select>
        </div>

        <div className="category-filter">
          <label>Category:</label>
          <select
            className="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
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
