import React from 'react';

const Modal = ({ isOpen, onClose, title, children, switchText, onSwitchClick }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" style={{ display: 'flex' }} onClick={handleOverlayClick}>
      <div className="modal">
        <button className="close-modal" onClick={onClose}>
          &times;
        </button>
        <h2>{title}</h2>
        {children}
        {switchText && onSwitchClick && (
          <p className="modal-switch">
            {switchText.text}{' '}
            <a href="#" onClick={onSwitchClick}>
              {switchText.linkText}
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default Modal;
