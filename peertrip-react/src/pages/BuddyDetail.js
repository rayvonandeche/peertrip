import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AIAssistantFab from '../components/common/AIAssistantFab';
import './../styles.css';
import buddyDetails from '../data/buddyDetails.json';

const BuddyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [buddy, setBuddy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    // Find the buddy with matching ID
    const buddyId = parseInt(id);
    const foundBuddy = buddyDetails.buddies.find(b => b.id === buddyId);
    
    if (foundBuddy) {
      setBuddy(foundBuddy);
    } else {
      console.error(`Buddy with ID ${id} not found`);
    }
    
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading buddy profile...</p>
      </div>
    );
  }

  if (!buddy) {
    return (
      <div className="not-found-container">
        <h2>Profile Not Found</h2>
        <p>Sorry, we couldn't find the buddy profile you're looking for.</p>
        <button className="btn primary-btn" onClick={() => navigate('/')}>Return to Home</button>
      </div>
    );
  }

  return (
    <div>
      <Navbar activeRoute="/peers" />
      
      <div className="buddy-profile-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
        
        <div className="buddy-profile-header" style={{ backgroundImage: `url(${buddy.coverPhoto})` }}>
          <div className="buddy-profile-overlay"></div>
          <div className="buddy-profile-info">
            <img src={buddy.avatar} alt={buddy.name} className="buddy-profile-avatar" />
            <div className="buddy-profile-name-info">
              <h1>{buddy.name}</h1>
              <div className="buddy-profile-title">{buddy.title}</div>
              <div className="buddy-profile-location">
                <i className="fas fa-map-marker-alt"></i> {buddy.location}
              </div>
              <div className="buddy-profile-rating">
                <div className="stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <i key={i} 
                       className={`fas fa-star ${i < Math.floor(buddy.rating) ? 'filled' : ''}`}></i>
                  ))}
                </div>
                <span className="rating-text">{buddy.rating} ({buddy.reviewCount.toLocaleString()} reviews)</span>
              </div>
              <div className="buddy-profile-tags">
                {buddy.interests.map((interest, index) => (
                  <span key={index} className="buddy-tag">{interest}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="buddy-profile-content">
          <div className="buddy-profile-tabs">
            <div className={`tab ${activeTab === 'about' ? 'active' : ''}`} 
                 onClick={() => setActiveTab('about')}>About</div>
            <div className={`tab ${activeTab === 'trips' ? 'active' : ''}`}
                 onClick={() => setActiveTab('trips')}>Featured Trips</div>
            <div className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
                 onClick={() => setActiveTab('reviews')}>Reviews</div>
            <div className={`tab ${activeTab === 'gallery' ? 'active' : ''}`}
                 onClick={() => setActiveTab('gallery')}>Gallery</div>
          </div>
          
          <div className="tab-content">
            {activeTab === 'about' && (
              <div className="about-section">
                <div className="bio-section">
                  <h3>Bio</h3>
                  <p>{buddy.bio}</p>
                </div>
                
                <div className="details-grid">
                  <div className="detail-item">
                    <h4>Languages</h4>
                    <div className="languages-list">
                      {buddy.languages.map((language, index) => (
                        <div key={index} className="language-tag">{language}</div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <h4>Experience</h4>
                    <div className="experience-text">{buddy.experience}</div>
                  </div>
                  
                  <div className="detail-item">
                    <h4>Specialties</h4>
                    <ul className="specialties-list">
                      {buddy.specialties.map((specialty, index) => (
                        <li key={index}>{specialty}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'trips' && (
              <div className="trips-section">
                <div className="featured-trips-grid">
                  {buddy.featuredTrips?.map((trip, index) => (
                    <div key={index} className="trip-card">
                      <div className="trip-img">
                        <img src={trip.image} alt={trip.title} />
                      </div>
                      <div className="trip-info">
                        <h3>{trip.title}</h3>
                        <p>{trip.description}</p>
                        <div className="trip-price">{trip.price}</div>
                        <button className="btn view-trip-btn">View Trip Details</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="reviews-section">
                <p>Reviews will be displayed here.</p>
                {/* Reviews content would go here */}
              </div>
            )}
            
            {activeTab === 'gallery' && (
              <div className="gallery-section">
                <p>Gallery will be displayed here.</p>
                {/* Gallery content would go here */}
              </div>
            )}
          </div>
        </div>
        
        <div className="buddy-profile-actions">
          <button className="btn message-btn">
            <i className="fas fa-comment"></i> Message
          </button>
          <button className="btn connect-btn">
            <i className="fas fa-user-plus"></i> Connect
          </button>
          <button className="btn plan-trip-btn">
            <i className="fas fa-route"></i> Plan Trip Together
          </button>
        </div>
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

export default BuddyDetail;
