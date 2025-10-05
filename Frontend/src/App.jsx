import React, { useContext } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import BooksList from './Pages/BooksList';
import BookDetails from './Pages/BookDetails';
import AddEditBook from './Pages/AddEditBook';
import Profile from './Pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthContext.jsx';
import { useTheme } from './context/ThemeContext.jsx';

export default function App() {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Function to determine if a nav link is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="nav-header">
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon">📚</div>
            <span>BookReview</span>
          </Link>

          {/* Navigation Links */}
          <div className="nav-links">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              <span>🏠</span>
              <span>Home</span>
            </Link>
            <Link to="/add" className={`nav-link ${isActive('/add') ? 'active' : ''}`}>
              <span>+</span>
              <span>Add Book</span>
            </Link>
            {user && (
              <Link to={`/profile/${user.id}`} className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>
                <span>👤</span>
                <span>Profile</span>
              </Link>
            )}
            <button 
              className="nav-link"
              onClick={toggleTheme}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span>{isDarkMode ? '☀️' : '🌙'}</span>
            </button>
            {user && (
              <button onClick={handleLogout} className="nav-link logout">
                <span>→</span>
                <span>Logout</span>
              </button>
            )}
            {!user && (
              <>
                <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>
                  <span>Login</span>
                </Link>
                <Link to="/signup" className={`nav-link ${isActive('/signup') ? 'active' : ''}`}>
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Routes>
          <Route path="/" element={<BooksList />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/add" element={<ProtectedRoute><AddEditBook /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><AddEditBook /></ProtectedRoute>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}
