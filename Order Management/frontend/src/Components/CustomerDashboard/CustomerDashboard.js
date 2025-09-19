import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CustomerDashboard.css";

function CustomerDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({}); // track quantity per product

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/products");
        setProducts(res.data.products || []);
        const initialQty = {};
        res.data.products.forEach((p) => (initialQty[p._id] = 1));
        setQuantities(initialQty);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, Math.min(value, getStock(productId))),
    }));
  };

  const getStock = (productId) => {
    const product = products.find((p) => p._id === productId);
    return product?.stock || 1;
  };

  const increment = (productId) => {
    handleQuantityChange(productId, (quantities[productId] || 1) + 1);
  };

  const decrement = (productId) => {
    handleQuantityChange(productId, (quantities[productId] || 1) - 1);
  };

const handleAddToCart = (product) => {
  const qty = quantities[product._id] || 1;
  const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

  const index = existingCart.findIndex((p) => p._id === product._id);
  if (index >= 0) {
    existingCart[index].quantity += qty;
  } else {
    existingCart.push({ ...product, quantity: qty });
  }

  localStorage.setItem("cart", JSON.stringify(existingCart));
  alert(`Added ${qty} of "${product.productName}" to cart!`);

  // Navigate to cart and pass a state flag to trigger reload
  navigate("/cart", { state: { refresh: true } });
};

  return (
    <div className="container mt-5 customer-dashboard">
      <h1 className="mb-3">Welcome to Our Store</h1>
      <p>Browse our products and place your order easily!</p>

      <div className="row mt-4">
        {products.length === 0 ? (
          <p>No products available</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
              <div className="card product-card h-100 shadow-sm">
                {product.image && (
                  <img
                    src={`http://localhost:5000/${product.image}`}
                    alt={product.productName}
                    className="card-img-top product-image"
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.productName}</h5>
                  <p className="card-text">{product.category}</p>
                  <p className="card-text">Rs. {product.price}</p>
                  <p className="card-text">
                    {product.stock} {product.units} available
                  </p>

                  <div className="quantity-selector d-flex align-items-center mb-2">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => decrement(product._id)}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      readOnly
                      value={quantities[product._id] || 1}
                      className="form-control mx-2 text-center"
                      style={{ width: "50px" }}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => increment(product._id)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="btn btn-primary mt-auto"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CustomerDashboard;
