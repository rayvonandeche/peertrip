import React from 'react';
import { useNavigate } from 'react-router-dom';

const BuddyCard = ({ buddy }) => {
  const navigate = useNavigate();
  const { id, name, avatar, location, bio, tags, isInvitation = false } = buddy;

  const handleCardClick = () => {
    navigate(`/buddy/${id}`);
  };

  const handleViewProfile = (e) => {
    e.stopPropagation();
    navigate(`/buddy/${id}`);
  };

  return (
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
            <button className="buddy-btn" onClick={(e) => e.stopPropagation()}>Message</button>
          </>
        )}
      </div>
    </div>
  );
};

export default BuddyCard;
