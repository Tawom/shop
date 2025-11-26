import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const ProductReviews = ({ productId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${productId}/reviews`);
      setReviews(response.data.reviews);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!comment.trim()) {
      setError("Please write a comment");
      return;
    }

    try {
      setSubmitLoading(true);
      await api.post(`/products/${productId}/reviews`, {
        rating,
        comment: comment.trim(),
      });

      setSuccessMessage("Review submitted successfully!");
      setComment("");
      setRating(5);
      setShowReviewForm(false);
      fetchReviews();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit review. Please try again."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      await api.delete(`/reviews/${reviewId}`);
      setSuccessMessage("Review deleted successfully");
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete review");
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() =>
              interactive && onRatingChange && onRatingChange(star)
            }
            disabled={!interactive}
            className={`text-2xl ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            } ${
              interactive
                ? "cursor-pointer hover:scale-110 transition-transform"
                : ""
            }`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const userHasReviewed = reviews.some(
    (review) => review.user._id === user?._id
  );

  return (
    <div className="mt-12">
      <div className="border-t pt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Customer Reviews ({reviews.length})
          </h2>
          {user && !userHasReviewed && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {showReviewForm ? "Cancel" : "Write a Review"}
            </button>
          )}
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}

        {/* Review Form */}
        {showReviewForm && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                {renderStars(rating, true, setRating)}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your thoughts about this product..."
                  maxLength={1000}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {comment.length}/1000 characters
                </p>
              </div>

              <button
                type="submit"
                disabled={submitLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
              >
                {submitLoading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        )}

        {/* Reviews List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              No reviews yet. Be the first to review this product!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="p-6 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-gray-900">
                        {review.user.username}
                      </span>
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  {user &&
                    (user._id === review.user._id || user.role === "admin") && (
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    )}
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}

        {!user && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md text-center">
            <p className="text-blue-700">
              Please{" "}
              <a href="/login" className="font-semibold underline">
                sign in
              </a>{" "}
              to write a review
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
