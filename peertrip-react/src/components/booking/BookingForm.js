import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import bookingService from '../../services/bookingService';
import './BookingForm.css';

const BookingForm = ({ destination, onBookingSuccess }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    trip_title: `${destination.name} Adventure`,
    start_date: '',
    end_date: '',
    num_people: 2,
    special_requests: ''
  });
  const [errors, setErrors] = useState([]);
  const [priceBreakdown, setPriceBreakdown] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }

    // Calculate price when relevant fields change
    if (['start_date', 'end_date', 'num_people'].includes(name)) {
      calculatePrice({ ...formData, [name]: value });
    }
  };

  const calculatePrice = (data = formData) => {
    if (data.start_date && data.end_date && data.num_people) {
      const days = bookingService.calculateDays(data.start_date, data.end_date);
      const breakdown = bookingService.calculateTripPrice(
        destination.price_per_day || 15000, 
        days, 
        parseInt(data.num_people)
      );
      setPriceBreakdown(breakdown);
    } else {
      setPriceBreakdown(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    // Validate form data
    const validation = bookingService.validateBookingData({
      ...formData,
      destination_id: destination.id
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsLoading(false);
      return;
    }

    // Calculate final price
    const days = bookingService.calculateDays(formData.start_date, formData.end_date);
    const breakdown = bookingService.calculateTripPrice(
      destination.price_per_day || 15000, 
      days, 
      parseInt(formData.num_people)
    );

    // Create booking
    const bookingData = {
      destinationId: destination.id,
      destinationName: destination.name,
      category: destination.category || 'adventure',
      startDate: formData.start_date,
      endDate: formData.end_date,
      guests: parseInt(formData.num_people),
      totalPrice: breakdown.totalPrice,
      specialRequests: formData.special_requests
    };

    const result = await bookingService.createBooking(bookingData);

    if (result.success) {
      setIsOpen(false);
      setFormData({
        trip_title: `${destination.name} Adventure`,
        start_date: '',
        end_date: '',
        num_people: 2,
        special_requests: ''
      });
      setPriceBreakdown(null);
      
      if (onBookingSuccess) {
        onBookingSuccess(result);
      }
      
      alert('Booking created successfully! Check your profile for booking details.');
    } else {
      setErrors([result.message]);
    }

    setIsLoading(false);
  };

  if (!user) {
    return (
      <div className="booking-form-container">
        <button className="btn btn-primary booking-trigger">
          <i className="fas fa-sign-in-alt"></i>
          Sign in to Book
        </button>
        <p className="booking-note">Please sign in to make a booking</p>
      </div>
    );
  }

  return (
    <div className="booking-form-container">
      <button 
        className="btn btn-primary booking-trigger"
        onClick={() => setIsOpen(true)}
      >
        <i className="fas fa-calendar-plus"></i>
        Book This Experience
      </button>

      {isOpen && (
        <div className="booking-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <div className="booking-modal-header">
              <h3>Book Your Trip to {destination.name}</h3>
              <button 
                className="close-btn"
                onClick={() => setIsOpen(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="booking-form">
              {errors.length > 0 && (
                <div className="error-messages">
                  {errors.map((error, index) => (
                    <div key={index} className="error-message">{error}</div>
                  ))}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="trip_title">Trip Title</label>
                <input
                  type="text"
                  id="trip_title"
                  name="trip_title"
                  value={formData.trip_title}
                  onChange={handleInputChange}
                  required
                  placeholder="Give your trip a name"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="start_date">Start Date</label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="end_date">End Date</label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    required
                    min={formData.start_date || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="num_people">Number of People</label>
                <select
                  id="num_people"
                  name="num_people"
                  value={formData.num_people}
                  onChange={handleInputChange}
                  required
                >
                  {[...Array(20)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'Person' : 'People'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="special_requests">Special Requests (Optional)</label>
                <textarea
                  id="special_requests"
                  name="special_requests"
                  value={formData.special_requests}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Any special requirements or requests..."
                ></textarea>
              </div>

              {priceBreakdown && (
                <div className="price-breakdown">
                  <h4>Price Breakdown</h4>
                  <div className="price-item">
                    <span>Base Price ({bookingService.calculateDays(formData.start_date, formData.end_date)} days × {formData.num_people} people)</span>
                    <span>KSH {priceBreakdown.basePrice.toLocaleString()}</span>
                  </div>
                  <div className="price-item">
                    <span>Service Fee (5%)</span>
                    <span>KSH {priceBreakdown.serviceFee.toLocaleString()}</span>
                  </div>
                  <div className="price-item">
                    <span>VAT (16%)</span>
                    <span>KSH {priceBreakdown.tax.toLocaleString()}</span>
                  </div>
                  <div className="price-item price-total">
                    <span><strong>Total</strong></span>
                    <span><strong>KSH {priceBreakdown.totalPrice.toLocaleString()}</strong></span>
                  </div>
                </div>
              )}

              <div className="booking-form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isLoading || !priceBreakdown}
                >
                  {isLoading ? 'Creating Booking...' : `Book for KSH ${priceBreakdown?.totalPrice?.toLocaleString() || '...'}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
