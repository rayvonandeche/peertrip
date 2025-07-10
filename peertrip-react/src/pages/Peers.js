
import React, { useState } from 'react';
import buddiesData from '../data/buddies.json';
import Navbar from '../components/common/Navbar';
import Section from '../components/common/Section';
import Grid from '../components/common/Grid';
import BuddyCard from '../components/common/BuddyCard';
import Footer from '../components/common/Footer';
import AIAssistantFab from '../components/common/AIAssistantFab';
import './../styles.css';

const Peers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter buddies based on search term
  const filteredBuddies = buddiesData.buddies.filter(buddy =>
    buddy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    buddy.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    buddy.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    buddy.tags.some(tag => 
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div>
      <Navbar 
        activeRoute="/peers"
      />

      <main>
        <section className="hero-section">
          <h1 className="hero-title">{buddiesData.hero.title}</h1>
          <p className="hero-subtitle">{buddiesData.hero.subtitle}</p>
          <div className="buddy-search-container">
            <input 
              type="text" 
              className="buddy-search-input" 
              placeholder={buddiesData.hero.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="buddy-search-btn">
              <i className="fas fa-search"></i> Search
            </button>
          </div>
        </section>

        <Section title="Featured Buddies">
          <Grid className="buddies-grid">
            {filteredBuddies.map(buddy => (
              <BuddyCard 
                key={buddy.id} 
                buddy={buddy} 
              />
            ))}
          </Grid>
        </Section>
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

export default Peers;
