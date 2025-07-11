import React from 'react';
import './ServiceCard.css';

const ServiceCard = ({ service }) => (
  <div className="service-card">
    <img src={service.image} alt={service.title} className="service-image" />
    <h4 className="service-title">{service.title}</h4>
    <p className="service-description">{service.description}</p>
  </div>
);

export default ServiceCard;
