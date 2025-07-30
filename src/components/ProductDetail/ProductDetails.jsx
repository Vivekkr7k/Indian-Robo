import React, { useState } from 'react';
import './ProductDetails.css';
import { FiShoppingCart } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetails = ({
  product: {
    _id = '',
    name = '',
    code = '',
    price = 0,
    description = '',
    image = '',
    images = [],
  } = {},
  onAddToCart = () => {},
  onClose = () => {}
}) => {
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(image);

  // ✅ Corrected shipping calculation
  const calculateShippingCharge = (qty) => {
    return 550 + (qty - 1) * 55;
  };

  const handleQuantity = e => {
    const val = Math.max(1, parseInt(e.target.value, 10) || 1);
    setQuantity(val);
  };

  const handleAddToCart = () => {
    try {
      const dynamicShippingCharge = calculateShippingCharge(quantity);
      const totalPrice = (price * quantity) + dynamicShippingCharge;

      onAddToCart(_id, quantity, {
        name,
        code,
        price,
        shippingCharge: dynamicShippingCharge,
        totalPrice,
        image
      });

      toast.success(`${quantity} ${name} added to cart (₹${dynamicShippingCharge} shipping)!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setQuantity(1);
    } catch (error) {
      toast.error('Failed to add item to cart', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error('Error adding to cart:', error);
    }
  };

  const allImages = [image, ...images].filter(Boolean);

  return (
    <section className="product-details">
      <div className="pd-container">
        <div className="pd-images">
          <img src={mainImage || image} alt={name} className="pd-main-img" />
          {allImages.length > 1 && (
            <div className="pd-thumb-list">
              {allImages.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${name} thumbnail ${i + 1}`}
                  onClick={() => setMainImage(src)}
                  className={mainImage === src ? 'selected-thumb' : ''}
                />
              ))}
            </div>
          )}
        </div>

        <div className="pd-info">
          <h1 className="pd-name">{name}</h1>
          {code && (
            <p className="pd-code">Product Code: <strong>{code}</strong></p>
          )}
          <p className="pd-price">₹{price.toLocaleString()} <span className='pd-small'>"Inc GST"</span></p>

          <div className="pd-buy-section">
            <label htmlFor="qty">Qty:</label>
            <input
              type="number"
              id="qty"
              min="1"
              value={quantity}
              onChange={handleQuantity}
            />
            <button
              className="btn-add-cart"
              onClick={handleAddToCart}
            >
              <FiShoppingCart size={16} /> Add to Cart
            </button>
          </div>

          {description && (
            <>
              <h3 className="pd-desc">Description</h3>
              <p>{description}</p>
            </>
          )}

          {/* Shipping info */}
          <div className="pd-shipping-info">
            <h3 className="pd-shipping-title">Shipping & Packaging</h3>
            <p>Shipping: ₹{calculateShippingCharge(quantity)}</p>
            <p className="pd-shipping-note">
              ₹550 base + ₹55 per additional item
            </p>
          </div>

          {/* Price Breakdown */}
          <div className="pd-price-breakdown">
            <h3 className="pd-price-title">Price Breakdown</h3>
            <div className="pd-price-row">
              <span>Product Price:</span>
              <span>₹{(price * quantity).toLocaleString()}</span>
            </div>
            <div className="pd-price-row">
              <span>Shipping & Packaging:</span>
              <span>₹{calculateShippingCharge(quantity)}</span>
            </div>
            <div className="pd-price-row pd-price-total">
              <span>Total:</span>
              <span>₹{((price * quantity) + calculateShippingCharge(quantity)).toLocaleString()}</span>
            </div>
            <h1>For Outside INDIA order , please Contact us</h1>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;