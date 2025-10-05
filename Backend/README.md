# Book Review Platform - Backend API

A comprehensive REST API for a Book Review Platform built with Node.js, Express, MongoDB, and JWT authentication.

## 🚀 Features

- **User Authentication**: JWT-based signup and login with bcrypt password hashing
- **Book Management**: Full CRUD operations with creator-based permissions
- **Review System**: Users can add, edit, and delete reviews for books
- **Pagination**: Efficient pagination for books and reviews (5 books per page)
- **Dynamic Ratings**: Real-time average rating calculation for books
- **Search & Filter**: Search books by title, author, description and filter by genre
- **User Profiles**: View user profiles with their books and reviews
- **Comprehensive Error Handling**: Detailed error messages and logging
- **ES Module Syntax**: Modern JavaScript with import/export statements

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Environment**: dotenv
- **CORS**: Cross-Origin Resource Sharing enabled

## 📦 Dependencies

```json
{
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "dotenv": "^16.0.0",
  "express": "^4.18.2",
  "jsonwebtoken": "^9.0.0",
  "mongoose": "^7.0.0"
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd book-review-platform/Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the Backend directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/book-review-platform
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register a new user | No |
| POST | `/login` | Login user | No |

### Book Routes (`/api/books`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all books (paginated) | No |
| GET | `/:id` | Get book details with reviews | No |
| POST | `/` | Create a new book | Yes |
| PUT | `/:id` | Update a book (creator only) | Yes |
| DELETE | `/:id` | Delete a book (creator only) | Yes |
| POST | `/:bookId/reviews` | Add review to a book | Yes |

### Review Routes (`/api/reviews`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| PUT | `/:id` | Update a review (author only) | Yes |
| DELETE | `/:id` | Delete a review (author only) | Yes |
| GET | `/user/:userId` | Get user's reviews | No |

### User Routes (`/api/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/:id` | Get user profile with books and reviews | No |

## 📝 API Usage Examples

### User Registration
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### User Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create a Book
```bash
POST /api/books
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "description": "A classic American novel...",
  "genre": "Fiction",
  "year": 1925
}
```

### Get Books with Pagination
```bash
GET /api/books?page=1&search=gatsby&genre=fiction&sort=year
```

### Add a Review
```bash
POST /api/books/:bookId/reviews
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "rating": 5,
  "reviewText": "Excellent book! Highly recommended."
}
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... },
  "pagination": { ... } // for paginated endpoints
}
```

### Error Response
```json
{
  "message": "Error description",
  "errors": ["Detailed error messages"] // for validation errors
}
```

## 🔍 Query Parameters

### Books Endpoint
- `page`: Page number (default: 1)
- `search`: Search term for title, author, or description
- `genre`: Filter by genre
- `year`: Filter by publication year
- `sort`: Sort by 'title', 'author', 'year', or 'createdAt' (default)

### Book Details Endpoint
- `reviewPage`: Page number for reviews (default: 1)

## 🏗️ Project Structure

```
Backend/
├── controllers/          # Route controllers
│   ├── authController.js
│   ├── bookController.js
│   ├── reviewController.js
│   └── userController.js
├── middleware/           # Custom middleware
│   ├── auth.js          # JWT authentication
│   └── errorHandler.js  # Error handling
├── models/              # Mongoose models
│   ├── User.js
│   ├── Book.js
│   └── Review.js
├── routes/              # API routes
│   ├── auth.js
│   ├── books.js
│   ├── reviews.js
│   └── users.js
├── config.js            # Configuration
├── app.js               # Express app setup
├── server.js            # Server entry point
└── package.json
```

## 🛡️ Security Features

- Password hashing with bcryptjs (salt rounds: 12)
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Rate limiting ready
- SQL injection protection (MongoDB)
- XSS protection

## 📈 Performance Features

- Database indexing for better query performance
- Pagination to handle large datasets
- Lean queries where appropriate
- Aggregation pipelines for complex operations
- Connection pooling

## 🐛 Error Handling

The API includes comprehensive error handling:

- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error

## 🧪 Testing

Test the API using tools like:
- Postman
- Insomnia
- curl
- Thunder Client (VS Code extension)

### Health Check
```bash
GET http://localhost:5000/
```

## 🚀 Deployment

1. Set production environment variables
2. Use a process manager like PM2
3. Set up MongoDB Atlas or similar cloud database
4. Configure reverse proxy (nginx)
5. Enable HTTPS
6. Set up monitoring and logging

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support, please open an issue in the repository or contact the development team.
