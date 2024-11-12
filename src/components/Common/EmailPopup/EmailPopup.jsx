import React from 'react';

function EmailExistsPopup({ onClose, onSendEmail }) {
  return (
    <div className="email-exists-popup">
      <p>Email already exists</p>
      <button onClick={onClose}>OK</button>
      <button onClick={onSendEmail}>Send Email</button>
    </div>
  );
}

export default EmailExistsPopup;
