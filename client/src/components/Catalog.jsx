import React, { useState, useEffect } from "react";
import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";
// Added Hand icon from lucide-react
import { BookA, Heart, Download, Hand } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
// Assumed imports for book and popup slices
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
// Imported new action and reset
import { borrowBook, resetBorrowSlice } from "../store/slices/borrowSlice";
import Header from "../layout/Header";
import ReadBookPopup from "../popups/ReadBookPopup";

const Catalog = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  // FIX 1: Storing the entire book object instead of just the ID
  const [readBook, setReadBook] = useState(null);

  const { readBookPopup } = useSelector((state) => state.popup);
  // Assumed book slice structure
  const { books, loading: bookLoading, error: bookError, message: bookMessage } = useSelector(
    (state) => state.book
  );
  // Assumed auth slice structure
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  // Used borrow slice state for toasts/loading
  const { loading: borrowLoading, error: borrowError, message: borrowMessage } = useSelector(
    (state) => state.borrow
  );

  // Fetch all books on component mount
  useEffect(() => {
    dispatch(fetchAllBooks());
  }, [dispatch]);

  // Handle Book Slice Toasts
  useEffect(() => {
    if (bookError) {
      toast.error(bookError);
      dispatch(resetBookSlice());
    }
    if (bookMessage) {
      toast.success(bookMessage);
      dispatch(resetBookSlice());
    }
  }, [dispatch, bookError, bookMessage]);

  // Handle Borrow Slice Toasts
  useEffect(() => {
    if (borrowError) {
      toast.error(borrowError);
      dispatch(resetBorrowSlice());
    }
    if (borrowMessage) {
      toast.success(borrowMessage);
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, borrowError, borrowMessage]);

  // FIX 1: Update openReadPopup to find and set the full book object
  const openReadPopup = (bookId) => {
    // Find the book object from the Redux state array
    const book = books.find((book) => book._id === bookId);
    setReadBook(book); // Set the book object
    dispatch(toggleReadBookPopup());
  };

  const handleAddToFavorites = (bookId) => {
    // Implement or placeholder for favorite logic
    toast.info(`Attempting to add Book ID: ${bookId} to favorites...`);
  };

  const handleViewBook = (book) => {
    if (book.bookFile && book.bookFile.url) {
      window.open(book.bookFile.url, "_blank");
    } else {
      toast.error("Digital copy not available for this book.");
    }
  };

  // NEW FUNCTION: Handle book borrowing
  const handleBorrowBook = (bookId) => {
    if (!isAuthenticated || user?.role !== "User") {
        toast.error("Only registered users can borrow books.");
        return;
    }
    dispatch(borrowBook(bookId));
  };


  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="p-4 md:p-8 w-full">
        <Header />
        <div className="mt-8">
          <h1 className="text-3xl font-bold mb-4">Book Catalog</h1>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by title or author..."
              className="p-3 border border-gray-300 rounded-md w-full md:w-1/2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {(bookLoading || borrowLoading) && <p>Loading...</p>}

          {!bookLoading && filteredBooks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Author</th>
                    <th className="px-4 py-3 text-center">Category</th>
                    <th className="px-4 py-3 text-center">Available</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book) => (
                    <tr key={book._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium">{book.title}</td>
                      <td className="px-4 py-2">{book.author}</td>
                      <td className="px-4 py-2 text-center">{book.category}</td>
                      <td className="px-4 py-2 text-center">
                        {/* Assuming book.availability is a boolean */}
                        {book.availability ? (
                          <FaSquareCheck className="text-green-500 mx-auto" />
                        ) : (
                          <PiKeyReturnBold className="text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="px-4 py-2 flex space-x-2 my-3 justify-center">
                        <BookA
                          onClick={() => openReadPopup(book._id)}
                          className="cursor-pointer text-gray-600 hover:text-black"
                          title="View Details"
                        />

                        {/* NEW: Borrow Book Button */}
                        {book.availability && isAuthenticated && user?.role === "User" && (
                          <Hand
                            onClick={() => handleBorrowBook(book._id)}
                            className="cursor-pointer text-green-600 hover:text-green-800"
                            title="Borrow Book"
                          />
                        )}

                        {/* View PDF / Read Book - Only if digital copy exists */}
                        {book.bookFile && book.bookFile.url && (
                          <Download
                            onClick={() => handleViewBook(book)}
                            className="cursor-pointer text-blue-600 hover:text-blue-800"
                            title="View Digital Copy"
                          />
                        )}

                        {/* Favorites Button */}
                        {isAuthenticated && user?.role === "User" && (
                          <Heart
                            onClick={() => handleAddToFavorites(book._id)}
                            className="cursor-pointer text-red-400 hover:text-red-600"
                            title="Add to Favorites"
                          />
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
      </div>
      {/* FIX 1: Pass the readBook object, not the ID */}
      {readBookPopup && readBook && <ReadBookPopup book={readBook} />}
    </>
  );
};

export default Catalog;
