import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AIAssistantFab from '../components/common/AIAssistantFab';
import SearchableDestinations from '../components/common/SearchableDestinations';
import destinationsData from '../data/destinations.json';
import './../styles.css';

const CategoryDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  
  useEffect(() => {
    // Find the category by ID
    const categoryId = parseInt(id);
    const foundCategory = destinationsData.categories.find(cat => cat.id === categoryId);
    
    if (!foundCategory) {
      console.error(`Category with ID ${id} not found`);
      navigate('/discover');
      return;
    }
    
    setCategory(foundCategory);
    
    // Filter destinations based on category keywords
    // This is a simple keyword-based filter
    const keywordMap = {
      // Wildlife Safari
      1: ['wildlife', 'safari', 'animal', 'big five', 'migration', 'national park', 'reserve', 'elephant', 'lion'],
      // Coastal Adventures
      2: ['beach', 'coast', 'ocean', 'marine', 'water', 'diving', 'snorkel', 'coral', 'island', 'dhow'],
      // Mountain Trekking
      3: ['mountain', 'trek', 'hike', 'hiking', 'climb', 'peak', 'hill', 'highland'],
      // Cultural Heritage
      4: ['culture', 'heritage', 'traditional', 'history', 'museum', 'maasai', 'swahili', 'tribe'],
      // Culinary Tours
      5: ['food', 'cuisine', 'culinary', 'taste', 'cooking', 'restaurant', 'meal'],
      // Urban Exploration
      6: ['city', 'urban', 'modern', 'metropolis', 'nairobi', 'mombasa']
    };
    
    const keywords = keywordMap[categoryId] || [];
    
    const filtered = destinationsData.featuredDestinations.filter(dest => {
      // Check if any keyword is in the name, description or highlights
      const text = `${dest.name} ${dest.description} ${dest.highlights?.join(' ')}`.toLowerCase();
      return keywords.some(keyword => text.includes(keyword.toLowerCase()));
    });
    
    // If no destinations match or the filter fails, show all destinations
    setFilteredDestinations(filtered.length > 0 ? filtered : destinationsData.featuredDestinations);
  }, [id, navigate]);

  if (!category) {
    return null; // Or a loading spinner
  }

  return (
    <div>
      <Navbar activeRoute="/discover" />
      
      <div className="category-detail-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i> Back to Categories
        </button>
        
        <div className="category-detail-header">
          <div className="category-icon-large">
            <i className={category.icon}></i>
          </div>
          <h1>{category.title}</h1>
          <p className="category-detail-description">{category.description}</p>
        </div>
        
        {filteredDestinations.length > 0 ? (
          <SearchableDestinations 
            destinations={filteredDestinations}
            title={`${category.title} Destinations in Kenya`}
          />
        ) : (
          <div className="no-results">
            <h3>No destinations found for this category</h3>
            <p>Please try another category or contact us to suggest new destinations</p>
          </div>
        )}
      </div>

      <AIAssistantFab aiAssistant={{
        href: "/ai-assistant",
        title: "Ask AI Assistant",
        icon: "fas fa-robot"
      }} />
      
      <Footer />
    </div>
  );
};

export default CategoryDetail;
