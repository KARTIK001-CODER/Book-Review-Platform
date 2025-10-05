import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';

export default function BooksList() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [sort, setSort] = useState('createdAt');

  async function load(p = 1, searchTerm = '', genreFilter = '', sortBy = 'createdAt') {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: p.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(genreFilter && { genre: genreFilter }),
        ...(sortBy && { sort: sortBy })
      });
      
      const resp = await api.get(`/books?${params}`);
    setBooks(resp.data.data);
    setPage(resp.data.page);
    setTotalPages(resp.data.totalPages);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    load(1, search, genre, sort); 
  }, [search, genre, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    load(1, search, genre, sort);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < fullStars ? 'filled' : ''}`}>★</span>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Discover Your Next<br />Great Read
          </h1>
          <p className="hero-subtitle">
            Share reviews, explore new books, and connect with fellow readers
          </p>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="search-section">
        <div className="search-container">
          <div className="search-header">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search books or authors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-controls">
              <button className="filter-button">
                <span>🔽</span>
                <span>Filter</span>
              </button>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="genre-select"
              >
                <option value="">All Genres</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Mystery">Mystery</option>
                <option value="Romance">Romance</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Biography">Biography</option>
                <option value="History">History</option>
                <option value="Self-Help">Self-Help</option>
                <option value="Business">Business</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Books Section */}
      <section className="search-container">
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Showing {books.length} of {books.length} books
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No books found</h3>
            <p className="text-gray-600 dark:text-gray-300">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="book-grid">
            {books.map(book => (
              <div key={book._id} className="book-card">
                <div className="book-card-header">
                  <div className="book-icon">📖</div>
                  <h3 className="book-title">
                    <Link 
                      to={`/books/${book._id}`}
                      className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {book.title}
                    </Link>
                  </h3>
                  <p className="book-author">by {book.author}</p>
                  
                  {book.description && (
                    <p className="book-description">
                      {book.description}
                    </p>
                  )}

                  <div className="book-meta">
                    {book.genre && (
                      <span className="book-genre">{book.genre}</span>
                    )}
                    <span className="book-year">{book.year}</span>
                  </div>

                  <div className="book-rating">
                    <div className="star-rating">
                      {renderStars(book.averageRating || 0)}
                    </div>
                    <span className="rating-text">
                      {book.averageRating ? book.averageRating.toFixed(1) : '0.0'}
                    </span>
                  </div>
                </div>
          </div>
        ))}
      </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination 
              page={page} 
              totalPages={totalPages} 
              onChange={(p) => { 
                if (p >= 1 && p <= totalPages) load(p, search, genre, sort); 
              }} 
            />
      </div>
        )}
      </section>
    </div>
  );
}
