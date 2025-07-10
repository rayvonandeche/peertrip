import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import backendService from '../../services/backendService';
import '../tripCardStyles.css';

const TripCard = ({ trip }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isBooking, setIsBooking] = useState(false);
  
  const handleCardClick = () => {
    navigate(`/trip/${trip.id}`);
  };

  const handleBookNow = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      navigate('/signin');
      return;
    }

    setIsBooking(true);
    try {
      const bookingData = {
        tripId: trip.id,
        tripTitle: trip.title,
        destination: trip.location,
        duration: trip.duration,
        price: trip.price,
        currency: trip.currency,
        maxPeople: trip.maxPeople,
        bookingDate: new Date().toISOString(),
        status: 'pending'
      };

      const result = await backendService.createBooking(bookingData);
      
      if (result.success) {
        alert(`🎉 Booking successful! Your booking ID is ${result.bookingId}`);
        // Optionally navigate to a booking confirmation page
        // navigate(`/booking-confirmation/${result.bookingId}`);
      } else {
        alert(`❌ Booking failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('❌ Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const getBadgeClass = (badgeType) => {
    const baseClass = "trip-badge";
    switch(badgeType) {
      case 'success': return `${baseClass} badge-success`;
      case 'info': return `${baseClass} badge-info`;
      case 'warning': return `${baseClass} badge-warning`;
      case 'danger': return `${baseClass} badge-danger`;
      case 'primary': return `${baseClass} badge-primary`;
      case 'secondary': return `${baseClass} badge-secondary`;
      default: return baseClass;
    }
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

  return (
    <div className="trip-card" onClick={handleCardClick}>
      <div className="trip-image">
        <img src={trip.image} alt={trip.title} />
        <div className={getBadgeClass(trip.badgeType)}>{trip.badge}</div>
      </div>
      
      <div className="trip-content">
        {trip.aiRecommendation && (
          <div className="ai-suggestion">
            <h4><i className="fas fa-robot"></i> AI Recommendation</h4>
            <p>{trip.aiRecommendation}</p>
          </div>
        )}
        
        <h3 className="trip-title">{trip.title}</h3>
        <p className="trip-description">{trip.description}</p>

        <div className="trip-details">
          <div className="detail-item">
            <i className="fas fa-calendar"></i>
            <span>{trip.duration}</span>
          </div>
          <div className="detail-item">
            <i className="fas fa-users"></i>
            <span>{trip.maxPeople}</span>
          </div>
          <div className="detail-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>{trip.location}</span>
          </div>
          <div className="detail-item">
            <i className="fas fa-check-circle"></i>
            <span>{trip.included}</span>
          </div>
        </div>

        <div className="trip-rating">
          {renderStars(trip.rating)}
          <span className="rating-score">{trip.rating}</span>
          <span className="review-count">({trip.reviewCount.toLocaleString()} reviews)</span>
        </div>

        <div className="trip-price">
          <div className="price-info">
            <div className="price">{trip.currency} {formatPrice(trip.price)}</div>
            <div className="price-per">{trip.priceUnit}</div>
          </div>
          <button 
            className="book-btn" 
            onClick={handleBookNow}
            disabled={isBooking}
          >
            {isBooking ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Booking...
              </>
            ) : (
              'Book Now'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
