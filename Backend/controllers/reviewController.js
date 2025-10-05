import Review from '../models/Review.js';
import Book from '../models/Book.js';

export const addReview = async (req, res, next) => {
  try {
    console.log('Adding review for book ID:', req.params.bookId, 'by user:', req.user.email);
    
    const { rating, reviewText } = req.body;
    const bookId = req.params.bookId;
    const userId = req.user._id;

    // Validate required fields
    if (!rating || rating < 1 || rating > 5) {
      console.log('Review creation failed: Invalid rating');
      return res.status(400).json({ 
        message: 'Rating is required and must be between 1 and 5' 
      });
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      console.log('Book not found for review');
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({ bookId, userId });
    if (existingReview) {
      console.log('User already reviewed this book');
      return res.status(400).json({ 
        message: 'You have already reviewed this book. You can update your existing review instead.' 
      });
    }

    const review = await Review.create({ bookId, userId, rating, reviewText });
    
    // Populate the review with user details
    await review.populate('userId', 'name email');
    await review.populate('bookId', 'title author');

    console.log('Review created successfully for book:', book.title);
    res.status(201).json({
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    console.error('Add review error:', error.message);
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    console.log('Updating review ID:', req.params.id, 'by user:', req.user.email);
    
    const review = await Review.findById(req.params.id);
    if (!review) {
      console.log('Review not found for update');
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the author of the review
    if (review.userId.toString() !== req.user._id.toString()) {
      console.log('Unauthorized review update attempt');
      return res.status(403).json({ 
        message: 'You can only update your own reviews' 
      });
    }

    // Validate rating if provided
    if (req.body.rating && (req.body.rating < 1 || req.body.rating > 5)) {
      console.log('Invalid rating provided for update');
      return res.status(400).json({ 
        message: 'Rating must be between 1 and 5' 
      });
    }

    // Update review fields
    Object.assign(review, req.body);
    await review.save();

    // Populate the updated review
    await review.populate('userId', 'name email');
    await review.populate('bookId', 'title author');

    console.log('Review updated successfully');
    res.json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    console.error('Update review error:', error.message);
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    console.log('Deleting review ID:', req.params.id, 'by user:', req.user.email);
    
    const review = await Review.findById(req.params.id);
    if (!review) {
      console.log('Review not found for deletion');
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the author of the review
    if (review.userId.toString() !== req.user._id.toString()) {
      console.log('Unauthorized review deletion attempt');
      return res.status(403).json({ 
        message: 'You can only delete your own reviews' 
      });
    }

    await Review.findByIdAndDelete(req.params.id);
    console.log('Review deleted successfully');
    res.json({ 
      message: 'Review deleted successfully' 
    });
  } catch (error) {
    console.error('Delete review error:', error.message);
    next(error);
  }
};

export const getUserReviews = async (req, res, next) => {
  try {
    console.log('Getting reviews for user ID:', req.params.userId);
    
    const userId = req.params.userId;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ userId })
      .populate('bookId', 'title author')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ userId });

    console.log(`Retrieved ${reviews.length} reviews for user (page ${page})`);
    res.json({
      reviews,
      pagination: {
        page,
        totalPages: Math.ceil(total / limit),
        total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error.message);
    next(error);
  }
};
