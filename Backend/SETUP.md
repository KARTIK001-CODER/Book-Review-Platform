# Backend Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file in the Backend directory with the following content:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/book-review-platform
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   FRONTEND_URL=http://localhost:3000
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   # For local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGO_URI in .env file
   ```

4. **Start the Server**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Test the API**
   ```bash
   # Health check
   curl http://localhost:5000/
   
   # Or open in browser
   # http://localhost:5000/
   ```

## API Testing

The server includes a test script. To run it:

```bash
# Make sure the server is running first
npm run dev

# In another terminal, run the test
node test-api.js
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Change PORT in .env file
   - Kill process using port 5000

2. **MongoDB connection failed**
   - Check if MongoDB is running
   - Verify MONGO_URI in .env file
   - Check network connectivity for Atlas

3. **JWT errors**
   - Ensure JWT_SECRET is set in .env
   - Use a strong, random secret key

4. **CORS errors**
   - Update FRONTEND_URL in .env
   - Check frontend is running on correct port

### Logs

The server provides detailed console logs:
- Request logging
- Authentication attempts
- Database operations
- Error details

Check the console output for debugging information.
