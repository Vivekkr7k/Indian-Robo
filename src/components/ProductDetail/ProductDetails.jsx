import React, { useState } from 'react';
import './ProductDetails.css';

const ProductDetails = ({
  product: {
    name = '25 X 23 X 1000 mm Carbon Fiber Tube Thickness 1mm',
    code = 'SKU: 855941',
    price = 1945 ,
    description = 'Carbon fiber tubes can replace aluminum or steel tubes in a wide range of projects. A carbon fiber tube of the same weight as an aluminum or steel tube can be much stronger and lighter. This 40mm roll-wrapped carbon fiber tube is manufactured predominantly using high modulus (T700) unidirectional prepreg carbon fiber oriented to provide maximum strength in the lateral axis.',
    imageMain = 'https://indianrobostore.com/_next/image?url=https%3A%2F%2Fimages.indianrobostore.com%2FProd%2FProducts%2FIRS2304855941%2F1734773918075-b.webp&w=1080&q=85',
    thumbnails = ['https://indianrobostore.com/_next/image?url=https%3A%2F%2Fimages.indianrobostore.com%2FProd%2FProducts%2FIRS2304855941%2F1734773918075-b.webp&w=1080&q=85' , 'https://indianrobostore.com/_next/image?url=https%3A%2F%2Fimages.indianrobostore.com%2FProd%2FProducts%2FIRS2304855941%2F1734773918075-c.webp&w=1080&q=85'],
  } = {},
  onAddToCart = () => {},
}) => {
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(imageMain);

  const handleQuantity = e => {
    const val = Math.max(1, parseInt(e.target.value, 10) || 1);
    setQuantity(val);
  };

  return (
    <section className="product-details">
      <div className="pd-container">
        <div className="pd-images">
          <img src={mainImage} alt={name} className="pd-main-img" />
          <div className="pd-thumb-list">
            {thumbnails.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${name} thumbnail ${i + 1}`}
                onClick={() => setMainImage(src)}
                className={mainImage === src ? 'selected-thumb' : ''}
              />
            ))}
          </div>
        </div>

        <div className="pd-info">
          <h1 className="pd-name">{name}</h1>
          <p className="pd-code">Product Code: <strong>{code}</strong></p>
          <p className="pd-price">₹{price.toLocaleString()} <span className='pd-small'>"Inc GST"</span> </p>

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
              onClick={() => onAddToCart({ name, code, price }, quantity)}
            >
              Add to Cart
            </button>
          </div>

          {/* Optional Features/Package section */}
          <div className="pd-extra">
            <h3>Features:</h3>
            <ul>
              <li>High modulus T700 carbon fiber – ultra‑light and stiff</li>
              <li>Up to 5× stronger than steel/aluminum of same weight</li>
              <li>UV‑stable, corrosion and non‑conductive</li>
              <li>High Corrosion Resistance</li>
              <li>Electrical & Thermal Non-Conductivity</li>
            </ul>

            <h3>Package Includes:</h3>
            <ul>
              <li>1 × Carbon Fiber Tube, 25 × 23 × 1000 mm (hollow)</li>
            </ul>
          </div>
                 <h3>Description</h3>
          <p className="pd-desc">{description}</p>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
