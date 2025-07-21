import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img src='https://indianrobostore.com/_next/image?url=https%3A%2F%2Fd1k5dvsh23g3c2.cloudfront.net%2FProd%2Futility%2Fblack%2520logo.png&w=1920&q=75' alt="" />
                <p>Indian Robo Store offers a wide range of premium drone carbon fiber tubes, perfect for drone and robotics applications. Known for their lightweight, high strength, and durability, these tubes are ideal for constructing frames, arms, and structural components. Popular sizes include 48*38*1000 mm (1mm thickness) for precision builds and 40*36*1000 mm (2mm thickness) for added strength in heavy-duty projects.</p>
                <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="" />
                    <img src={assets.twitter_icon} alt="" />
                    <img src={assets.linkedin_icon} alt="" />
                </div>
            </div>
            <div className="footer-content-center">
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            <div className="footer-content-right">
                <h2>GET IN TOUCH</h2>
                <ul>
                    <li>+94 765489545</li>
                    <li>dulanjalisenarathna93@gmail.com</li>
                </ul>
            </div>
           
        </div>
        <hr />
        <p className="footer-copyright">
            Copyright 2024 &copy; Dulanjali - All Right Reserved.
        </p>
    </div>
  )
}

export default Footer