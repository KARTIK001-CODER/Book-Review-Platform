import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';

const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
  ));
};

export default function Profile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get(`/users/${id}`);
        setData(response.data);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Profile not found</h3>
          <p className="text-gray-600 dark:text-gray-300">The user profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Profile Summary Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-3xl text-white">👤</span>
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{data.user.name}</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{data.user.email}</p>
                
                {/* Stats */}
                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 text-sm">📚</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{data.stats?.totalBooks || 0} Books Added</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-secondary-100 dark:bg-secondary-900 rounded-full flex items-center justify-center">
                      <span className="text-secondary-600 dark:text-secondary-400 text-sm">💬</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{data.stats?.totalReviews || 0} Reviews Written</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* My Books Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">My Books</h2>
              <p className="text-gray-600 dark:text-gray-300">Books you've added to the platform</p>
            </div>
            
            {data.books.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No books added yet</h3>
                <p className="text-gray-600 dark:text-gray-300">You haven't added any books to the platform yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.books.map(book => (
                  <div key={book._id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        <Link 
                          to={`/books/${book._id}`}
                          className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          {book.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">by {book.author}</p>
                      <div className="flex items-center space-x-4">
                        {book.genre && (
                          <span className="inline-block bg-secondary-100 dark:bg-secondary-900 text-secondary-800 dark:text-secondary-200 text-xs px-2 py-1 rounded-full font-medium">
                            {book.genre}
                          </span>
                        )}
                        <div className="flex items-center space-x-1">
                          <div className="star-rating">
                            {renderStars(4.5)}
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">4.5</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button className="btn btn-secondary btn-sm flex items-center space-x-1">
                        <span>✏️</span>
                        <span>Edit</span>
                      </button>
                      <button className="btn btn-danger btn-sm flex items-center space-x-1">
                        <span>🗑️</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Reviews Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">My Reviews</h2>
              <p className="text-gray-600 dark:text-gray-300">Reviews you've written</p>
            </div>
            
            {data.reviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No reviews written yet</h3>
                <p className="text-gray-600 dark:text-gray-300">You haven't written any reviews yet.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {data.reviews.map(review => (
                  <div key={review._id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          <Link 
                            to={`/books/${review.bookId?._id}`}
                            className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          >
                            {review.bookId?.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="star-rating">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">{review.rating}</span>
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
        </div>
      </div>
    </div>
  );
}
