import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BuddyCard = ({ buddy }) => {
  const navigate = useNavigate();
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const { id, name, avatar, location, bio, tags, isInvitation = false } = buddy;

  const handleCardClick = () => {
    navigate(`/buddy/${id}`);
  };

  const handleViewProfile = (e) => {
    e.stopPropagation();
    navigate(`/buddy/${id}`);
  };

  const handleMessage = (e) => {
    e.stopPropagation();
    setShowMessageModal(true);
  };

  const sendMessage = () => {
    if (messageText.trim()) {
      console.log('Sending message to', name, ':', messageText);
      // Here you would integrate with your messaging API
      alert(`Message sent to ${name}: "${messageText}"`);
      setMessageText('');
      setShowMessageModal(false);
    }
  };

  return (
    <>
      <div className="buddy-card" onClick={handleCardClick}>
        <img src={avatar} alt={name} className="buddy-avatar" />
        <div className="buddy-name">{name}</div>
        <div className="buddy-location">
          <i className="fas fa-map-marker-alt"></i> {location}
        </div>
        <div className="buddy-bio">{bio}</div>
        <div className="buddy-tags">
          {tags?.map((tag, index) => (
            <span key={index} className="buddy-tag">{tag}</span>
          ))}
        </div>
        <div className="buddy-actions">
          {isInvitation ? (
            <>
              <button className="buddy-btn" onClick={(e) => e.stopPropagation()}>Join Now</button>
              <button className="buddy-btn" onClick={(e) => e.stopPropagation()}>Learn More</button>
            </>
          ) : (
            <>
              <button className="buddy-btn" onClick={handleViewProfile}>View Profile</button>
              <button className="buddy-btn" onClick={handleMessage}>Message</button>
            </>
          )}
        </div>
      </div>

      {showMessageModal && (
        <div className="modal-overlay" onClick={() => setShowMessageModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowMessageModal(false)}>&times;</button>
            <h2>Message {name}</h2>
            <div className="message-form">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={`Hi ${name}, I'd love to connect about travel opportunities in Kenya!`}
                rows={4}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  margin: '1rem 0',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
              <div className="modal-actions">
                <button 
                  className="btn cancel-btn" 
                  onClick={() => setShowMessageModal(false)}
                  style={{ marginRight: '1rem' }}
                >
                  Cancel
                </button>
                <button 
                  className="btn send-btn" 
                  onClick={sendMessage}
                  disabled={!messageText.trim()}
                >
                  <i className="fas fa-paper-plane"></i> Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BuddyCard;
