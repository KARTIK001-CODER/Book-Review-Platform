import User from '../models/User.js';
import Book from '../models/Book.js';
import Review from '../models/Review.js';

export const getProfile = async (req, res, next) => {
  try {
    console.log('Getting profile for user ID:', req.params.id);
    
    const userId = req.params.id;
    
    // Validate ObjectId format
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('Invalid user ID format');
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's books with pagination
    const userBooks = await Book.find({ addedBy: userId })
      .sort({ createdAt: -1 })
      .populate('addedBy', 'name email');

    // Get user's reviews with book details
    const userReviews = await Review.find({ userId })
      .populate('bookId', 'title author')
      .sort({ createdAt: -1 });

    // Calculate user's review statistics
    const reviewStats = await Review.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    const stats = reviewStats[0] || { totalReviews: 0, averageRating: 0 };

    console.log('Profile retrieved successfully for user:', user.email);
    res.json({ 
      user, 
      books: userBooks, 
      reviews: userReviews,
      stats: {
        totalBooks: userBooks.length,
        totalReviews: stats.totalReviews,
        averageRatingGiven: Math.round(stats.averageRating * 10) / 10 || 0
      }
    });
  } catch (error) {
    console.error('Get profile error:', error.message);
    next(error);
  }
};
