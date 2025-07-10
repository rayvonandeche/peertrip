class BackendService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    this.token = localStorage.getItem('auth_token');
  }

  // Set auth token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Get auth headers
  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` })
    };
  }

  // Generic API call method
  async apiCall(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: this.getAuthHeaders(),
        ...options
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'API call failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, message: error.message };
    }
  }

  // Authentication methods
  async signUp(userData) {
    const result = await this.apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    if (result.success && result.token) {
      this.setToken(result.token);
    }

    return result;
  }

  async signIn(email, password) {
    const result = await this.apiCall('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (result.success && result.token) {
      this.setToken(result.token);
    }

    return result;
  }

  signOut() {
    this.setToken(null);
    return { success: true };
  }

  // Profile methods
  async getProfile() {
    return await this.apiCall('/auth/profile');
  }

  async updateProfile(userData) {
    return await this.apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  // Destinations methods
  async getDestinations() {
    return await this.apiCall('/destinations');
  }

  async getDestination(id) {
    return await this.apiCall(`/destinations/${id}`);
  }

  // Booking methods
  async createBooking(bookingData) {
    return await this.apiCall('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  }

  async getUserBookings() {
    return await this.apiCall('/bookings');
  }

  // AI Context methods
  async getAIContext() {
    return await this.apiCall('/ai/context');
  }

  async saveChatHistory(message, response) {
    return await this.apiCall('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, response })
    });
  }

  async updateUserPreferences(preferences) {
    return await this.apiCall('/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences)
    });
  }

  // Health check
  async healthCheck() {
    return await this.apiCall('/health');
  }
}

export default new BackendService();