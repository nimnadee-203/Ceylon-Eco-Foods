import React, { useState, useEffect } from "react";
import "./Cart.css";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedItems, setSelectedItems] = useState([]);
  const [showSummary, setShowSummary] = useState(false);

  // customer details
  const [customer, setCustomer] = useState(null);

  // Load cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch customer details when component mounts
  useEffect(() => {
    const loggedInCustomer = JSON.parse(localStorage.getItem("customer")); // saved at login
    if (loggedInCustomer?.email) {
      fetch(`http://localhost:5000/api/customers/${loggedInCustomer.email}`)
        .then((res) => res.json())
        .then((data) => setCustomer(data))
        .catch((err) => console.error("Error fetching customer:", err));
    }
  }, []);

  const handleQuantityChange = (productId, value) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === productId
          ? { ...item, quantity: Math.max(1, value) }
          : item
      )
    );
  };

  const increment = (productId) => {
    const item = cartItems.find((i) => i._id === productId);
    handleQuantityChange(productId, item.quantity + 1);
  };

  const decrement = (productId) => {
    const item = cartItems.find((i) => i._id === productId);
    handleQuantityChange(productId, item.quantity - 1);
  };

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter((i) => i._id !== productId);
    setCartItems(updatedCart);
    setSelectedItems(selectedItems.filter((id) => id !== productId));
  };

  const toggleSelectItem = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAll = () => {
    setSelectedItems(cartItems.map((item) => item._id));
  };

  const deselectAll = () => {
    setSelectedItems([]);
  };

  const placeOrder = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item to place the order!");
      return;
    }
    setShowSummary(true);
  };

const payNow = async () => {
  if (selectedItems.length === 0) return;

  const itemsToPay = cartItems.filter((item) =>
    selectedItems.includes(item._id)
  );

  const orderData = {
    orderId: Date.now().toString(), // unique id
    customerName: customer.fullName,
    customerEmail: customer.email,
    date: new Date(),
    products: itemsToPay.map((item) => item.productName),
    quantities: itemsToPay.map((item) => item.quantity),
    total: itemsToPay.reduce((acc, item) => acc + item.price * item.quantity, 0),
    orderstatus: "Pending",
    deliveryMethod: "Home Delivery",
  };

  try {
    const res = await fetch("http://localhost:5000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const data = await res.json();

    if (!res.ok) {
      // Show specific stock error from backend
      alert(data.message || "Failed to place order");
      return;
    }

    alert("Payment successful! Your order has been placed.");

    // Remove ordered items from cart
    const remainingCart = cartItems.filter(
      (item) => !selectedItems.includes(item._id)
    );
    setCartItems(remainingCart);
    setSelectedItems([]);
    setShowSummary(false);

    navigate("/my-orders");
  } catch (error) {
    console.error(error);
    alert("Something went wrong while placing your order.");
  }
};


  const totalAmount = cartItems
    .filter((item) => selectedItems.includes(item._id))
    .reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (showSummary) {
    const itemsToPay = cartItems.filter((item) =>
      selectedItems.includes(item._id)
    );

    return (
      <div className="container mt-5">
        <h2 className="mb-4">Checkout</h2>
        <div className="row">
          {/* Items Section */}
          <div className="col-md-7 mb-4">
            <div className="card shadow-sm p-4">
              <h5 className="mb-3">Order Items</h5>
              {itemsToPay.map((item) => (
                <div
                  key={item._id}
                  className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2"
                >
                  <div>
                    <strong>{item.productName}</strong>{" "}
                    <span className="text-muted">x {item.quantity}</span>
                    <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                      {item.category}
                    </div>
                  </div>
                  <div>
                    <strong>Rs. {item.price * item.quantity}</strong>
                  </div>
                </div>
              ))}
              <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                <h5>Total:</h5>
                <h5>Rs. {totalAmount}</h5>
              </div>
            </div>
          </div>

          {/* Shipping Info Section */}
          <div className="col-md-5 mb-4">
            <div className="card shadow-sm p-4">
              <h5 className="mb-3">Shipping Info</h5>
              {customer ? (
                <>
                  <div className="mb-2">
                    <strong>Name:</strong> {customer.fullName}
                  </div>
                  <div className="mb-2">
                    <strong>Email:</strong> {customer.email}
                  </div>
                  <div className="mb-2">
                    <strong>Address:</strong> {customer.address}
                  </div>
                  <div className="mb-2">
                    <strong>Phone:</strong> {customer.contactNumber}
                  </div>
                </>
              ) : (
                <p className="text-muted">Loading customer info...</p>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-end mt-3">
          <button
            className="btn btn-secondary me-2"
            onClick={() => setShowSummary(false)}
          >
            Back to Cart
          </button>
          <button className="btn btn-success btn-lg" onClick={payNow}>
            Pay Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="row">
          <div className="mb-3">
            <button
              className="btn btn-outline-primary me-2"
              onClick={selectAll}
            >
              Select All
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={deselectAll}
            >
              Deselect All
            </button>
          </div>

          {cartItems.map((item) => (
            <div key={item._id} className="col-md-12 mb-3">
              <div className="card p-3 d-flex flex-row align-items-center cart-item shadow-sm">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item._id)}
                  onChange={() => toggleSelectItem(item._id)}
                  className="me-3"
                />
                <img
                  src={`http://localhost:5000/${item.image}`}
                  alt={item.productName}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <div className="ms-3 flex-grow-1">
                  <h5>{item.productName}</h5>
                  <p className="mb-1">{item.category}</p>
                  <p className="mb-1">Rs. {item.price}</p>
                  <div className="quantity-selector d-flex align-items-center">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => decrement(item._id)}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      readOnly
                      value={item.quantity}
                      className="form-control mx-2 text-center"
                      style={{ width: "50px" }}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => increment(item._id)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="ms-3 d-flex flex-column align-items-end">
                  <p className="mb-2">
                    Subtotal: Rs. {item.price * item.quantity}
                  </p>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeItem(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="col-md-12 text-end mt-3">
            <h4>Total: Rs. {totalAmount}</h4>
            <button className="btn btn-primary" onClick={placeOrder}>
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
