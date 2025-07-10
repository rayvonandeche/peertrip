import React from 'react';

const HeroSection = ({ hero, quickFilters }) => {
  return (
    <section className="hero-section">
      <h1 className="hero-title">{hero.title}</h1>
      <p className="hero-subtitle">{hero.subtitle}</p>
      <div className="search-container">
        <input 
          type="text" 
          className="search-input" 
          placeholder={hero.searchPlaceholder}
        />
        <button className="search-btn">
          <i className="fas fa-search"></i> Search
        </button>
      </div>
      <div className="quick-filters">
        {quickFilters.map((filter, index) => (
          <button key={index} className="filter-chip" onClick={() => console.log(`Filter: ${filter.text}`)}>
            <i className={filter.icon}></i> {filter.text}
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
