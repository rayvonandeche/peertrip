import React from 'react';

const Grid = ({ children, className = "destinations-grid" }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default Grid;
