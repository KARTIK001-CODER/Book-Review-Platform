import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext.jsx';

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`star ${i < fullStars ? 'filled' : ''}`}>★</span>
  ));
};

export default function BookDetails() {
  const { id } = useParams();
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useContext(AuthContext);

  const loadBook = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/books/${id}`);
      setBookData(response.data);
    } catch (error) {
      console.error('Error loading book:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBook();
  }, [id]);

  const handleReview = async () => {
    if (!user) return alert('Please login to leave a review');
    try {
      setSubmitting(true);
      await api.post(`/books/${id}/reviews`, { rating, reviewText: text });
      setText('');
      setRating(5);
      await loadBook();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  if (!bookData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Book not found</h2>
          <p className="text-gray-600 dark:text-gray-300">The book you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const { book, reviews, averageRating, reviewsCount } = bookData;
  const isOwner = user && book.addedBy && user.id === book.addedBy._id;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Book Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{book.title}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">by {book.author}</p>
                <div className="flex items-center gap-4 mb-4">
                  {book.genre && (
                    <span className="bg-secondary-100 dark:bg-secondary-900 text-secondary-800 dark:text-secondary-200 px-3 py-1 rounded-full text-sm font-medium">
                      {book.genre}
                    </span>
                  )}
                  {book.year && (
                    <span className="text-gray-600 dark:text-gray-300">{book.year}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="star-rating">
                    {renderStars(averageRating)}
                  </div>
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {averageRating.toFixed(1)} ({reviewsCount} reviews)
                  </span>
                </div>
                {book.description && (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{book.description}</p>
                )}
              </div>
              
              {isOwner && (
                <Link 
                  to={`/edit/${book._id}`}
                  className="btn btn-primary"
                >
                  ✏️ Edit Book
                </Link>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Reviews Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Reviews</h2>
              
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">No reviews yet</p>
                </div>
              ) : (
                <div className="space-y-6 max-h-96 overflow-y-auto">
                  {reviews.map(review => (
                    <div key={review._id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          {review.userId?.name || 'Anonymous'}
                        </h4>
                        <div className="flex items-center gap-1">
                          <div className="star-rating">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">{review.rating}</span>
                        </div>
                      </div>
                      {review.reviewText && (
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {review.reviewText}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Review Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Leave a Review</h2>
              
              {!user ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Please login to leave a review</p>
                  <Link to="/login" className="btn btn-primary">
                    Login
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rating
                    </label>
                    <select 
                      value={rating} 
                      onChange={e => setRating(Number(e.target.value))}
                      className="w-full"
                    >
                      {[5,4,3,2,1].map(n => (
                        <option key={n} value={n}>{n} stars</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Review
                    </label>
                    <textarea 
                      value={text} 
                      onChange={e => setText(e.target.value)} 
                      placeholder="Share your thoughts about this book..."
                      rows={4}
                      className="w-full"
                    />
                  </div>
                  
                  <button 
                    onClick={handleReview}
                    disabled={submitting}
                    className="btn btn-primary w-full"
                  >
                    {submitting ? (
                      <>
                        <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
