import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AIAssistantFab from '../components/common/AIAssistantFab';
import backendService from '../services/backendService';
import './../styles.css';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    loadUserData();
  }, [user, navigate]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load user profile
      const profileResult = await backendService.getUserProfile();
      if (profileResult.success) {
        setUserProfile(profileResult.user);
        setEditData(profileResult.user);
      }

      // Load user bookings
      const bookingsResult = await backendService.getUserBookings();
      if (bookingsResult.success) {
        setBookings(bookingsResult.bookings);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setEditMode(true);
  };

  const handleSaveProfile = async () => {
    try {
      // Here you would save the profile data
      console.log('Saving profile:', editData);
      setUserProfile(editData);
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    setEditData(userProfile);
    setEditMode(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE').format(price);
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div>
        <Navbar activeRoute="/profile" />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar activeRoute="/profile" />
      
      <main>
        {/* Profile Header */}
        <section className="profile-section">
          <div className="profile-avatar-container">
            <img 
              src={userProfile?.avatar || "/assets/giraffe.png"} 
              alt={userProfile?.name || "User"} 
              className="profile-avatar" 
            />
          </div>
          
          {editMode ? (
            <div className="edit-profile-form">
              <input
                type="text"
                value={editData.name || ''}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
                placeholder="Your Name"
                className="edit-input"
              />
              <input
                type="text"
                value={editData.location || ''}
                onChange={(e) => setEditData({...editData, location: e.target.value})}
                placeholder="Your Location"
                className="edit-input"
              />
              <textarea
                value={editData.bio || ''}
                onChange={(e) => setEditData({...editData, bio: e.target.value})}
                placeholder="Tell us about yourself..."
                rows={3}
                className="edit-textarea"
              />
              <div className="edit-actions">
                <button className="profile-btn save-btn" onClick={handleSaveProfile}>
                  Save Changes
                </button>
                <button className="profile-btn cancel-btn" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="profile-name">{userProfile?.name || user?.name || "Alex Kimani"}</div>
              <div className="profile-location">
                <i className="fas fa-map-marker-alt"></i> {userProfile?.location || "Nairobi, Kenya"}
              </div>
              <div className="profile-bio">
                {userProfile?.bio || "Safari enthusiast, techie, and foodie. Loves Maasai Mara and Diani Beach. Lead Developer at Peer Trips."}
              </div>
              <div className="profile-tags">
                <span className="profile-tag">Safari</span>
                <span className="profile-tag">Food</span>
                <span className="profile-tag">Tech</span>
              </div>
              <div className="profile-actions">
                <button className="profile-btn" onClick={handleEditProfile}>Edit Profile</button>
                <button className="profile-btn logout-btn" onClick={handleLogout}>Logout</button>
              </div>
            </>
          )}
        </section>

        {/* Profile Tabs */}
        <section className="profile-tabs-section">
          <div className="profile-tabs">
            <button 
              className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile Info
            </button>
            <button 
              className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              My Bookings ({bookings.length})
            </button>
            <button 
              className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
            <button 
              className={`tab ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              Preferences
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'profile' && (
              <div className="profile-info-section">
                <h3>Account Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Email:</label>
                    <span>{userProfile?.email || user?.email}</span>
                  </div>
                  <div className="info-item">
                    <label>Member Since:</label>
                    <span>{formatDate(userProfile?.created_at || new Date())}</span>
                  </div>
                  <div className="info-item">
                    <label>Total Bookings:</label>
                    <span>{bookings.length}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="bookings-section">
                <h3>My Travel Bookings</h3>
                {bookings.length > 0 ? (
                  <div className="bookings-grid">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="booking-card">
                        <div className="booking-header">
                          <h4>{booking.trip_title}</h4>
                          <span className={`booking-status ${booking.status}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <div className="booking-details">
                          <p><i className="fas fa-map-marker-alt"></i> {booking.destination}</p>
                          <p><i className="fas fa-clock"></i> {booking.duration}</p>
                          <p><i className="fas fa-users"></i> {booking.max_people} people max</p>
                          <p><i className="fas fa-calendar"></i> Booked: {formatDate(booking.booking_date)}</p>
                          <div className="booking-price">
                            {booking.currency} {formatPrice(booking.price)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-bookings">
                    <p>No bookings yet. Start exploring Kenya!</p>
                    <button className="btn explore-btn" onClick={() => navigate('/discover')}>
                      Discover Destinations
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-section">
                <h3>Reviews & Ratings</h3>
                <div className="review-card">
                  <div className="review-header">
                    <img src="/assets/leopard.png" alt="Maria Wanjiru" className="review-avatar" />
                    <span className="reviewer-name">Maria Wanjiru</span>
                    <span className="review-rating">★★★★★</span>
                  </div>
                  <div className="review-text">
                    Alex was an amazing travel buddy! We explored Maasai Mara together and had a fantastic time. Highly recommended for safaris.
                  </div>
                  <div className="review-date">May 2025</div>
                </div>
                <div className="review-card">
                  <div className="review-header">
                    <img src="/assets/rhino.png" alt="John Otieno" className="review-avatar" />
                    <span className="reviewer-name">John Otieno</span>
                    <span className="review-rating">★★★★☆</span>
                  </div>
                  <div className="review-text">Great company for hiking Mount Kenya. Alex is knowledgeable and fun to travel with.</div>
                  <div className="review-date">April 2025</div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="preferences-section">
                <h3>Travel Preferences</h3>
                <div className="preferences-grid">
                  <div className="preference-item">
                    <label>Preferred Travel Style:</label>
                    <select className="preference-select">
                      <option>Adventure</option>
                      <option>Luxury</option>
                      <option>Budget</option>
                      <option>Cultural</option>
                    </select>
                  </div>
                  <div className="preference-item">
                    <label>Group Size Preference:</label>
                    <select className="preference-select">
                      <option>Solo</option>
                      <option>Small Groups (2-5)</option>
                      <option>Medium Groups (6-10)</option>
                      <option>Large Groups (10+)</option>
                    </select>
                  </div>
                  <div className="preference-item">
                    <label>Interests:</label>
                    <div className="interests-checkboxes">
                      <label><input type="checkbox" defaultChecked /> Wildlife Safari</label>
                      <label><input type="checkbox" defaultChecked /> Beach Activities</label>
                      <label><input type="checkbox" /> Mountain Hiking</label>
                      <label><input type="checkbox" defaultChecked /> Cultural Tours</label>
                      <label><input type="checkbox" /> Food Experiences</label>
                    </div>
                  </div>
                </div>
                <button className="btn save-preferences-btn">Save Preferences</button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <AIAssistantFab aiAssistant={{
        href: "/ai-assistant",
        title: "Chat with Peer Ai",
        icon: "fas fa-robot"
      }} />

      <Footer />
    </div>
  );
};

export default Profile;
