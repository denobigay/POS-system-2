import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../AxiosInstance";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const FeedbackForm: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>("");
  const [email] = useState<string>("");
  const [hover, setHover] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    console.log("FeedbackForm mounted. Order ID from URL:", orderId);
    if (!orderId) {
      console.error("Order ID is missing in URL parameters!");
      
    }
  }, [orderId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    console.log("Submitting feedback for order:", orderId, {
      rating,
      comment,
      email,
    });

    try {
      const response = await axios.post("/api/feedback", {
        order_id: orderId,
        rating,
        comment,
        email,
      });
      toast.success(response.data.message);
      console.log("Feedback submitted successfully:", response.data);
      navigate("/feedback-success");
    } catch (error: any) {
      console.error(
        "Error during feedback submission:",
        error.response?.data || error.message || error
      );
      toast.error(error.response?.data?.message || "Error submitting feedback");
    } finally {
      setSubmitting(false);
    }
  };

  if (!orderId) {
    return (
      <div
        className="d-flex justify-content-center align-items-center bg-dark text-white"
        style={{ minHeight: "100vh" }}
      >
        <div
          className="card p-4 bg-secondary text-center"
          style={{ maxWidth: "500px", width: "100%" }}
        >
          <h2 className="mb-3">Error: Order ID not found.</h2>
          <p className="mb-4">
            Please ensure you are accessing this page from a valid feedback
            link.
          </p>
          <Link to="/" className="btn btn-primary">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4  text-white" style={{ minHeight: "100vh" }}>
      <div className="card p-4 bg-dark text-white" style={{ maxWidth: "550px", width: "100%", margin: "0 auto" }}>
        <h2 className="text-center mb-2">We'd love to hear your thoughts!</h2>
       <p className="text-center mb-4">Please take a moment to share your feedback and rate your experience your input helps us improve and serve you better.</p>
        <form onSubmit={handleSubmit}>
          
          <div className="mb-3 ">
           
            <textarea
              id="comment"
              className="form-control bg-white text-dark border-secondary"
              rows={5}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-3 d-flex align-items-center justify-content-center">
            
            <div className="text-center">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={ratingValue} style={{ marginRight: "10px" }}>
                    <input
                      type="radio"
                      name="rating"
                      value={ratingValue}
                      onClick={() => setRating(ratingValue)}
                      style={{ display: "none" }}
                    />
                    <FaStar
                      className="star"
                      color={ratingValue <= (hover || rating || 0) ? "#ffc107" : "#e4e5e9"}
                      size={40}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(null)}
                      style={{ cursor: "pointer" }}
                    />
                  </label>
                );
              })}
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
