import React from 'react';


const FeedbackSuccess: React.FC = () => {
  return (
    <div className="d-flex justify-content-center align-items-center  text-white" style={{ minHeight: '100vh', flexDirection: 'column' }}>
      <div className="card bg-dark text-white p-4 bg-secondary text-center" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className="mb-3">Thank you for your feedback!</h2>
        <p className="mb-4">We truly appreciate your time and input. It helps us grow and improve your experience.</p>
      </div>
    </div>
  );
};

export default FeedbackSuccess; 