import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-dark">
      <div className="text-center text-white">
        <div className="spinner-border text-light mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4>Loading...</h4>
      </div>
    </div>
  );
};

export default LoadingScreen;
