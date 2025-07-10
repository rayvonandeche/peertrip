import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AIAssistantFab from '../components/common/AIAssistantFab';
import BookingForm from '../components/booking/BookingForm';
import './../styles.css';
import './detailStyles.css';
import '../../src/components/common/tripcard/tripCardStyles.css';
import tripsData from '../data/trips.json';

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the trip with matching ID
    const tripId = parseInt(id);
    const foundTrip = tripsData.trips.find(t => t.id === tripId);
    
    if (foundTrip) {
      setTrip(foundTrip);
    } else {
      console.error(`Trip with ID ${id} not found`);
    }
    
    setLoading(false);
  }, [id]);

  const handleBooking = () => {
    // Handle booking logic here
    console.log(`Booking trip: ${trip.title}`);
    alert(`Booking request submitted for ${trip.title}!`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE').format(price);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="stars">
        {[...Array(fullStars)].map((_, i) => (
          <i key={`full-${i}`} className="fas fa-star"></i>
        ))}
        {hasHalfStar && <i className="fas fa-star-half-alt"></i>}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={`empty-${i}`} className="far fa-star"></i>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading trip details...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="not-found-container">
        <h2>Trip Not Found</h2>
        <p>Sorry, we couldn't find the trip you're looking for.</p>
        <button className="btn primary-btn" onClick={() => navigate('/trips')}>
          Return to Trips
        </button>
      </div>
    );
  }

  return (
    <div>
      <Navbar activeRoute="/trips" />
      
      <div className="detail-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i> Back to Trips
        </button>
        
        <div className="detail-header">
          <div className="detail-image-container">
            <img src={trip.image} alt={trip.title} className="detail-main-image" />
            <div className={`trip-badge badge-${trip.badgeType}`}>{trip.badge}</div>
          </div>
          
          <div className="detail-info">
            <h1 className="detail-title">{trip.title}</h1>
            <p className="detail-description">{trip.description}</p>
            
            <div className="detail-rating">
              {renderStars(trip.rating)}
              <span className="rating-score">{trip.rating}</span>
              <span className="review-count">({trip.reviewCount.toLocaleString()} reviews)</span>
            </div>
            
            <div className="detail-price">
              <span className="price">{trip.currency} {formatPrice(trip.price)}</span>
              <span className="price-unit">{trip.priceUnit}</span>
            </div>
          </div>
        </div>

        {trip.aiRecommendation && (
          <div className="ai-recommendation-section">
            <h3><i className="fas fa-robot"></i> AI Travel Assistant</h3>
            <p>{trip.aiRecommendation}</p>
          </div>
        )}

        <div className="detail-sections">
          <div className="detail-section">
            <h3>Trip Details</h3>
            <div className="trip-details-grid">
              <div className="detail-item">
                <i className="fas fa-calendar"></i>
                <div>
                  <strong>Duration</strong>
                  <span>{trip.duration}</span>
                </div>
              </div>
              <div className="detail-item">
                <i className="fas fa-users"></i>
                <div>
                  <strong>Group Size</strong>
                  <span>{trip.maxPeople}</span>
                </div>
              </div>
              <div className="detail-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <strong>Location</strong>
                  <span>{trip.location}</span>
                </div>
              </div>
              <div className="detail-item">
                <i className="fas fa-check-circle"></i>
                <div>
                  <strong>Included</strong>
                  <span>{trip.included}</span>
                </div>
              </div>
            </div>
          </div>

          {trip.highlights && trip.highlights.length > 0 && (
            <div className="detail-section">
              <h3>Trip Highlights</h3>
              <ul className="highlights-list">
                {trip.highlights.map((highlight, index) => (
                  <li key={index}>
                    <i className="fas fa-check"></i>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="detail-section">
            <h3>What's Included</h3>
            <div className="included-items">
              <div className="included-item">
                <i className="fas fa-bed"></i>
                <span>Accommodation</span>
              </div>
              <div className="included-item">
                <i className="fas fa-utensils"></i>
                <span>Meals as specified</span>
              </div>
              <div className="included-item">
                <i className="fas fa-user-tie"></i>
                <span>Professional guide</span>
              </div>
              <div className="included-item">
                <i className="fas fa-car"></i>
                <span>Transportation</span>
              </div>
            </div>
          </div>
        </div>

        <div className="booking-section">
          <div className="booking-card">
            <div className="booking-price">
              <span className="price">{trip.currency} {formatPrice(trip.price)}</span>
              <span className="price-unit">{trip.priceUnit}</span>
            </div>
            
            <BookingForm 
              destination={{
                id: trip.id,
                name: trip.title,
                price_per_day: trip.price || 25000,
                category: trip.category || 'adventure'
              }}
              onBookingSuccess={(result) => {
                console.log('Trip booking successful:', result);
              }}
            />
            
            <p className="booking-note">Free cancellation up to 24 hours before departure</p>
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

export default TripDetail;
