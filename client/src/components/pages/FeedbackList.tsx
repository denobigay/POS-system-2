import React, { useEffect, useState } from 'react';
import axios from '../../AxiosInstance';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';

interface FeedbackItem {
  feedback_id: number;
  order_id: number;
  rating: number | null;
  comment: string | null;
  email: string | null;
  created_at: string;
  order: {
    customer_name: string;
    customer_email: string;
  };
}

const FeedbackList: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('/api/loadFeedbacks');
        setFeedbacks(response.data.feedbacks);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error loading feedbacks');
        toast.error(err.response?.data?.message || 'Error loading feedbacks');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="d-flex align-items-center">
          <span className="text-white fw-bold fs-4 me-2">Loading </span>
          <div className="spinner-border text-danger" role="status" style={{ width: '1.5rem', height: '1.5rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-danger">Error: {error}</div>;
  }

  return (
    <div className="container-fluid p-4 bg-dark text-white rounded" style={{ minHeight: '100vh' }}>
      <h2 className="mb-4">Customer Feedbacks</h2>
      {feedbacks.length === 0 ? (
        <p>No feedback submitted yet.</p>
      ) : (
        <div className="row">
          {feedbacks.map((feedback) => (
            <div key={feedback.feedback_id} className="col-md-6 col-lg-4 mb-4">
              <div className="card bg-white text-dark h-100">
                <div className="card-body">
                  <h5 className="card-title">Order ID: #{feedback.order_id}</h5>
                  {feedback.order && (
                    <p className="card-text mb-1">Customer: {feedback.order.customer_name} ({feedback.order.customer_email})</p>
                  )}
                  {feedback.rating !== null && (
                    <div className="mb-2">
                      Rating: {
                        [...Array(5)].map((_, index) => (
                          <FaStar
                            key={index}
                            color={index < (feedback.rating || 0) ? "#ffc107" : "#e4e5e9"}
                            size={20}
                          />
                        ))
                      }
                    </div>
                  )}
                  {feedback.comment && (
                    <p className="card-text">Comment: {feedback.comment}</p>
                  )}
                  {feedback.email && (
                    <p className="card-text">Submitted by: {feedback.email}</p>
                  )}
                  <p className="card-text"><small className="text-muted">Date: {new Date(feedback.created_at).toLocaleString()}</small></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackList; 