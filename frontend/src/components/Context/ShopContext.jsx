import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const ShopContext = createContext(null);

const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh-token');
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await fetch('http://localhost:4001/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: refreshToken }),
    });

    const data = await response.json();

    if (data.accessToken) {
      localStorage.setItem('auth-token', data.accessToken); // Update access token
      return data.accessToken;
    } else {
      throw new Error('Failed to refresh token');
    }
  } catch (error) {
    console.error('Error refreshing access token:', error);
    
    localStorage.removeItem('auth-token');
    localStorage.removeItem('refresh-token');
    
    return null; // Return null if refresh fails
  }
};

const fetchWithToken = async (url, options = {}) => {
  let token = localStorage.getItem('auth-token');
  if (!token) {
    token = await refreshAccessToken(); // Refresh the token if it's not available
  }

  if (!token) return; // If token is still not available, exit

  // Clone options to prevent modifying the original
  const fetchOptions = { ...options };
  fetchOptions.headers = {
    ...fetchOptions.headers,
    'auth-token': token,
  };

  return fetch(url, fetchOptions);
};

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

  // Load cartItems from localStorage on component mount
  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  // Update localStorage whenever cartItems changes
  useEffect(() => {
    // Check if cartItems is empty
    const isEmpty = Object.values(cartItems).every((item) => item === 0);

    if (isEmpty) {
      // If empty, clear localStorage
      localStorage.removeItem('cartItems'); 
    } else {
      // Otherwise, update localStorage with current cartItems
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all products
        const productsResponse = await fetch('http://localhost:4001/allproducts');
        const productsData = await productsResponse.json();
        setAll_Product(productsData);

        // Fetch cart items
        const cartResponse = await fetchWithToken('http://localhost:4001/getcart', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (cartResponse.ok) {
          const cartData = await cartResponse.json();
          setCartItems(cartData); 
        } else {
          console.error('Error fetching cart items:', cartResponse.status);
          // Handle error, maybe show a toast message
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error, maybe show a toast message
      }
    };

    fetchData();
  }, []);

  const addToCart = async (itemId, quantity = 1) => {
    try {
      const response = await fetchWithToken('http://localhost:4001/addtocart', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId, quantity }), // Send quantity to backend
      });

      if (response.ok) {
        // Update cartItems state after successful backend update
        setCartItems(prevCartItems => ({
          ...prevCartItems,
          [itemId]: (prevCartItems[itemId] || 0) + quantity
        }));

        toast.success('Added to cart!', {
          position: toast.POSITION.TOP_RIGHT
        });
      } else {
        console.error('Error adding to cart:', response.status);
        // Handle error, maybe show a toast message
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Handle error, maybe show a toast message
    }
  };

  const removeFromCart = async (ItemId) => {
    setCartItems((prev) => ({
      ...prev,
      [ItemId]: prev[ItemId] - 1,
    }));

    try {
      const response = await fetchWithToken('http://localhost:4001/removefromcart', {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId: ItemId }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const clearCart = async () => {
    setCartItems(getDefaultCart());

    try {
      const response = await fetchWithToken('http://localhost:4001/clearcart', {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'Content-Type': 'application/json',
        },
        body: "",
      });
      const data = await response.json();
      console.log('Cart cleared:', data);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = all_product.find((product) => product.id === Number(item));
        totalAmount += itemInfo.new_price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const getTotalCartItem = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  const contextValue = {
    getTotalCartItem,
    getTotalCartAmount,
    all_product,
    setAll_Product,
    cartItems,
    removeFromCart,
    addToCart,
    clearCart,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
