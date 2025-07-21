import React, { useEffect, useState } from 'react';
import './ExploreMenu.css';
import axios from 'axios';

const ExploreMenu = ({ category, setCategory }) => {
  const [menuList, setMenuList] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/category/all');
        if (res.data.success) {
          setMenuList(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="explore-menu" id="explore-menu">
      <h2 className="section-title">Explore Categories</h2>
      <p className="explore-menu-text">
        Discover content by category. Tap a category to explore curated products and influencers.
      </p>

      <div className="explore-menu-list">
        {menuList.map((item, index) => (
          <div
            key={index}
            className={`explore-menu-item ${category === item.name ? 'selected' : ''}`}
            onClick={() =>
              setCategory(prev => (prev === item.name ? 'All' : item.name))
            }
          >
            <img src={item.image} alt={item.name} />
            <p>{item.name}</p>
          </div>
        ))}
      </div>

      <hr className="menu-divider" />
    </section>
  );
};

export default ExploreMenu;
