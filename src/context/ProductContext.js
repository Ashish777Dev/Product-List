import React, { createContext, useState } from "react";
import data from "../data.json";
const ProductContext = createContext();

function ProductContextProvider({ children }) {
  const [products, setProducts] = useState(data);
  const [cart, setCart] = useState([]);
  const [modal, setModal] = useState(false);
  const addToCart = (newItem) => {
    setCart((prevCart) => [...prevCart, { ...newItem, quantity: 1 }]);
  };
  const findItemInCart = (name) => {
    return cart.find((item) => item.name === name);
  };
  const isAddedToCart = (name) => {
    return findItemInCart(name) !== undefined;
  };

  const productQuantity = (name) => {
    const item = findItemInCart(name);
    return item ? item.quantity : 1;
  };

  const increment = (name) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.name === name
          ? { ...item, quantity: (item.quantity || 0) + 1 }
          : item
      )
    );
  };

  const decrement = (name) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.name === name
            ? { ...item, quantity: (item.quantity || 0) - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };
  const removeItem = (name) => {
    setCart((prevCart) => prevCart.filter((item) => item.name !== name));
  };
  const orderTotal = () => {
    if (!cart) return;
    return cart.reduce((acc, item) => (acc += item.price * item.quantity), 0);
  };

  const handleModal = () => {
    setModal(!modal);
  };

  const resetAll = () => {
    setModal(false);
    setCart([]);
  };
  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        cart,
        setCart,
        addToCart,
        isAddedToCart,
        productQuantity,
        increment,
        decrement,
        removeItem,
        orderTotal,
        handleModal,
        modal,
        setModal,
        resetAll,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export { ProductContext, ProductContextProvider };
