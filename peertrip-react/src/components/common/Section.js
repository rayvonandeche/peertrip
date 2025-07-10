import React from 'react';

const Section = ({ title, children, className = "" }) => {
  return (
    <section className={`section ${className}`}>
      <h2 className="section-title">{title}</h2>
      {children}
    </section>
  );
};

export default Section;
