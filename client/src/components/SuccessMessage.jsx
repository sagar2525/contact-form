import React from 'react';

const SuccessMessage = ({ onReset }) => {
    return (
        <div className="success-container">
            <div className="success-icon">✓</div>
            <h2>Message Sent!</h2>
            <p>Thank you for reaching out. We have received your message.</p>
            <button onClick={onReset} className="btn-primary">
                Send Another Message
            </button>
        </div>
    );
};

export default SuccessMessage;
