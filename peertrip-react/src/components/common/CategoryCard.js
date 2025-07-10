import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();
  const { id, icon, title, description } = category;

  const handleClick = () => {
    // Navigate to discover page with category filter
    navigate(`/discover/category/${id}`, { 
      state: { categoryName: title }
    });
  };

  return (
    <div className="category-card" onClick={handleClick}>
      <div className="category-icon">
        <i className={icon}></i>
      </div>
      <h3 className="category-title">{title}</h3>
      <p className="category-description">{description}</p>
      <div className="category-link">
        <span>Explore {title}</span>
        <i className="fas fa-arrow-right"></i>
      </div>
      <div className="category-hover-overlay">
        <span className="view-text">View Destinations</span>
      </div>
    </div>
  );
};

export default CategoryCard;
