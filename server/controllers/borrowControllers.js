import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Borrow } from "../models/borrowModel.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import { calculateFine } from "../utils/fineCalculator.js";
import mongoose from "mongoose"; // 1. IMPORT MONGOOSE FOR ROBUST ID COMPARISON


export const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // book ID
  const { email } = req.body;

    const book  = await Book.findById(id);
    if(!book) {
      return next(new ErrorHandler("Book not Found.", 404));
    }
    const user = await User.findOne({ email, accountVerified: true })
    if(!user) {
      return next(new ErrorHandler("User not Found.", 404));
    }
    if (book.quantity === 0) {
      return next(new ErrorHandler("Book not availible.", 404));
    }

    // Ensure ID is an ObjectId for robust comparison
    const objectBookId = new mongoose.Types.ObjectId(id);

    // FIX: Use .equals() for reliable ObjectId comparison when checking if already borrowed
    const isAlreadyBorrowed = user.borrowedBooks.find(
      (b) => objectBookId.equals(b.bookId) && b.returned === false
    );
    if(isAlreadyBorrowed) {
      return next(new ErrorHandler("Book already borrowed.", 400));
    }
    book.quantity -= 1;
    book.availability = book.quantity > 0;
    await book.save();

    user.borrowedBooks.push({
      bookId: book._id,
      bookTitle: book.title,
      borrowedDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await user.save();
    await Borrow.create({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      book: book._id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      price: book.price,
    });
    res.status(200).json({
      sucess: true,
      message: "Borrowed Book recorded sucessfully.",
    });
});





export const returnBorrowBook = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;
  const { email } = req.body;

  // Ensure bookId is a valid ObjectId for safety
  const objectBookId = new mongoose.Types.ObjectId(bookId);

  // 1. Initial Lookups
  const book = await Book.findById(objectBookId);
  if (!book) {
    return next (new ErrorHandler("Book not found.", 404));
  }
  const user = await User.findOne({ email, accountVerified: true });
  if (!user) {
    return next(new ErrorHandler("User Not Found.", 404));
  }

  // 2. Find Embedded Borrowed Book (Must be active/not returned)
  // FIX: Use .equals() for reliable ObjectId comparison
  const borrowedBook = user.borrowedBooks.find(
    (b) => objectBookId.equals(b.bookId) && b.returned === false
  );
  if(!borrowedBook) {
    return next( new ErrorHandler("You have not borrowed this book.", 404));
  }

  // 3. Find Global Borrow Record (Must be active/not returned)
  // FIX: Use ObjectId directly in the query
  const borrow = await Borrow.findOne({
    book: objectBookId,
    "user.email": email,
    returnDate: null,
  });
  if(!borrow){
    return next(new ErrorHandler("You have not borrowed this book.", 400));
  }

  // 4. --- ALL VALIDATION PASSED --- PERFORM UPDATES AND SAVES

  // Update embedded record in User document
  borrowedBook.returned = true;
  // Update Book quantity
  book.quantity +=1;
  book.availability = book.quantity > 0;

  // Update global Borrow record
  borrow.returnDate = new Date();
  const fine = calculateFine(borrow.dueDate);
  borrow.fine = fine;

  // Save all changes
  await  user.save();
  await book.save();
  await borrow.save();

  // 5. Send Success Response
  res.status(200).json({
    sucess: true,
    message: fine !== 0
      ? `The book has been returned successfully. The total charges, including fine are Pkr${ fine + book.price}`
      : `The book has been returned successfully. The total charges are Pkr${book.price}`,
  });
});



export const borrowedBooks = catchAsyncErrors(async (req, res, next) => {
  const { borrowedBooks } = req.user;
  res.status(200).json({
    sucess: true,
    borrowedBooks,
  });
});


export const getBorrowedBooksForAdmin = catchAsyncErrors(async (req, res, next) => {
    const borrowedBooks  = await Borrow.find();
  res.status(200).json({
    sucess: true,
    borrowedBooks,
  });
});
