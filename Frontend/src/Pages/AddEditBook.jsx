import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate, useParams } from 'react-router-dom';

export default function AddEditBook() {
  const { id } = useParams();
  const [form, setForm] = useState({ 
    title: '', 
    author: '', 
    description: '', 
    genre: '', 
    year: '' 
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      (async () => {
        try {
          setLoading(true);
          const resp = await api.get(`/books/${id}`);
          const b = resp.data.book;
          setForm({ 
            title: b.title, 
            author: b.author, 
            description: b.description || '', 
            genre: b.genre || '', 
            year: b.year || '' 
          });
        } catch (error) {
          console.error('Error loading book:', error);
          alert('Error loading book details');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id) {
        await api.put(`/books/${id}`, form);
      } else {
        await api.post('/books', form);
      }
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving book');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const genres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction',
    'Fantasy', 'Biography', 'History', 'Self-Help', 'Business',
    'Thriller', 'Horror', 'Adventure', 'Philosophy', 'Poetry', 'Memoir'
  ];

  if (isEditing && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-500 to-green-500 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {isEditing ? 'Edit Book' : 'Add New Book'}
          </h1>
          <p className="text-lg opacity-90">
            {isEditing ? 'Update book information' : 'Share a book with the community'}
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Book Title *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    placeholder="Enter the book title"
                    value={form.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {/* Author */}
                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Author *
                  </label>
                  <input
                    id="author"
                    name="author"
                    type="text"
                    required
                    placeholder="Enter the author's name"
                    value={form.author}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {/* Genre and Year Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Genre */}
                  <div>
                    <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Genre
                    </label>
                    <select
                      id="genre"
                      name="genre"
                      value={form.genre}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Select a genre</option>
                      {genres.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
                  </div>

                  {/* Year */}
                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Publication Year
                    </label>
                    <input
                      id="year"
                      name="year"
                      type="number"
                      min="1000"
                      max={new Date().getFullYear() + 1}
                      placeholder="e.g., 2020"
                      value={form.year}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={6}
                    placeholder="Write a brief description of the book..."
                    value={form.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-vertical bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn btn-primary flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                        {isEditing ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      <>
                        <span>{isEditing ? '📝' : '➕'}</span>
                        {isEditing ? 'Update Book' : 'Add Book'}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="flex-1 btn btn-secondary flex items-center justify-center gap-2"
                  >
                    <span>←</span>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
