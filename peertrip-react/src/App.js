import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Peers from './pages/Peers';
import Trips from './pages/Trips';
import AIAssistant from './pages/AIAssistant';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import DestinationDetail from './pages/DestinationDetail';
import BuddyDetail from './pages/BuddyDetail';
import CategoryDetail from './pages/CategoryDetail';
import TripDetail from './pages/TripDetail';

const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/discover/category/:id" element={<CategoryDetail />} />
      <Route path="/destination/:id" element={<DestinationDetail />} />
      <Route path="/peers" element={<Peers />} />
      <Route path="/buddy/:id" element={<BuddyDetail />} />
      <Route path="/trips" element={<Trips />} />
      <Route path="/trip/:id" element={<TripDetail />} />
      <Route path="/ai-assistant" element={<AIAssistant />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;