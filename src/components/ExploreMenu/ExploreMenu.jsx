import React, { useEffect, useState, useContext } from 'react';
import './ExploreMenu.css';
import axios from 'axios';
import { FiChevronRight, FiX } from 'react-icons/fi';
import { StoreContext } from '../context/StoreContext';

const ExploreMenu = () => {
  const { food_list } = useContext(StoreContext);
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/category/all');
        if (res.data.success) {
          setMenuList(res.data.data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const getItems = (categoryId, subcategoryId = null) => {
    return food_list.filter(item => {
      const getId = (obj) => obj?._id || obj;
      const matchesCategory = getId(item.category) === getId(categoryId);
      if (!subcategoryId) return matchesCategory && !item.subcategory;
      return matchesCategory && getId(item.subcategory) === getId(subcategoryId);
    });
  };

  const openCategoryModal = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setIsModalOpen(true);
  };

  const openSubcategoryModal = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="menu-container">
      <div className="menu-header">
        <h1 className="menu-title">Our Product Category</h1>
        <p className="menu-subtitle">Discover our delicious offerings</p>
      </div>

      <div className="menu-categories-grid">
        {menuList.map((category) => (
          <div 
            key={category._id} 
            className="category-card"
            onClick={() => openCategoryModal(category)}
          >
            <div className="category-card-image">
              <img src={category.image} alt={category.name} />
              <div className="category-overlay">
                <h3>{category.name}</h3>
                <p>{getItems(category._id).length} items</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Modal */}
      {isModalOpen && selectedCategory && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={closeModal}>
              <FiX size={24} />
            </button>
            
            <div className="modal-header">
              <img 
                src={selectedCategory.image} 
                alt={selectedCategory.name} 
                className="modal-category-image"
              />
              <div>
                <h2>{selectedCategory.name}</h2>
                <p>{getItems(selectedCategory._id).length} items available</p>
              </div>
            </div>

            <div className="modal-body">
              {/* Main category items */}
              {getItems(selectedCategory._id).length > 0 && (
                <div className="modal-section">
                  <h3>Main Items</h3>
                  <div className="modal-products-grid">
                    {getItems(selectedCategory._id).map(item => (
                      <ProductCard key={item._id} item={item} />
                    ))}
                  </div>
                </div>
              )}

              {/* Subcategories */}
              {selectedCategory.subcategories?.length > 0 && (
                <div className="modal-section">
                  <h3>Subcategories</h3>
                  <div className="subcategories-grid">
                    {selectedCategory.subcategories.map(subcategory => (
                      <div 
                        key={subcategory._id} 
                        className="subcategory-card"
                        onClick={(e) => {
                          e.stopPropagation();
                          openSubcategoryModal(subcategory);
                        }}
                      >
                        <h4>{subcategory.name}</h4>
                        <p>{getItems(selectedCategory._id, subcategory._id).length} items</p>
                        <FiChevronRight className="subcategory-arrow" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subcategory Modal */}
      {isModalOpen && selectedSubcategory && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={closeModal}>
              <FiX size={24} />
            </button>
            
            <div className="modal-header">
              <h2>{selectedSubcategory.name}</h2>
              <p>{getItems(selectedCategory._id, selectedSubcategory._id).length} items available</p>
            </div>

            <div className="modal-body">
              <div className="modal-products-grid">
                {getItems(selectedCategory._id, selectedSubcategory._id).map(item => (
                  <ProductCard key={item._id} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductCard = ({ item }) => {
  const { addToCart, cartItems } = useContext(StoreContext);
  const quantity = cartItems[item._id] || 0;

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img src={item.image} alt={item.name} className="product-image" />
      </div>
      <div className="product-details">
        <h3 className="product-name">{item.name}</h3>
        <p className="product-description">{item.description}</p>
        <div className="product-actions">
          <span className="product-price">${item.price.toFixed(2)}</span>
          {quantity > 0 ? (
            <div className="quantity-controls">
              <button 
                className="quantity-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(item._id, -1);
                }}
              >
                −
              </button>
              <span className="quantity">{quantity}</span>
              <button 
                className="quantity-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(item._id, 1);
                }}
              >
                +
              </button>
            </div>
          ) : (
            <button 
              className="add-to-cart-btn"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(item._id, 1);
              }}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExploreMenu;