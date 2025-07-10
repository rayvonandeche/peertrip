
import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AIAssistantFab from '../components/common/AIAssistantFab';
import TripCard from '../components/common/tripcard/TripCard';
import tripsData from '../data/trips.json';
import './../styles.css';
import '../../src/components/common/tripcard/tripCardStyles.css';

const Trips = () => {
  const [filters, setFilters] = useState({
    destination: 'All Kenya',
    duration: 'Any Duration',
    budget: 'Any Budget',
    tripType: 'All Types'
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const filteredTrips = tripsData.trips.filter(trip => {
    // Apply filters here if needed
    if (filters.tripType !== 'All Types' && trip.category !== filters.tripType.toLowerCase()) {
      return false;
    }
    // Add more filter logic as needed
    return true;
  });

  return (
    <div>
      <Navbar 
        activeRoute="/trips"
      />

      {/* Hero Section */}
      <section className="trips-hero">
        <div className="hero-content">
          <h1>{tripsData.hero.title}</h1>
          <p>{tripsData.hero.subtitle}</p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="filters-section">
        <div className="filters-container">
          <div className="filter-group">
            <label>Destination</label>
            <select 
              value={filters.destination}
              onChange={(e) => handleFilterChange('destination', e.target.value)}
            >
              {tripsData.filters.destinations.map(dest => (
                <option key={dest} value={dest}>{dest}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Duration</label>
            <select
              value={filters.duration}
              onChange={(e) => handleFilterChange('duration', e.target.value)}
            >
              {tripsData.filters.durations.map(duration => (
                <option key={duration} value={duration}>{duration}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Budget (KSH)</label>
            <select
              value={filters.budget}
              onChange={(e) => handleFilterChange('budget', e.target.value)}
            >
              {tripsData.filters.budgets.map(budget => (
                <option key={budget} value={budget}>{budget}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Trip Type</label>
            <select
              value={filters.tripType}
              onChange={(e) => handleFilterChange('tripType', e.target.value)}
            >
              {tripsData.filters.tripTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <button className="search-btn"><i className="fas fa-search"></i> Search Trips</button>
        </div>
      </section>

      {/* Trips Container */}
      <section className="trips-container">
        <div className="section-header">
          <h2>Featured Kenya Experiences</h2>
          <p>Hand-picked by our local experts and rated by real travelers</p>
        </div>

        <div className="trips-grid">
          {filteredTrips.map(trip => (
            <TripCard key={trip.id} trip={trip} />
          ))}
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

export default Trips;
