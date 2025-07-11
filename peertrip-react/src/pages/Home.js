import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AIAssistantFab from '../components/common/AIAssistantFab';
import DestinationCard from '../components/common/DestinationCard';
import BuddyCard from '../components/common/BuddyCard';
import './../styles.css';
import destinationDetailsData from '../data/destinationDetails.json';
import buddyDetailsData from '../data/buddyDetails.json';

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Extract featured destinations from data
  const featuredDestinations = destinationDetailsData.destinations.slice(0, 6);
  
  // Extract featured buddies from data
  const featuredBuddies = buddyDetailsData.buddies.slice(0, 4);

  return (
    <div>
      <Navbar 
        activeRoute="/"
      />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="subtitle">Kenya's #1 Travel Community</div>
          <h1>Explore Kenya Like a Local</h1>
          <p>Join 450K+ travelers discovering amazing experiences with verified reviews, local buddies, and AI-powered planning</p>
          <div className="search-container">
            <input
              type="text"
              placeholder="Where to in Kenya? Nairobi, Mombasa, Maasai Mara, Nakuru..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && navigate(`/discover?search=${encodeURIComponent(searchTerm)}`)}
            />
            <button
              className="search-btn"
              onClick={() => navigate(`/discover?search=${encodeURIComponent(searchTerm)}`)}
            >
              <i className="fas fa-search"></i> Search
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number">2.3M+</div>
            <div className="stat-label">Kenya Experiences</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">950K+</div>
            <div className="stat-label">Verified Reviews</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">450K+</div>
            <div className="stat-label">Travel Buddies</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">24/7</div>
            <div className="stat-label">AI Travel Assistant</div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="featured-destinations">
        <div className="section-header">
          <h2>Top-Rated Kenya Destinations</h2>
          <p>Discover the most loved places in Kenya, rated by real travelers and enhanced by AI recommendations</p>
        </div>
        <div className="destination-grid">
          {featuredDestinations.map(destination => (
            <DestinationCard
              key={destination.id}
              destination={{
                id: destination.id,
                name: destination.name,
                image: destination.image,
                description: destination.description,
                badge: destination.badge || "Featured",
                rating: destination.rating,
                reviews: destination.reviewCount,
                price: destination.price,
                highlights: destination.features?.slice(0, 3).map(feature => feature) || []
              }}
            />
          ))}
        </div>
      </section>

      <section className="image-gallery-showcase">
        <div className="section-header">
          <h2>Glimpses of Kenya</h2>
          <p>A visual journey through the stunning landscapes and vibrant culture of Kenya.</p>
        </div>
        <div className="gallery-grid-index">
          <div className="gallery-item-index"><img src="/assets/watamu beach.png" alt="Watamu Beach" /></div>
          <div className="gallery-item-index"><img src="/assets/traditional dhow.png" alt="Traditional Dhow" /></div>
          <div className="gallery-item-index"><img src="/assets/small aircraft landing.png" alt="Small Aircraft Landing in Safari" /></div>
          <div className="gallery-item-index"><img src="/assets/shela beach.png" alt="Shela Beach Lamu" /></div>
          <div className="gallery-item-index"><img src="/assets/savannah.png" alt="Kenyan Savannah" /></div>
          <div className="gallery-item-index"><img src="/assets/ngong hills.png" alt="Ngong Hills" /></div>
          <div className="gallery-item-index"><img src="/assets/malindi coral reefs.png" alt="Malindi Coral Reefs" /></div>
          <div className="gallery-item-index"><img src="/assets/l naivasha with eaagle.png" alt="Lake Naivasha with Eagle" /></div>
          <div className="gallery-item-index"><img src="/assets/kisumu lakefront.png" alt="Kisumu Lakefront" /></div>
          <div className="gallery-item-index"><img src="/assets/kilifi creek.png" alt="Kilifi Creek" /></div>
          <div className="gallery-item-index"><img src="/assets/wildesbeast.png" alt="Wildebeest Migration" /></div>
          <div className="gallery-item-index"><img src="/assets/buffalo.png" alt="Buffalo" /></div>
          <div className="gallery-item-index"><img src="/assets/image.jpg" alt="Beautiful Kenya Landscape" /></div>
        </div>
      </section>

      {/* Advertisements Section - Balanced Size */}
      <section className="advertisements-section">
        <div className="section-header">
          <h2>Special Offers</h2>
          <p>Exclusive deals from our trusted partners</p>
        </div>
        <div className="balanced-ads-grid">
          <div className="balanced-ad-card">
            <img src="/assets/ad1.jpg" alt="Flight Deals" />
            <div className="balanced-ad-content">
              <h4>Fly to Kenya with Us</h4>
              <p>Discounted flights for your safari adventure</p>
              <button className="balanced-ad-btn">Learn More</button>
            </div>
          </div>
          <div className="balanced-ad-card">
            <img src="/assets/ad2.jpg" alt="Luxury Lodge Deals" />
            <div className="balanced-ad-content">
              <h4>Luxury Lodge Deals</h4>
              <p>Experience Kenya in style with our partner lodges</p>
              <button className="balanced-ad-btn">View Lodges</button>
            </div>
          </div>
          <div className="balanced-ad-card">
            <img src="/assets/ad3.jpg" alt="Adventure Gear" />
            <div className="balanced-ad-content">
              <h4>Adventure Gear</h4>
              <p>Get equipped for your Kenyan expedition</p>
              <button className="balanced-ad-btn">Shop Gear</button>
            </div>
          </div>
        </div>
      </section>

      {/* Travel Buddies Preview */}
      <section className="buddies-preview">
        <div className="section-header">
          <h2>Connect with Verified Travel Buddies</h2>
          <p>Meet trusted local guides and fellow travelers for authentic Kenyan experiences</p>
        </div>
        <div className="buddy-cards">
          {featuredBuddies.map(buddy => (
            <BuddyCard
              key={buddy.id}
              buddy={{
                id: buddy.id,
                name: buddy.name,
                avatar: buddy.avatar,
                location: `${buddy.location} • ${buddy.title}`,
                bio: buddy.bio?.substring(0, 120) + (buddy.bio?.length > 120 ? '...' : ''),
                tags: buddy.interests
              }}
            />
          ))}
        </div>
      </section>

      {/* Team Collaboration Section */}
      <section className="team-section">
        <div className="team-header">
          <h2>Built by Safari Innovators</h2>
          <p>A passionate team of Kenyan tech innovators creating the future of travel</p>
        </div>
        <div className="team-grid">
          <div className="team-member">
            <h3>Alex Kimani - Lead Developer</h3>
            <p>Full-stack engineer specializing in AI integration and user experience design</p>
          </div>
          <div className="team-member">
            <h3>Maria Wanjiru - Product Manager</h3>
            <p>Travel industry expert focusing on community building and local partnerships</p>
          </div>
          <div className="team-member">
            <h3>John Otieno - Data Scientist</h3>
            <p>AI/ML specialist developing smart recommendation engines and travel insights</p>
          </div>
          <div className="team-member">
            <h3>Grace Muthoni - UX Designer</h3>
            <p>Design lead creating intuitive interfaces for seamless travel planning experiences</p>
          </div>
        </div>
      </section>

      <AIAssistantFab aiAssistant={{
        href: "/ai-assistant",
        title: "Ask AI Assistant",
        icon: "fas fa-robot"
      }} />

      <Footer />
    </div>
  );
};

export default Home;
