// controllers/favoriteController.js

import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import mongoose from "mongoose";

// Get all favorite books for the authenticated user
export const getMyFavorites = catchAsyncErrors(async (req, res, next) => {
  // Populate the 'favoriteBooks' array to get full book details
  const user = await User.findById(req.user._id)
    .populate('favoriteBooks', 'title author description price bookFile.url') // Select necessary fields
    .select('favoriteBooks');

  res.status(200).json({
    sucess: true,
    favoriteBooks: user.favoriteBooks,
    message: "Favorite books fetched successfully.",
  });
});

// Add a book to the user's favorites list
export const addToFavorites = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return next(new ErrorHandler("Invalid Book ID.", 400));
  }

  // $addToSet adds the bookId only if it is not already in the array (prevents duplicates)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { favoriteBooks: bookId } },
    { new: true } // Return the updated document
  );

  res.status(200).json({
    sucess: true,
    message: "Book added to favorites successfully.",
    favoriteBooksCount: user.favoriteBooks.length,
  });
});

// Remove a book from the user's favorites list
export const removeFromFavorites = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return next(new ErrorHandler("Invalid Book ID.", 400));
  }

  // $pull removes all instances of the bookId from the array
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { favoriteBooks: bookId } },
    { new: true }
  );

  res.status(200).json({
    sucess: true,
    message: "Book removed from favorites successfully.",
    favoriteBooksCount: user.favoriteBooks.length,
  });
});
