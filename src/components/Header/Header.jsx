import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Array with image and corresponding text
  const slides = [
    {
      image: 'https://static.platform.michaels.com/2c-prd/369608177096672.jpg?fit=inside|1280:1280',
      heading: 'Shop BALSA sheet Products',
      description: 'Discover lightweight, ultra-durable gear crafted for performance and style. Perfect for automotive, tech, and lifestyle upgrades.',
    },
    {
      image: 'https://www.nitprocomposites.com/assets/images/carbon-fiber-sheets-banner-2.jpg',
      heading: 'Engineered for Strength and Precision',
      description: 'Our carbon fiber sheets are ideal for aerospace, racing, and industrial-grade projects.',
    },
    {
      image: 'https://tse3.mm.bing.net/th/id/OIP.5J-NBzMjgzAIDStWz9J5fAHaFJ?rs=1&pid=ImgDetMain&o=7&rm=3',
      heading: 'Upgrade Your Build with Printed tapes',
      description: 'Get unmatched rigidity and ultra-high quality tapes.',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => setCurrentIndex(index);
  const goToPrev = () => setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const goToNext = () => setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

  return (
    <div className='header'>
      {/* Carousel slides */}
      <div className="carousel-slides">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}
      </div>

      {/* Dynamic content overlay */}
      <div className="header-contents">
        <h2>{slides[currentIndex].heading}</h2>
        <p>{slides[currentIndex].description}</p>
      </div>

      {/* Arrows */}
      <button className="carousel-arrow prev" onClick={goToPrev}>
        &lt;
      </button>
      <button className="carousel-arrow next" onClick={goToNext}>
        &gt;
      </button>

      {/* Indicators */}
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Header;
