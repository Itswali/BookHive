// controllers/bookController.js

import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary"; // Make sure Cloudinary is imported
import ErrorHandler from "../middlewares/errorMiddlewares.js";


// Admin: Add a new book (Updated to handle PDF upload)
export const addBook = catchAsyncErrors(async(req, res, next) => {
  const { title, author, description, price, quantity } = req.body;

  if(!title || !author || !description || !price || !quantity) {
    return next(new ErrorHandler("Please fill all fields.", 400));
  }

  // --- NEW LOGIC FOR PDF FILE ---
  if(!req.files || !req.files.bookFile) {
    return next(new ErrorHandler("Book PDF file is required.", 400));
  }

  const { bookFile } = req.files;

  // Validate file type (Only PDF allowed)
  if(bookFile.mimetype !== "application/pdf") {
    return next(new ErrorHandler("File format not supported. Only PDF is allowed.", 400));
  }

  // Upload PDF to Cloudinary
  const cloudinaryResponse = await cloudinary.uploader.upload( bookFile.tempFilePath, {
    folder: "bookhive/books",
    resource_type: "raw", // Use 'raw' for non-image files like PDF
   });

  if(!cloudinaryResponse || cloudinaryResponse.error){
    console.error("Cloudinary error:", cloudinaryResponse.error || "Unknown cloudinary error");
    return next(new ErrorHandler("Failed to upload book file. Please try again later.", 500));
  }
  // ------------------------------

  const book = await Book.create({
    title,
    author,
    description,
    price,
    quantity,
    bookFile: { // Save Cloudinary details
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.url,
    }
   });

   res.status(200).json({
    sucess: true,
    message: "Book added sucessfully (including PDF file)",
    book,
   });
 });


// New: Get a single book (to read online)
export const getSingleBook = catchAsyncErrors(async(req, res, next) => {
  const { id } = req.params;

  const book = await Book.findById(id).select("-bookFile.public_id"); // Select all fields including the bookFile URL, excluding public_id

  if (!book) {
    return next(new ErrorHandler("Book not found.", 404));
  }

  // The book object now contains bookFile.url which is the link to the PDF
  res.status(200).json({
    sucess: true,
    book,
    message: "Book fetched successfully. Use the bookFile.url to display the PDF reader.",
  });
});


// Public/Authenticated: Get all books (Unchanged, but now returns bookFile.url)
export const getAllBook = catchAsyncErrors(async(req, res, next) => {
  const books = await Book.find().select("-bookFile.public_id"); // Exclude public_id for general list view
  res.status(200).json({
    sucess: true,
    books,
  });
});

// Admin: Delete a book by ID (Updated to delete PDF from Cloudinary)
export const deleteBook = catchAsyncErrors(async(req, res, next) => {
  const { id } = req.params;
  const book = await Book.findById(id);

  if (!book) {
    return next(new ErrorHandler("Book not found.", 404));
  }

  // OPTIONAL: Delete the PDF file from Cloudinary (Highly recommended)
  if (book.bookFile && book.bookFile.public_id) {
    await cloudinary.uploader.destroy(book.bookFile.public_id, {
        resource_type: "raw"
    });
  }

  await book.deleteOne();

  res.status(200).json({
    sucess: true,
    message: "Book deleted sucessfully",
  });
});
