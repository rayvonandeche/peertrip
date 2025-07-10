import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AIAssistantFab from '../components/common/AIAssistantFab';
import BookingForm from '../components/booking/BookingForm';
import './../styles.css';
import destinationDetails from '../data/destinationDetails.json';

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    // Find the destination with matching ID
    const destinationId = parseInt(id);
    const foundDestination = destinationDetails.destinations.find(dest => dest.id === destinationId);
    
    if (foundDestination) {
      setDestination(foundDestination);
      setActiveImage(foundDestination.image);
    } else {
      console.error(`Destination with ID ${id} not found`);
    }
    
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading destination details...</p>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="not-found-container">
        <h2>Destination Not Found</h2>
        <p>Sorry, we couldn't find the destination you're looking for.</p>
        <button className="btn primary-btn" onClick={() => navigate('/')}>Return to Home</button>
      </div>
    );
  }

  return (
    <div>
      <Navbar activeRoute="/discover" />
      
      <div className="destination-detail-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
        
        <div className="destination-detail-header">
          <h1>{destination.name}</h1>
          <div className="destination-meta">
            <div className="rating-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <i key={i} 
                   className={`fas fa-star ${i < Math.floor(destination.rating) ? 'filled' : i < destination.rating ? 'half-filled' : ''}`}></i>
              ))}
              <span className="rating-number">{destination.rating}</span>
              <span className="review-count">({destination.reviewCount.toLocaleString()} reviews)</span>
            </div>
            <div className="location-info">
              <i className="fas fa-map-marker-alt"></i> {destination.location.region}
            </div>
          </div>
        </div>

        <div className="destination-gallery">
          <div className="main-image">
            <img src={activeImage} alt={destination.name} />
          </div>
          <div className="gallery-thumbnails">
            <img 
              src={destination.image} 
              alt={`Main ${destination.name}`} 
              onClick={() => setActiveImage(destination.image)}
              className={activeImage === destination.image ? 'active' : ''}
            />
            {destination.gallery?.map((image, index) => (
              <img 
                key={index} 
                src={image} 
                alt={`${destination.name} - ${index + 1}`}
                onClick={() => setActiveImage(image)}
                className={activeImage === image ? 'active' : ''}
              />
            ))}
          </div>
        </div>

        <div className="destination-content">
          <div className="destination-main-info">
            <section className="description">
              <h2>Overview</h2>
              <p className="full-description">{destination.fullDescription}</p>
            </section>

            <section className="features">
              <h2>Features</h2>
              <div className="feature-list">
                {destination.features?.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <i className="fas fa-check"></i> {feature}
                  </div>
                ))}
              </div>
            </section>

            {destination.bestTime && (
              <section className="best-time">
                <h2>Best Time to Visit</h2>
                <p>{destination.bestTime.description}</p>
                <div className="season-highlights">
                  {destination.bestTime.seasons?.map((season, index) => (
                    <div key={index} className="season">
                      <h4>{season.name}</h4>
                      <p>{season.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {destination.thingsToDo && (
              <section className="things-to-do">
                <h2>Things to Do</h2>
                <div className="activities-grid">
                  {destination.thingsToDo.map((activity, index) => (
                    <div key={index} className="activity-card">
                      <h4>{activity.name}</h4>
                      <p>{activity.description}</p>
                      {activity.price && <div className="activity-price">{activity.price}</div>}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="destination-sidebar">
            <div className="booking-widget">
              <h3>Plan Your Visit</h3>
              <div className="price-info">
                <div className="price-label">Starting from:</div>
                <div className="price-value">{destination.price}</div>
              </div>
              
              <BookingForm 
                destination={{
                  id: destination.id,
                  name: destination.name,
                  price_per_day: destination.pricePerDay || 15000,
                  category: destination.category || 'adventure'
                }}
                onBookingSuccess={(result) => {
                  console.log('Booking successful:', result);
                }}
              />
              
              <div className="booking-actions">
                <button className="btn save-btn">
                  <i className="far fa-heart"></i> Save to Wishlist
                </button>
                <button className="btn share-btn">
                  <i className="fas fa-share"></i> Share
                </button>
              </div>
            </div>

            {destination.location && (
              <div className="map-widget">
                <h3>Location</h3>
                <div className="map-placeholder">
                  <div className="map-info">
                    <p><strong>Region:</strong> {destination.location.region}</p>
                    <p><strong>Coordinates:</strong> {destination.location.coordinates}</p>
                    {destination.location.distance && (
                      <p><strong>Distance:</strong> {destination.location.distance}</p>
                    )}
                  </div>
                  <button className="btn map-btn">
                    <i className="fas fa-map-marked-alt"></i> View on Map
                  </button>
                </div>
              </div>
            )}
          </div>
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

export default DestinationDetail;
