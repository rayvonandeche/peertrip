import backendService from './backendService';

class BookingService {
  // Create a new booking
  async createBooking(bookingData) {
    try {
      const result = await backendService.createBooking(bookingData);
      
      if (result.success) {
        return {
          success: true,
          message: 'Booking created successfully!',
          bookingId: result.bookingId
        };
      } else {
        return {
          success: false,
          message: result.message || 'Failed to create booking'
        };
      }
    } catch (error) {
      console.error('Booking service error:', error);
      return {
        success: false,
        message: 'Booking service unavailable. Please try again later.'
      };
    }
  }

  // Get user's bookings
  async getUserBookings() {
    try {
      const result = await backendService.getUserBookings();
      
      if (result.success) {
        return {
          success: true,
          bookings: result.bookings || []
        };
      } else {
        return {
          success: false,
          message: result.message || 'Failed to fetch bookings',
          bookings: []
        };
      }
    } catch (error) {
      console.error('Booking service error:', error);
      return {
        success: false,
        message: 'Unable to fetch bookings',
        bookings: []
      };
    }
  }

  // Calculate trip price
  calculateTripPrice(pricePerDay, numDays, numPeople) {
    const basePrice = pricePerDay * numDays * numPeople;
    const tax = basePrice * 0.16; // 16% VAT in Kenya
    const serviceFee = basePrice * 0.05; // 5% service fee
    
    return {
      basePrice,
      tax,
      serviceFee,
      totalPrice: basePrice + tax + serviceFee
    };
  }

  // Calculate number of days between dates
  calculateDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1; // Minimum 1 day
  }

  // Validate booking data
  validateBookingData(bookingData) {
    const errors = [];

    if (!bookingData.destination_id && !bookingData.destinationId) {
      errors.push('Destination is required');
    }

    if (!bookingData.trip_title || bookingData.trip_title.trim().length < 3) {
      errors.push('Trip title must be at least 3 characters');
    }

    if (!bookingData.start_date && !bookingData.startDate) {
      errors.push('Start date is required');
    }

    if (!bookingData.end_date && !bookingData.endDate) {
      errors.push('End date is required');
    }

    const startDate = bookingData.start_date || bookingData.startDate;
    const endDate = bookingData.end_date || bookingData.endDate;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start < today) {
        errors.push('Start date cannot be in the past');
      }

      if (end <= start) {
        errors.push('End date must be after start date');
      }
    }

    const numPeople = bookingData.num_people || bookingData.guests;
    if (!numPeople || numPeople < 1) {
      errors.push('Number of people must be at least 1');
    }

    if (numPeople && numPeople > 20) {
      errors.push('Maximum 20 people per booking');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Format booking for display
  formatBooking(booking) {
    return {
      ...booking,
      formattedStartDate: new Date(booking.start_date).toLocaleDateString(),
      formattedEndDate: new Date(booking.end_date).toLocaleDateString(),
      formattedPrice: new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES'
      }).format(booking.total_price),
      statusColor: this.getStatusColor(booking.status),
      daysUntilTrip: this.getDaysUntilTrip(booking.start_date)
    };
  }

  // Get status color for UI
  getStatusColor(status) {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  // Calculate days until trip
  getDaysUntilTrip(startDate) {
    const today = new Date();
    const tripDate = new Date(startDate);
    const diffTime = tripDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return 'Trip completed';
    } else if (diffDays === 0) {
      return 'Today!';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else {
      return `${diffDays} days`;
    }
  }

  // Generate booking reference
  generateBookingReference() {
    const prefix = 'PT';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 3).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }
}

export default new BookingService();