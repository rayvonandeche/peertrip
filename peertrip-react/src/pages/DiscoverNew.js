import React, { useState } from 'react';
import siteData from '../data/siteData.json';
import Navbar from '../components/common/Navbar';
import HeroSection from '../components/common/HeroSection';
import Section from '../components/common/Section';
import Grid from '../components/common/Grid';
import DestinationCard from '../components/common/DestinationCard';
import CategoryCard from '../components/common/CategoryCard';
import Footer from '../components/common/Footer';
import Modal from '../components/common/Modal';
import AIAssistantFab from '../components/common/AIAssistantFab';
import './../styles.css';

const Discover = () => {
  const [signInModal, setSignInModal] = useState(false);
  const [signUpModal, setSignUpModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const openSignIn = () => setSignInModal(true);
  const openSignUp = () => setSignUpModal(true);
  const closeSignIn = () => setSignInModal(false);
  const closeSignUp = () => setSignUpModal(false);
  
  const switchToSignUp = (e) => {
    e.preventDefault();
    setSignInModal(false);
    setSignUpModal(true);
  };
  
  const switchToSignIn = (e) => {
    e.preventDefault();
    setSignUpModal(false);
    setSignInModal(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter destinations based on search term
  const filteredDestinations = siteData.featuredDestinations.filter(destination =>
    destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    destination.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    destination.highlights.some(highlight => 
      highlight.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div>
      <Navbar 
        activeRoute="/discover"
        onSignInClick={openSignIn} 
        onSignUpClick={openSignUp} 
      />

      <main>
        <HeroSection 
          hero={siteData.hero}
          quickFilters={siteData.quickFilters}
          onSearch={handleSearch}
        />

        <Section title="Featured Destinations in Kenya">
          <Grid>
            {filteredDestinations.map(destination => (
              <DestinationCard 
                key={destination.id} 
                destination={destination} 
              />
            ))}
          </Grid>
        </Section>

        <Section title="Explore by Experience">
          <Grid className="categories-grid">
            {siteData.categories.map(category => (
              <CategoryCard 
                key={category.id} 
                category={category} 
              />
            ))}
          </Grid>
        </Section>
      </main>

      <AIAssistantFab aiAssistant={siteData.aiAssistant} />
      
      <Footer />

      {/* Auth Modals */}
      <Modal 
        isOpen={signInModal}
        onClose={closeSignIn}
        title="Sign In"
        onSwitch={switchToSignUp}
        switchText="Don't have an account? Sign Up"
        type="signin"
      />

      <Modal 
        isOpen={signUpModal}
        onClose={closeSignUp}
        title="Sign Up"
        onSwitch={switchToSignIn}
        switchText="Already have an account? Sign In"
        type="signup"
      />
    </div>
  );
};

export default Discover;
