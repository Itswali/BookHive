import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";

import ErrorHandler from "../middlewares/errorMiddlewares.js";
// import express from "express";

// Admin: Add a new book
export const addBook = catchAsyncErrors(async(req, res, next) => {
  const { title, author, description, price, quantity } = req.body;
  if(!title || !author || !description || !price || !quantity) {
    return next(new ErrorHandler("Please fill all fields.", 400));
  }
  const book = await Book.create({
    title,
    author,
    description,
    price,
    quantity
   });
   res.status(200).json({
    sucess: true,
    message: "Book added sucessfully",
    book,
   });
 });

// Public/Authenticated: Get all books
export const getAllBook = catchAsyncErrors(async(req, res, next) => {
  // ⭐️ FIX: Correct implementation to fetch ALL books
  const books = await Book.find();
  res.status(200).json({
    sucess: true,
    books,
  });
});

// Admin: Delete a book by ID
export const deleteBook = catchAsyncErrors(async(req, res, next) => {
  // ⭐️ FIX: Correct implementation to delete a book by ID
  const { id } = req.params;
  const book = await Book.findById(id);

  if (!book) {
    // This is the correct place to throw "Book Not Found."
    return next(new ErrorHandler("Book Not Found.", 404));
  }

  await book.deleteOne();

  res.status(200).json({
    sucess: true,
    message: "Book deleted sucessfully.",
  });
});
