# 📚 Book Review Platform

A full-stack web application for sharing book reviews, discovering new books, and connecting with fellow readers. Built with modern technologies and featuring a beautiful, responsive design with dark mode support.

![Book Review Platform](https://img.shields.io/badge/Status-Live-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-19+-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-7+-green)

## 🌟 Features

### 🔐 Authentication & User Management
- **User Registration & Login** with JWT authentication
- **Secure Password Hashing** using bcryptjs
- **Protected Routes** for authenticated users
- **User Profiles** with personal book collections and reviews

### 📖 Book Management
- **Add & Edit Books** with detailed information (title, author, genre, year, description)
- **Book Discovery** with search and filtering capabilities
- **Genre-based Filtering** (Fiction, Non-Fiction, Mystery, Romance, etc.)
- **Pagination** for smooth browsing experience
- **Dynamic Rating System** with average ratings

### ⭐ Review System
- **Rate Books** on a 1-5 star scale
- **Write Detailed Reviews** with text descriptions
- **View All Reviews** for each book
- **User Review History** on profile pages
- **One Review Per User** per book policy

### 🎨 Modern UI/UX
- **Responsive Design** that works on all devices
- **Dark Mode Toggle** with persistent theme preference
- **Modern Card-based Layout** with smooth animations
- **Intuitive Navigation** with active state indicators
- **Loading States** and error handling
- **Beautiful Gradients** and hover effects

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React 19** - Frontend library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Custom CSS** - Advanced styling and animations

## 📁 Project Structure

```
Book Review Platform/
├── Backend/                    # Node.js/Express API
│   ├── controllers/           # Route handlers
│   │   ├── authController.js  # Authentication logic
│   │   ├── bookController.js  # Book CRUD operations
│   │   ├── reviewController.js # Review management
│   │   └── userController.js  # User profile management
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js           # JWT authentication
│   │   └── errorHandler.js   # Error handling
│   ├── models/               # Database schemas
│   │   ├── Book.js          # Book model
│   │   ├── Review.js        # Review model
│   │   └── User.js          # User model
│   ├── routes/              # API routes
│   │   ├── auth.js          # Authentication routes
│   │   ├── books.js         # Book routes
│   │   ├── reviews.js       # Review routes
│   │   └── users.js         # User routes
│   ├── config.js            # Configuration
│   ├── app.js              # Express app setup
│   ├── server.js           # Server entry point
│   └── package.json        # Backend dependencies
├── Frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── Pagination.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/         # React contexts
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── Pages/          # Page components
│   │   │   ├── BooksList.jsx
│   │   │   ├── BookDetails.jsx
│   │   │   ├── AddEditBook.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── api/            # API configuration
│   │   │   └── api.js
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # App entry point
│   │   └── index.css       # Global styles
│   ├── tailwind.config.js  # Tailwind configuration
│   └── package.json        # Frontend dependencies
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Book Review Platform"
   ```

2. **Install Backend Dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../Frontend
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the Backend directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/book-review-platform
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

5. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - Default connection: `mongodb://localhost:27017`

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd Backend
   npm run dev
   ```
   The API will be available at `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd Frontend
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Book Endpoints
- `GET /api/books` - Get all books (with pagination, search, filters)
- `GET /api/books/:id` - Get book details
- `POST /api/books` - Create new book (protected)
- `PUT /api/books/:id` - Update book (protected)
- `DELETE /api/books/:id` - Delete book (protected)

### Review Endpoints
- `POST /api/books/:bookId/reviews` - Add review (protected)
- `PUT /api/reviews/:id` - Update review (protected)
- `DELETE /api/reviews/:id` - Delete review (protected)
- `GET /api/reviews/user/:userId` - Get user reviews

### User Endpoints
- `GET /api/users/:id` - Get user profile

## 🎨 Features in Detail

### 🔍 Search & Filter
- **Text Search**: Search by book title, author, or description
- **Genre Filter**: Filter books by genre
- **Sort Options**: Sort by date, title, author, or year
- **Pagination**: Navigate through pages of results

### ⭐ Rating System
- **Star Ratings**: 1-5 star rating system
- **Average Ratings**: Automatically calculated for each book
- **Review Count**: Display number of reviews per book
- **Rating Distribution**: Visual representation of ratings

### 👤 User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode**: Toggle between light and dark themes
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Form Validation**: Client and server-side validation

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Server-side validation for all inputs
- **Protected Routes**: Authentication required for sensitive operations
- **Error Handling**: Secure error messages without sensitive data

## 🎯 Usage Examples

### Adding a Book
1. Click "Add Book" in the navigation
2. Fill in book details (title, author, genre, year, description)
3. Click "Add Book" to save

### Writing a Review
1. Navigate to any book's detail page
2. Scroll to the "Leave a Review" section
3. Select a rating (1-5 stars)
4. Write your review text
5. Click "Submit Review"

### Managing Your Profile
1. Click on your profile in the navigation
2. View your added books and written reviews
3. Edit or delete your books
4. See your review statistics

## 🔧 Development

### Backend Development
- **ES Modules**: Uses modern ES6 import/export syntax
- **MVC Architecture**: Clean separation of concerns
- **Middleware**: Custom authentication and error handling
- **Logging**: Comprehensive console logging for debugging

### Frontend Development
- **React Hooks**: Modern functional components
- **Context API**: Global state management for auth and theme
- **Custom Hooks**: Reusable logic for API calls
- **Responsive Design**: Mobile-first approach

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or your preferred MongoDB hosting
2. Update environment variables for production
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or GitHub Pages
3. Update API URLs for production environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing frontend library
- **Express.js Team** for the robust backend framework
- **MongoDB Team** for the flexible database
- **Tailwind CSS** for the utility-first CSS framework
- **Vite** for the fast build tool

## 📞 Support

If you have any questions or need help with the project, please:
- Open an issue on GitHub
- Check the documentation
- Review the code comments

---

**Happy Reading! 📚✨**

Built with ❤️ using modern web technologies.
