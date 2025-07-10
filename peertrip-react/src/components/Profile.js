
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import backendService from '../services/backendService';
import Navbar from './common/Navbar';
import Footer from './common/Footer';
import AIAssistantFab from './common/AIAssistantFab';
import './../styles.css';

const Profile = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const bookingsResult = await backendService.getUserBookings();
        
        if (bookingsResult.success) {
          setBookings(bookingsResult.bookings || []);
        } else {
          console.error('Failed to fetch bookings:', bookingsResult.message);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

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
    return (
      <div>
        <Navbar activeRoute="/profile" />
        <main style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Please sign in to view your profile</h2>
        </main>
        <Footer />
      </div>
    );
  }
  return (
    <div>
      <Navbar 
        activeRoute="/profile"
      />
      <main>
        {/* Profile Section */}
        <section className="profile-section">
          <div className="profile-avatar-container">
            <img src="/assets/giraffe.png" alt="Alex Kimani" className="profile-avatar" />
          </div>
          <div className="profile-name">Alex Kimani</div>
          <div className="profile-location"><i className="fas fa-map-marker-alt"></i> Nairobi, Kenya</div>
          <div className="profile-bio">
            Safari enthusiast, techie, and foodie. Loves Maasai Mara and Diani Beach. Lead Developer at Peer Trips.
          </div>
          <div className="profile-tags">
            <span className="profile-tag">Safari</span>
            <span className="profile-tag">Food</span>
            <span className="profile-tag">Tech</span>
          </div>
          <div className="profile-actions">
            <button className="profile-btn">Edit Profile</button>
            <button className="profile-btn">Message</button>
          </div>
        </section>
        {/* Reviews Section */}
        <section className="reviews-section">
          <div className="reviews-title">Recent Reviews</div>
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
          <div className="review-card">
            <div className="review-header">
              <img src="/assets/elephant.png" alt="Grace Muthoni" className="review-avatar" />
              <span className="reviewer-name">Grace Muthoni</span>
              <span className="review-rating">★★★★★</span>
            </div>
            <div className="review-text">
              We organized a group trip to Diani Beach. Alex handled all the logistics perfectly. Would travel again!
            </div>
            <div className="review-date">March 2025</div>
          </div>
        </section>
      </main>
      
      <AIAssistantFab aiAssistant={{
        href: "/ai-assistant",
        title: "Chat with KenyaBot",
        icon: "fas fa-robot"
      }} />

      <Footer />
    </div>
  );
};

export default Profile;
