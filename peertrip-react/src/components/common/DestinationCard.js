import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import backendService from '../../services/backendService';

const DestinationCard = ({ destination }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isBooking, setIsBooking] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);
  const { id, name, image, badge, description, highlights, rating, reviews, price, period, buttonText } = destination;

  const handleCardClick = () => {
    navigate(`/destination/${id}`);
  };

  const handleBooking = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      alert('Please log in to book this destination');
      navigate('/login');
      return;
    }

    setIsBooking(true);
    setBookingStatus(null);

    try {
      // Debug the destination data
      console.log('Destination data:', destination);
      console.log('User data:', user);
      
      const bookingData = {
        tripId: (id || destination.id || 'DEST_' + Date.now()).toString(),
        tripTitle: name || destination.name || 'Destination Experience',
        destination: name || destination.name || 'Kenya',
        duration: `1 ${period || destination.period || 'day'}`,
        price: typeof price === 'number' ? price : 
               (typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : 
               (destination.price ? (typeof destination.price === 'number' ? destination.price : parseFloat(destination.price.toString().replace(/[^0-9.]/g, ''))) : 15000)),
        currency: 'KSH',
        maxPeople: 4,
        bookingDate: new Date().toISOString(),
        status: 'pending'
      };

      console.log('Creating booking with data:', bookingData);
      const result = await backendService.createBooking(bookingData);
      
      if (result.success) {
        setBookingStatus('success');
        setTimeout(() => {
          alert('Booking created successfully! Check your profile for details.');
        }, 500);
      } else {
        throw new Error(result.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setBookingStatus('error');
      alert(`Booking failed: ${error.message}`);
    } finally {
      setIsBooking(false);
      setTimeout(() => setBookingStatus(null), 3000);
    }
  };

  const formatPrice = () => {
    if (typeof price === 'string') return price;
    return `KSH ${price.toLocaleString()}`;
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
      stars += '★';
    }
    if (hasHalfStar) {
      stars += '☆';
    }
    while (stars.length < 5) {
      stars += '☆';
    }
    
    return stars;
  };

  return (
    <div className="destination-card" onClick={handleCardClick}>
      <div className="destination-image-container">
        <img src={image} alt={name} className="destination-image" />
        <div className="destination-badge">{badge}</div>
      </div>
      <div className="destination-info">
        <h3 className="destination-name">{name}</h3>
        <p className="destination-description">{description}</p>
        <div className="destination-highlights">
          {highlights?.map((highlight, index) => (
            <span key={index} className="highlight-tag">{highlight}</span>
          ))}
        </div>
        <div className="destination-meta">
          <div className="rating">
            <span className="stars">{renderStars(rating)}</span>
            <span className="rating-text">{rating} ({reviews?.toLocaleString()} reviews)</span>
          </div>
          <div className="price">
            {formatPrice()}
            {period && <span className="price-period">/{period}</span>}
          </div>
        </div>
        <button 
          className={`view-details-btn ${isBooking ? 'booking' : ''} ${bookingStatus ? bookingStatus : ''}`}
          onClick={handleBooking}
          disabled={isBooking}
        >
          {isBooking ? (
            <>
              <span className="spinner"></span>
              Booking...
            </>
          ) : bookingStatus === 'success' ? (
            'Booked!'
          ) : bookingStatus === 'error' ? (
            'Try Again'
          ) : (
            buttonText || "Book Now"
          )}
        </button>
      </div>
    </div>
  );
};

export default DestinationCard;
