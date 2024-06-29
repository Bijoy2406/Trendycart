import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import all_product from '../components/Assets/all_product';
import new_collections from '../components/Assets/new_collections';
import data_product from '../components/Assets/data';
import './CSS/search.css'

const SearchResults = () => {
    const { searchTerm } = useParams(); 
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [showFilter, setShowFilter] = useState(false);
    const [searchResults, setSearchResults] = useState([]);


    const allProducts = [...all_product, ...new_collections, ...data_product];

    useEffect(() => {
        
        setSearchResults([]);

        const filteredProducts = allProducts.filter(product => {
            return product.name.toLowerCase().includes(searchTerm.trim().toLowerCase()) &&
                   product.new_price >= minPrice &&
                   product.new_price <= maxPrice;
        });

        
        setSearchResults(filteredProducts);

        
        return () => {
            setSearchResults([]);
        };
    }, [searchTerm, minPrice, maxPrice]);

    return (
        <div className="search-results">
            <input className="price-input" type="number" placeholder="Min Price" onChange={(e) => setMinPrice(e.target.value)} />
            <input className="price-input" type="number" placeholder="Max Price" onChange={(e) => setMaxPrice(e.target.value)} />
            <div className="products-grid">
                {searchResults.length > 0 ? (
                    searchResults.map(product => (
                        <Link to={`/product/${product.id}`} key={product.id} className="product-card">
                            <img className="product-image" src={product.image} alt={product.name} />
                            <h2 className="product-name">{product.name}</h2>
                            <p className="product-price">Price: {product.new_price}</p>
                        </Link>
                    ))
                ) : (
                   <div className='not-found'> 
                    <h2>We're sorry.</h2>
                    <p> We cannot find any matches for your search term.</p>
                   </div>
                )}
            </div>
        </div>
    );
}

export default SearchResults;
