import React from 'react';
import FeedbackForm from '../components/forms/FeedbackForm';

const PublicFeedback: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">We Value Your Feedback</h1>
          <p className="mt-2 text-gray-600">Please share your thoughts with us</p>
        </div>
        <FeedbackForm />
      </div>
    </div>
  );
};

export default PublicFeedback; 