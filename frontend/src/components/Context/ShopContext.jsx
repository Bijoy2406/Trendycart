import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < 300 + 1; index++) {
        cart[index] = 0;
    }
    return cart;
};

const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://backend-beryl-nu-15.vercel.app/allproducts');
                if (response.ok) {
                    const data = await response.json();
                    setAll_Product(data);
                } else {
                    console.error('Failed to fetch products');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const addProduct = (newProduct) => {
        setAll_Product((prevProducts) => [...prevProducts, newProduct]);
    };

    const updateProduct = (updatedProduct) => {
        setAll_Product((prevProducts) => prevProducts.map(product =>
            product.id === updatedProduct.id ? updatedProduct : product
        ));
    };

    const removeProduct = (id) => {
        setAll_Product((prevProducts) => prevProducts.filter(product => product.id !== id));
    };

    const addToCart = (Id) => {
      setCartItems((prev) => ({
          ...prev,
          [Id]: prev[Id] + 1,  // Initialize to 0 if it doesn't exist
      }));
  
      if (localStorage.getItem('auth-token')) {
          fetch('https://backend-beryl-nu-15.vercel.app/addtocart', {
              method: 'POST',
              headers: {
                  Accept: 'application/form-data',
                  'auth-token': `${localStorage.getItem('auth-token')}`,  // Correct template literal usage
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ "Id":Id }),
          })
          .then((response) => response.json())
          .then((data) => console.log(data));
          
      }
  };
  
    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: Math.max(prev[itemId] - 1, 0),
        }));
    };

    const getTotalCartAmount = () => {
        return all_product.reduce((total, product) => {
            return total + (cartItems[product.id] || 0) * product.new_price;
        }, 0);
    };

    const getTotalCartItem = () => {
        return Object.values(cartItems).reduce((total, qty) => total + qty, 0);
    };

    const contextValue = {
        getTotalCartItem,
        getTotalCartAmount,
        addProduct,
        updateProduct,
        removeProduct,
        all_product,
        cartItems,
        addToCart,
        removeFromCart,
        setAll_Product,
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
