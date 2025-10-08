import React, { useState, useEffect } from "react";
// PiKeyReturnBold and FaSquareCheck might not be used here, but keeping for completeness
import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6"; // <--- Used for 'Already Borrowed' indicator
import { FaHeart } from "react-icons/fa"; // <--- NEW IMPORT for filled heart
// Added Hand icon from lucide-react
import { BookA, Heart, Download, Hand } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
// Assumed imports for book and popup slices
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
// Imported new action and reset
import { borrowBook, resetBorrowSlice, fetchUserBorrowedBooks } from "../store/slices/borrowSlice"; // <--- Added fetchUserBorrowedBooks
// NEW IMPORTS for favorites
import {
  addToFavorites,
  removeFromFavorites,
  fetchMyFavorites,
  resetFavoriteSlice,
} from "../store/slices/favoriteSlice";
import Header from "../layout/Header";
import ReadBookPopup from "../popups/ReadBookPopup";

const Catalog = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [readBook, setReadBook] = useState(null);

  const { readBookPopup } = useSelector((state) => state.popup);
  const { books, loading: bookLoading, error: bookError, message: bookMessage } = useSelector(
    (state) => state.book
  );
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  // Selector for favorites
  const { myFavorites, error: favoriteError, message: favoriteMessage } = useSelector(
    (state) => state.favorite
  );
  // Used borrow slice state for toasts/loading and borrowed books list
  const { loading: borrowLoading, error: borrowError, message: borrowMessage, userBorrowedBooks } = useSelector(
    (state) => state.borrow
  );

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchAllBooks());
    if (isAuthenticated) {
      dispatch(fetchMyFavorites());
      dispatch(fetchUserBorrowedBooks()); // Fetch user's borrowed books to check borrow status
    }
  }, [dispatch, isAuthenticated]);

  // Handle messages/errors
  useEffect(() => {
    if (bookError) {
      toast.error(bookError);
      dispatch(resetBookSlice());
    }
    if (bookMessage) {
      toast.success(bookMessage);
      dispatch(resetBookSlice());
    }
    // --- Borrow Slice Handlers ---
    if (borrowError) {
      toast.error(borrowError);
      dispatch(resetBorrowSlice());
    }
    if (borrowMessage) {
      toast.success(borrowMessage);
      dispatch(resetBorrowSlice());
    }
    // --- Favorite Slice Handlers ---
    if (favoriteError) {
      toast.error(favoriteError);
      dispatch(resetFavoriteSlice());
    }
    if (favoriteMessage) {
      toast.success(favoriteMessage);
      dispatch(resetFavoriteSlice());
    }
  }, [dispatch, bookError, bookMessage, borrowError, borrowMessage, favoriteError, favoriteMessage]);


  const handleViewBook = (book) => {
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };

  const isFavorite = (bookId) => {
    return myFavorites?.some((favBook) => favBook._id === bookId);
  };

  const handleToggleFavorite = (bookId) => {
    if (isFavorite(bookId)) {
      dispatch(removeFromFavorites(bookId));
    } else {
      dispatch(addToFavorites(bookId));
    }
  };

  const handleBorrowBook = (bookId) => {
    dispatch(borrowBook(bookId));
  };

  // NEW FUNCTION: Check if the book is currently borrowed by the user
  const isCurrentlyBorrowed = (bookId) => {
    return userBorrowedBooks?.some(
      (borrowed) => borrowed.bookId === bookId && !borrowed.returned
    );
  };

  const filteredBooks = books?.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        {/* Sub Header */}
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            Book Catalog
          </h2>
          <input
            type="text"
            placeholder="Search by Title or Author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
          />
        </header>

        {/* Table */}
        <div className="mt-6">
          {bookLoading ? (
            <p className="text-center text-gray-500">Loading books...</p>
          ) : filteredBooks && filteredBooks.length > 0 ? (
            <div className="overflow-auto bg-white rounded-md shadow-lg">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">No.</th>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Author</th>
                    <th className="px-4 py-2 text-left">Quantity</th>
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book, index) => (
                    <tr
                      key={book._id}
                      className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}
                    >
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{book.title}</td>
                      <td className="px-4 py-2">{book.author}</td>
                      <td className="px-4 py-2">{book.quantity}</td>
                      <td className="px-4 py-2 flex space-x-4 my-3 justify-center items-center">
                        {/* Borrow Book Button - Only for Users, if not borrowed, and quantity > 0 */}
                        {isAuthenticated &&
                          user?.role === "User" &&
                          !isCurrentlyBorrowed(book._id) && // <--- NEW CHECK
                          book.quantity > 0 && (
                            <Hand
                              onClick={() => handleBorrowBook(book._id)}
                              className={`cursor-pointer text-green-600 hover:text-green-800 ${borrowLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                              title="Borrow Book"
                            />
                          )}

                        {/* Already Borrowed Indicator */}
                        {isAuthenticated &&
                          user?.role === "User" &&
                          isCurrentlyBorrowed(book._id) && (
                            <FaSquareCheck
                                className="text-amber-500 w-5 h-5"
                                title="Already Borrowed"
                            />
                        )}

                        {/* View PDF / Read Book - Only if digital copy exists */}
                        {book.bookFile && book.bookFile.url && (
                          <Download
                            onClick={() => handleViewBook(book)}
                            className="cursor-pointer text-blue-600 hover:text-blue-800"
                            title="View Book Info / Read Online"
                          />
                        )}

                        {/* Favorites Button (Toggled Heart) */}
                        {isAuthenticated && user?.role === "User" && (
                          <button
                            onClick={() => handleToggleFavorite(book._id)}
                            title={isFavorite(book._id) ? "Remove from Favorites" : "Add to Favorites"}
                          >
                            {isFavorite(book._id) ? (
                              <FaHeart className="text-red-600 w-5 h-5" /> // Filled heart for favorite
                            ) : (
                              <Heart className="text-gray-400 w-5 h-5 hover:text-red-600" /> // Outline heart
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !bookLoading && <p className="text-center text-gray-500">No books found in the catalog.</p>
          )}
        </div>
      </main>
      {readBookPopup && readBook && <ReadBookPopup book={readBook} />}
    </>
  );
};

export default Catalog;
