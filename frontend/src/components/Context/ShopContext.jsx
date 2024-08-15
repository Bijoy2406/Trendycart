import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const ShopContext = createContext(null);

const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh-token');
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await fetch('https://backend-beryl-nu-15.vercel.app/token', {
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

  useEffect(() => {
    fetch('https://backend-beryl-nu-15.vercel.app/allproducts')
      .then((response) => response.json())
      .then((data) => setAll_Product(data));

      const fetchCartItems = async () => {
        try {
          let response = await fetchWithToken('https://backend-beryl-nu-15.vercel.app/getcart', {
            method: 'POST',
            headers: {
              Accept: 'application/form-data',
              'Content-Type': 'application/json',
            },
          });
    
          // If the response is unauthorized, try refreshing the token
          if (response.status === 401) {
            const newToken = await refreshAccessToken();
            if (newToken) {
              response = await fetchWithToken('https://backend-beryl-nu-15.vercel.app/getcart', {
                method: 'POST',
                headers: {
                  Accept: 'application/form-data',
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${newToken}`,
                },
              });
            }
          }
    
          const data = await response.json();
          setCartItems(data);
        } catch (error) {
          console.error('Error fetching cart items:', error);
        }
      };
    
      fetchCartItems();
    }, []);
  const addToCart = async (ItemId) => {
    setCartItems((prev) => ({
      ...prev,
      [ItemId]: prev[ItemId] + 1,
    }));

    try {
      const response = await fetchWithToken('https://backend-beryl-nu-15.vercel.app/addtocart', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId: ItemId }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const removeFromCart = async (ItemId) => {
    setCartItems((prev) => ({
      ...prev,
      [ItemId]: prev[ItemId] - 1,
    }));

    try {
      const response = await fetchWithToken('https://backend-beryl-nu-15.vercel.app/removefromcart', {
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
      const response = await fetchWithToken('https://backend-beryl-nu-15.vercel.app/clearcart', {
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
