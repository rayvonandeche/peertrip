import React, { useState } from 'react';
import destinationsData from '../data/destinations.json';
import Navbar from '../components/common/Navbar';
import HeroSection from '../components/common/HeroSection';
import Section from '../components/common/Section';
import Grid from '../components/common/Grid';
import SearchableDestinations from '../components/common/SearchableDestinations';
import CategoryCard from '../components/common/CategoryCard';
import Footer from '../components/common/Footer';
import Modal from '../components/common/Modal';
import AIAssistantFab from '../components/common/AIAssistantFab';
import './../styles.css';

const Discover = () => {
  const [signInModal, setSignInModal] = useState(false);
  const [signUpModal, setSignUpModal] = useState(false);

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

  return (
    <div>
      <Navbar 
        activeRoute="/discover"
      />

      <main>
        <HeroSection 
          hero={destinationsData.hero}
          quickFilters={destinationsData.quickFilters}
        />

        <SearchableDestinations 
          destinations={destinationsData.featuredDestinations}
          title="Featured Destinations in Kenya"
        />

        <Section title="Explore by Experience">
          <Grid className="categories-grid">
            {destinationsData.categories.map(category => (
              <CategoryCard 
                key={category.id} 
                category={category} 
              />
            ))}
          </Grid>
        </Section>
      </main>

      <AIAssistantFab aiAssistant={destinationsData.aiAssistant} />
      
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
