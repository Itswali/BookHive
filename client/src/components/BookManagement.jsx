import React, { useEffect, useState } from "react";
// Import new icons: Hand for Borrow, Trash2 for Delete
import { BookA, NotebookPen, Heart, Hand, Trash2 } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleAddBookPopup,
  toggleReadBookPopup,
  toggleRecordBookPopup,
} from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
// Imported deleteBook
import { fetchAllBooks, resetBookSlice, deleteBook } from "../store/slices/bookSlice";
import {
  fetchAllBorrowedBooks,
  resetBorrowSlice,
  borrowBook, // Imported borrowBook for User action
} from "../store/slices/borrowSlice";
import { addToFavorites, removeFromFavorites, resetFavoriteSlice, fetchMyFavorites } from "../store/slices/favoriteSlice";
import Header from "../layout/Header";
import AddBookPopup from "../popups/AddBookPopup";
import ReadBookPopup from "../popups/ReadBookPopup";
import RecordBookPopup from "../popups/RecordBookPopup";

const BookManagement = () => {
  const dispatch = useDispatch();

  const { loading, error, message, books } = useSelector((state) => state.book);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { addBookPopup, readBookPopup, recordBookPopup } = useSelector(
    (state) => state.popup
  );
  const {
    myFavorites,
    error: favoriteError,
    message: favoriteMessage
  } = useSelector((state) => state.favorite);

  const [readBook, setReadBook] = useState(null);
  const [borrowBookId, setBorrowBookId] = useState(null);

  // --- NEW: User Borrow Handler ---
  const handleBorrowBook = (bookId) => {
    const book = books.find(b => b._id === bookId);
    if(book && book.quantity > 0) {
      dispatch(borrowBook(bookId));
    } else {
      toast.error("This book is currently out of stock.");
    }
  };

  // --- NEW: Admin Delete Handler ---
  const handleDeleteBook = (bookId) => {
    if (window.confirm("Are you sure you want to delete this book? This action cannot be undone.")) {
      dispatch(deleteBook(bookId));
    }
  };
  // --- END NEW HANDLERS ---

  useEffect(() => {
    dispatch(fetchAllBooks());
    if(user?.role === "Admin") {
        dispatch(fetchAllBorrowedBooks());
    }
    if(user?.role === "User") {
        dispatch(fetchMyFavorites());
    }
  }, [dispatch, user?.role]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetBookSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetBookSlice());
    }
    if (favoriteError) {
      toast.error(favoriteError);
      dispatch(resetFavoriteSlice());
    }
    if (favoriteMessage) {
      toast.success(favoriteMessage);
      dispatch(resetFavoriteSlice());
    }
  }, [dispatch, error, message, favoriteError, favoriteMessage]);

  const openAddBookPopup = () => {
    dispatch(toggleAddBookPopup());
  };

  const openReadPopup = (book) => {
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };

  const openRecordBookPopup = (id) => {
    setBorrowBookId(id);
    dispatch(toggleRecordBookPopup());
  };

  const isFavorite = (bookId) => {
    return myFavorites.some(favBook => favBook._id === bookId);
  };

  const handleToggleFavorite = (bookId) => {
    if (isFavorite(bookId)) {
      dispatch(removeFromFavorites(bookId));
    } else {
      dispatch(addToFavorites(bookId));
    }
  };


  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        {/* Sub Header */}
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-x1 font-medium md:text-2x1 md:font-semibold">
            Library Book Management
          </h2>
          {isAuthenticated && user?.role === "Admin" && (
            <button
              onClick={openAddBookPopup}
              className="px-4 py-2 bg-black text-white rounded-md font-semibold hover:bg-gray-800"
            >
              Add New Book
            </button>
          )}
        </header>

        {/* Table */}
        {books && books.length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Author</th>
                  <th className="px-4 py-2 text-left">Price ($)</th>
                  <th className="px-4 py-2 text-left">Stock</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book, index) => (
                  <tr
                    key={book._id}
                    className={(index + 1) % 2 == 0 ? "bg-gray-50" : ""}
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{book.title}</td>
                    <td className="px-4 py-2">{book.author}</td>
                    <td className="px-4 py-2">{book.price}</td>
                    <td className={`px-4 py-2 font-medium ${book.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                        {book.quantity}
                    </td>

                    {/* --- ACTIONS COLUMN --- */}
                    <td className="px-4 py-2 flex space-x-4 my-3 justify-center">
                      <BookA
                        className="cursor-pointer"
                        onClick={() => openReadPopup(book)}
                        title="View Info"
                      />

                      {/* NEW: User Borrow Book */}
                      {isAuthenticated && user?.role === "User" && book.quantity > 0 && (
                          <Hand
                              className="cursor-pointer text-green-600"
                              onClick={() => handleBorrowBook(book._id)}
                              title="Borrow Book"
                          />
                      )}


                      {/* Admin Record Borrow (Existing) */}
                      {isAuthenticated && user?.role === "Admin" && (
                        <NotebookPen
                          className="cursor-pointer"
                          onClick={()=> openRecordBookPopup(book._id)}
                          title="Record Borrow"
                        />
                      )}

                      {/* NEW: Admin Delete Book */}
                      {isAuthenticated && user?.role === "Admin" && (
                          <Trash2
                              className="cursor-pointer text-red-600"
                              onClick={() => handleDeleteBook(book._id)}
                              title="Delete Book"
                          />
                      )}


                      {isAuthenticated && user?.role === "User" && (
                        <button onClick={() => handleToggleFavorite(book._id)} title={isFavorite(book._id) ? "Remove from Favorites" : "Add to Favorites"}>
                          {isFavorite(book._id) ? (
                            <FaHeart className="text-red-600 w-5 h-5" /> // Filled heart for favorite
                          ) : (
                            <Heart className="text-gray-400 w-5 h-5 hover:text-red-400" /> // Outline heart
                          )}
                        </button>
                      )}
                    </td>
                    {/* --- END ACTIONS COLUMN --- */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h3 className="text-3xl mt-5 font-medium"> No Books found in library!</h3>
        )}
      </main>
        {addBookPopup && <AddBookPopup /> }
        {readBookPopup && <ReadBookPopup book={readBook} /> }
        {recordBookPopup && <RecordBookPopup bookId={borrowBookId} /> }
    </>
  );
};

export default BookManagement;
