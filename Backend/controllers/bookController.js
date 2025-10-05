import Book from '../models/Book.js';
import Review from '../models/Review.js';

export const createBook = async (req, res, next) => {
  try {
    console.log('Creating book:', req.body.title, 'by user:', req.user.email);
    
    const { title, author, description, genre, year } = req.body;
    
    // Validate required fields
    if (!title || !author) {
      console.log('Book creation failed: Missing required fields');
      return res.status(400).json({ 
        message: 'Title and author are required' 
      });
    }

    const book = await Book.create({ 
      title, 
      author, 
      description, 
      genre, 
      year, 
      addedBy: req.user._id 
    });

    console.log('Book created successfully:', book.title);
    res.status(201).json({
      message: 'Book created successfully',
      book
    });
  } catch (error) {
    console.error('Create book error:', error.message);
    next(error);
  }
};

export const getBooks = async (req, res, next) => {
  try {
    console.log('Fetching books with query:', req.query);
    
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = 5;
    const skip = (page - 1) * limit;
    const { search, genre, sort, year } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') }, 
        { author: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }
    
    if (genre) filter.genre = new RegExp(genre, 'i');
    if (year) filter.year = parseInt(year);

    // Build sort object
    let sortObj = { createdAt: -1 };
    if (sort === 'year') sortObj = { year: -1 };
    if (sort === 'title') sortObj = { title: 1 };
    if (sort === 'author') sortObj = { author: 1 };

    const books = await Book.find(filter)
      .populate('addedBy', 'name email')
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Book.countDocuments(filter);

    // Get ratings for all books
    const bookIds = books.map(b => b._id);
    const ratings = await Review.aggregate([
      { $match: { bookId: { $in: bookIds } } },
      { $group: { _id: '$bookId', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    const ratingMap = {};
    ratings.forEach(r => { 
      ratingMap[r._id.toString()] = r; 
    });

    const result = books.map(b => ({
      ...b,
      averageRating: Math.round((ratingMap[b._id.toString()]?.avg || 0) * 10) / 10,
      reviewsCount: ratingMap[b._id.toString()]?.count || 0
    }));

    console.log(`Retrieved ${result.length} books (page ${page} of ${Math.ceil(total / limit)})`);
    res.json({ 
      data: result, 
      page, 
      totalPages: Math.ceil(total / limit), 
      total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    });
  } catch (error) {
    console.error('Get books error:', error.message);
    next(error);
  }
};

export const getBookDetails = async (req, res, next) => {
  try {
    console.log('Getting book details for ID:', req.params.id);
    
    const book = await Book.findById(req.params.id)
      .populate('addedBy', 'name email');
    
    if (!book) {
      console.log('Book not found');
      return res.status(404).json({ message: 'Book not found' });
    }

    // Get reviews with pagination
    const reviewPage = Math.max(1, parseInt(req.query.reviewPage) || 1);
    const reviewLimit = 10;
    const reviewSkip = (reviewPage - 1) * reviewLimit;

    const reviews = await Review.find({ bookId: book._id })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(reviewSkip)
      .limit(reviewLimit);

    const totalReviews = await Review.countDocuments({ bookId: book._id });

    // Get rating statistics
    const ratingStats = await Review.aggregate([
      { $match: { bookId: book._id } },
      { 
        $group: { 
          _id: '$bookId', 
          average: { $avg: '$rating' }, 
          count: { $sum: 1 },
          distribution: {
            $push: '$rating'
          }
        } 
      }
    ]);

    const stats = ratingStats[0] || { average: 0, count: 0, distribution: [] };
    
    // Calculate rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    stats.distribution.forEach(rating => {
      distribution[rating] = (distribution[rating] || 0) + 1;
    });

    console.log('Book details retrieved successfully:', book.title);
    res.json({ 
      book, 
      reviews,
      averageRating: Math.round(stats.average * 10) / 10 || 0,
      reviewsCount: stats.count,
      ratingDistribution: distribution,
      reviewPagination: {
        page: reviewPage,
        totalPages: Math.ceil(totalReviews / reviewLimit),
        total: totalReviews,
        hasNextPage: reviewPage < Math.ceil(totalReviews / reviewLimit),
        hasPrevPage: reviewPage > 1
      }
    });
  } catch (error) {
    console.error('Get book details error:', error.message);
    next(error);
  }
};

export const updateBook = async (req, res, next) => {
  try {
    console.log('Updating book ID:', req.params.id, 'by user:', req.user.email);
    
    const book = await Book.findById(req.params.id);
    if (!book) {
      console.log('Book not found for update');
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user is the creator
    if (book.addedBy.toString() !== req.user._id.toString()) {
      console.log('Unauthorized book update attempt');
      return res.status(403).json({ message: 'You can only update books you created' });
    }

    // Update book fields
    Object.assign(book, req.body);
    await book.save();

    console.log('Book updated successfully:', book.title);
    res.json({
      message: 'Book updated successfully',
      book
    });
  } catch (error) {
    console.error('Update book error:', error.message);
    next(error);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    console.log('Deleting book ID:', req.params.id, 'by user:', req.user.email);
    
    const book = await Book.findById(req.params.id);
    if (!book) {
      console.log('Book not found for deletion');
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user is the creator
    if (book.addedBy.toString() !== req.user._id.toString()) {
      console.log('Unauthorized book deletion attempt');
      return res.status(403).json({ message: 'You can only delete books you created' });
    }

    // Delete associated reviews first
    await Review.deleteMany({ bookId: book._id });
    console.log('Deleted associated reviews for book:', book.title);

    // Delete the book
    await Book.findByIdAndDelete(req.params.id);
    console.log('Book deleted successfully:', book.title);

    res.json({ 
      message: 'Book and all associated reviews deleted successfully' 
    });
  } catch (error) {
    console.error('Delete book error:', error.message);
    next(error);
  }
};
