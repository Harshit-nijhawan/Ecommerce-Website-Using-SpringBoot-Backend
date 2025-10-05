import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import CheckoutPopup from "./CheckoutPopup";
import { Button } from "react-bootstrap";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // Fetch cart items + merge with backend product data + fetch images
  useEffect(() => {
    const fetchCartItems = async () => {
      if (cart.length === 0) {
        setCartItems([]);
        return;
      }

      try {
        // Fetch all products from backend
        const response = await axios.get("/products");
        const backendProducts = response.data;

        // Merge cart items with backend product data
        const updatedCartItems = cart
          .map((cartItem) => {
            const product = backendProducts.find((p) => p.id === cartItem.id);
            if (!product) return null;
            return { ...cartItem, ...product };
          })
          .filter(Boolean);

        // Fetch images and save as blob for each item
        const cartItemsWithImages = await Promise.all(
          updatedCartItems.map(async (item) => {
            try {
              const imageResponse = await axios.get(
                `/product/${item.id}/image`,
                { responseType: "blob" }
              );

              return {
                ...item,
                imageUrl: URL.createObjectURL(imageResponse.data),
                imageFile: imageResponse.data, // Save blob for checkout
              };
            } catch (err) {
              console.error("Error fetching image:", err);
              return { ...item, imageUrl: "placeholder-image-url", imageFile: null };
            }
          })
        );

        setCartItems(cartItemsWithImages);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchCartItems();
  }, [cart]);

  // Calculate total price
  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  // Quantity handlers
  const handleIncreaseQuantity = (itemId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.min(item.quantity + 1, item.stockQuantity) }
          : item
      )
    );
  };

  const handleDecreaseQuantity = (itemId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      )
    );
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Checkout handler
  const handleCheckout = async () => {
  try {
    for (const item of cartItems) {
      // 1. Prepare the product data, excluding image info
      const { imageUrl, imageFile, ...productData } = item;
      const updatedStockQuantity = productData.stockQuantity - productData.quantity;
      const updatedProductData = { ...productData, stockQuantity: updatedStockQuantity };

      // 2. Create the form data object
      const formData = new FormData();

      // 3. IMPORTANT: Append only the product JSON, not the image file
      formData.append(
        "product",
        new Blob([JSON.stringify(updatedProductData)], { type: "application/json" })
      );

      // 4. Send the PUT request using your configured axios instance
      await axios.put(`/product/${item.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    // 5. Clear the cart and show success message
    clearCart();
    setCartItems([]);
    setShowModal(false);
    alert("Purchase confirmed!");

  } catch (err) {
    console.error("Error during checkout:", err);
    alert("Checkout failed! Please try again.");
  }
};

  return (
    <div className="cart-container">
      <div className="shopping-cart">
        <div className="title">Shopping Bag</div>
        {cartItems.length === 0 ? (
          <div className="empty" style={{ textAlign: "left", padding: "2rem" }}>
            <h4>Your cart is empty</h4>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <div
                  className="item"
                  style={{ display: "flex", alignContent: "center" }}
                >
                  <div>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="cart-item-image"
                    />
                  </div>
                  <div className="description">
                    <span>{item.brand}</span>
                    <span>{item.name}</span>
                  </div>
                  <div className="quantity">
                    <button
                      className="plus-btn"
                      type="button"
                      onClick={() => handleIncreaseQuantity(item.id)}
                    >
                      <i className="bi bi-plus-square-fill"></i>
                    </button>
                    <input type="button" value={item.quantity} readOnly />
                    <button
                      className="minus-btn"
                      type="button"
                      onClick={() => handleDecreaseQuantity(item.id)}
                    >
                      <i className="bi bi-dash-square-fill"></i>
                    </button>
                  </div>
                  <div className="total-price" style={{ textAlign: "center" }}>
                    ₹{item.price * item.quantity}
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveFromCart(item.id)}
                  >
                    <i className="bi bi-trash3-fill"></i>
                  </button>
                </div>
              </li>
            ))}
            <div className="total">Total: ₹{totalPrice}</div>
            <Button
              className="btn btn-primary"
              style={{ width: "100%" }}
              onClick={() => setShowModal(true)}
            >
              Checkout
            </Button>
          </>
        )}
      </div>
      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
      />
    </div>
  );
};

export default Cart;
