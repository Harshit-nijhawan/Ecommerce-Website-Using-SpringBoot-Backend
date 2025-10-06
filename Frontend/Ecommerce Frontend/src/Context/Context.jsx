import axios from "../axios";
import { useState, useEffect, createContext } from "react";

const AppContext = createContext({
  data: [],
  isError: "",
  cart: [],
  addToCart: (product) => {},
  removeFromCart: (productId) => {},
  refreshData:() =>{},
  clearCart:() =>{},
  // == ADMIN ROLE ADDITIONS ==
  isAdmin: false,
  toggleAdminMode: () => {},
  // ==========================
});

export const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState("");
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  // == ADMIN ROLE ADDITIONS: Initialize and persist admin state in session storage ==
  const [isAdmin, setIsAdmin] = useState(JSON.parse(sessionStorage.getItem('isAdmin')) || false);

  const toggleAdminMode = () => {
    const newState = !isAdmin;
    setIsAdmin(newState);
    sessionStorage.setItem('isAdmin', JSON.stringify(newState));
  };

  const addToCart = (product) => {
    const existingProductIndex = cart.findIndex((item) => item.id === product.id);
    if (existingProductIndex !== -1) {
      const updatedCart = cart.map((item, index) =>
        index === existingProductIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = (productId) => {
    console.log("productID",productId)
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    console.log("CART",cart)
  };

  const refreshData = async () => {
    try {
      const response = await axios.get("/products");
      setData(response.data);
    } catch (error) {
      setIsError(error.message);
    }
  };

  const clearCart =() =>{
    setCart([]);
  }
  
  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  return (
    <AppContext.Provider 
      value={{ 
        data, 
        isError, 
        cart, 
        addToCart, 
        removeFromCart,
        refreshData, 
        clearCart,
        // == ADMIN ROLE EXPORT ==
        isAdmin,
        toggleAdminMode
        // =======================
      }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;