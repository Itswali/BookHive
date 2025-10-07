import React, { useEffect, useState } from "react";
import { BookA, NotebookPen } from "lucide-react";
import { Heart } from "lucide-react"; // <--- NEW IMPORT (Outline heart)
import { FaHeart } from "react-icons/fa"; // <--- NEW IMPORT (Filled heart)
import { useDispatch, useSelector } from "react-redux";
import {
  toggleAddBookPopup,
  toggleReadBookPopup,
  toggleRecordBookPopup,
} from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import {
  fetchAllBorrowedBooks,
  resetBorrowSlice,
} from "../store/slices/borrowSlice";
import { addToFavorites, removeFromFavorites, resetFavoriteSlice } from "../store/slices/favoriteSlice"; // <--- NEW IMPORT
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
  } = useSelector((state) => state.favorite); // <--- NEW SELECTOR

  const isFavorite = (bookId) => myFavorites.some(favBook => favBook._id === bookId); // <--- NEW HELPER

  const {
    loading: borrowSliceLoading,
    error: borrowSliceError,
    message: borrowSliceMessage,
  } = useSelector((state) => state.borrow);

  const [readBook, setReadBook] = useState({});
  const openReadPopup = (id) => {
    const book = books.find((book) => book._id === id);
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };

  const [borrowBookId, setBorrowBookId] = useState({});
  const openRecordBookPopup = (id) => {
    setBorrowBookId(id);
    dispatch(toggleRecordBookPopup());
  };

  // <--- NEW FAVORITE HANDLER
  const handleToggleFavorite = (bookId) => {
    if (isFavorite(bookId)) {
      dispatch(removeFromFavorites(bookId));
    } else {
      dispatch(addToFavorites(bookId));
    }
  };
  // END NEW FAVORITE HANDLER --->

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetBookSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetBookSlice());
    }
    if (borrowSliceError) {
      toast.error(borrowSliceError);
      dispatch(resetBorrowSlice());
    }
    if (borrowSliceMessage) {
      toast.success(borrowSliceMessage);
      dispatch(resetBorrowSlice());
    }
    // <--- NEW FAVORITE ERROR/MESSAGE HANDLER
    if (favoriteError) {
      toast.error(favoriteError);
      dispatch(resetFavoriteSlice());
    }
    if (favoriteMessage) {
      toast.success(favoriteMessage);
      dispatch(resetFavoriteSlice());
    }
    // END NEW FAVORITE ERROR/MESSAGE HANDLER --->

  }, [dispatch, error, message, borrowSliceError, borrowSliceMessage, favoriteError, favoriteMessage]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "Admin") {
      dispatch(fetchAllBorrowedBooks());
    }
  }, [isAuthenticated, user]);

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        {/* Sub Header */}
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-x1 font-medium md:text-2x1 md:font-semibold">
            All Books
          </h2>
          <div className="flex items-center space-x-4">
            {isAuthenticated && user?.role === "Admin" && (
              <button
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                onClick={() => dispatch(toggleAddBookPopup())}
              >
                Add Book
              </button>
            )}
            {isAuthenticated && user?.role === "Admin" && (
              <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
                Record Book
              </button>
            )}
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 border-2 border-gray-300 rounded-md"
            />
          </div>
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
                  {isAuthenticated && user?.role === "Admin" && (
                    <th className="px-4 py-2 text-left">Quantity</th>
                  )}
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Availability</th>
                  <th className="px-4 py-2 text-center">Actions</th> {/* <--- UPDATED HEADER */}
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
                    {isAuthenticated && user?.role === "Admin" && (
                      <td className="px-4 py-2">{book.quantity}</td>
                    )}
                    <td className="px-4 py-2">{`$${book.price}`}</td>
                    <td className="px-4 py-2">{book.availability ? "Availible": "Unavailible"}</td>

                    {/* --- ACTIONS COLUMN --- */}
                    <td className="px-4 py-2 flex space-x-2 my-3 justify-center ">
                      <BookA
                        className="cursor-pointer"
                        onClick={() => openReadPopup(book._id)}
                        title="View Info"
                      />

                      {isAuthenticated && user?.role === "Admin" && (
                        <NotebookPen
                          className="cursor-pointer"
                          onClick={()=> openRecordBookPopup(book._id)}
                          title="Record Borrow"
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
