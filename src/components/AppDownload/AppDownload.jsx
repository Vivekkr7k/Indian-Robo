import React from 'react'
import './AppDownlaod.css'
import p1 from "../../assets/FeaturedProducts/0.jpg"
import p2 from "../../assets/FeaturedProducts/1.jpg"
import p3 from "../../assets/FeaturedProducts/2.jpg"



const AppDownload = () => {
  return (
  <div className="featured-products" id="featured-products">
  <h2 className="section-title">Featured Products</h2>
  <div className="product-grid">
    <div className="product-card">
      <img src={p1} alt="BALSA SHEET" />
      <h3>BALSA SHEET IN 1MM X 100MM X 1000MM PACK OF 3PC</h3>
      <p>Balsa wood is a lightweight, sturdy, and eco-friendly material, perfect for crafting, modeling, and architectural projects. It's easy to cut, shape, paint, and stain—ideal for both beginners and pros.</p>
      <span className="price">₹910</span>
    </div>
    <div className="product-card">
      <img src={p2} alt="BALSA SHEET" />
      <h3>BALSA SHEET IN 1.5MM X 100MM X 1000MM PACK OF 3PC</h3>
      <p>Balsa wood is a lightweight, sturdy, and eco-friendly material, perfect for crafting, modeling, and architectural projects. It's easy to cut, shape, paint, and stain—ideal for both beginners and pros.</p>
      <span className="price">₹990</span>
    </div>
    <div className="product-card">
      <img src={p3} alt="AERO PLY" />
      <h3>AERO PLY IN 1.5MM X 915MM X 915MM PACK OF 3PC</h3>
      <p>Aeroply, or model-grade plywood, is a lightweight and strong material with a smooth finish, ideal for model airplanes, drones, and precision crafts. It's perfect for building durable, lightweight structures.</p>
      <span className="price">₹4,550</span>
    </div>
    <div className="product-card">
      <img src={p3} alt="Carbon Fiber Pen" />
      <h3>AERO PLY IN 2MM X 915MM X 915MM PACK OF 3PC</h3>
      <p>Aeroply, or model-grade plywood, is a lightweight and strong material with a smooth finish, ideal for model airplanes, drones, and precision crafts. It's perfect for building durable, lightweight structures.</p>
      <span className="price">₹999</span>
    </div>
  </div>
</div>

  )
}

export default AppDownload