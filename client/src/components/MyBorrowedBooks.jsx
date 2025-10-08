import React, { useState, useEffect } from "react";
import { BookA, Loader2 } from "lucide-react"; // <--- Added Loader2 for loading state
import { PiKeyReturnBold } from "react-icons/pi"; // <--- NEW IMPORT for return icon
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify"; // <--- NEW IMPORT for toasts
import { fetchUserBorrowedBooks, userReturnBook, resetBorrowSlice } from "../store/slices/borrowSlice"; // <--- Added userReturnBook and resetBorrowSlice
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
import Header from "../layout/Header";
import ReadBookPopup from "../popups/ReadBookPopup";

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();
  const { books } = useSelector((state) => state.book);
  const {
    userBorrowedBooks,
    loading: borrowLoading, // <--- Added borrowLoading
    error: borrowError,     // <--- Added borrowError
    message: borrowMessage, // <--- Added borrowMessage
  } = useSelector((state) => state.borrow);
  const { readBookPopup } = useSelector((state) => state.popup);

  const [readBook, setReadBook] = useState({});
  const [filter, setFilter] = useState("non-returned"); // Changed default filter to non-returned

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchUserBorrowedBooks());
  }, [dispatch]);

  // Handle messages/errors for borrowed books slice
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

  const openReadPopup = (id) => {
    const book = books.find((book) => book._id === id);
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getFullYear())}`;

    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    const result = `${formattedDate} ${formattedTime}`;
    return result;
  };

  // --- NEW HANDLER FOR RETURN BOOK ---
  const handleReturnBook = (borrowRecordId) => {
    // Dispatch the action to return the book
    dispatch(userReturnBook(borrowRecordId));
  };
  // ------------------------------------

  const returnedBooks = userBorrowedBooks?.filter((book) => book.returned);
  const nonReturnedBooks = userBorrowedBooks?.filter((book) => !book.returned);

  const booksToDisplay = filter === "returned" ? returnedBooks : nonReturnedBooks;

  const getBookDueDateClass = (record) => {
    // Only apply red text if the book is NOT returned and the due date has passed
    if (!record.returned && new Date(record.dueDate) < new Date()) {
        return 'text-red-600 font-bold';
    }
    return 'text-gray-700';
  }


  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        {/* Sub Header */}
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            My Borrowed Books
          </h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter("non-returned")}
              className={`px-4 py-2 rounded-md font-semibold transition ${
                filter === "non-returned"
                  ? "bg-black text-white"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
            >
              Non-Returned ({nonReturnedBooks?.length || 0})
            </button>
            <button
              onClick={() => setFilter("returned")}
              className={`px-4 py-2 rounded-md font-semibold transition ${
                filter === "returned"
                  ? "bg-black text-white"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
            >
              Returned ({returnedBooks?.length || 0})
            </button>
          </div>
        </header>

        {/* Loading Indicator */}
        {borrowLoading && (
            <div className="flex justify-center items-center mt-6">
                <Loader2 className="animate-spin h-8 w-8 text-black" />
                <p className="ml-2 text-gray-700">Loading records...</p>
            </div>
        )}

        {/* Table */}
        {!borrowLoading && booksToDisplay && booksToDisplay.length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">No.</th>
                  <th className="px-4 py-2 text-left">Book Title</th>
                  <th className="px-4 py-2 text-left">Date & Time</th>
                  <th className="px-4 py-2 text-left">Due Date</th>
                  <th className="px-4 py-2 text-left">Returned</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {booksToDisplay.map((book, index) => (
                  <tr key={index} className={(index + 1)% 2 === 0 ? "bg-gray-50" : ""}>
                       <td className="px-4 py-2">{index + 1}</td>
                       <td className="px-4 py-2">{book.bookTitle}</td>
                       <td className="px-4 py-2">{formatDate(book.borrowedDate)}</td>
                       <td className={`px-4 py-2 ${getBookDueDateClass(book)}`}>{formatDate(book.dueDate)}</td>
                       <td className="px-4 py-2">{book.returned ? "Yes" : "No"}</td>
                       <td className="px-4 py-2 flex space-x-4 justify-center">
                           <BookA
                            onClick={() => openReadPopup(book.bookId)}
                            className="cursor-pointer text-blue-600 hover:text-blue-800 w-5 h-5"
                            title="View Book Info"
                           />
                           {!book.returned && ( // Show return button only if not returned
                                <PiKeyReturnBold
                                    onClick={() => handleReturnBook(book._id)} // Pass the borrowed record ID
                                    className="cursor-pointer text-green-600 hover:text-green-800 w-5 h-5"
                                    title="Return Book"
                                />
                           )}
                       </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : filter === "returned" ? (
            !borrowLoading && <h3 className="text-3xl mt-5 font-medium text-center">No returned books found!</h3>
          ) : (
            !borrowLoading && <h3 className="text-3xl mt-5 font-medium text-center" > No non-returned books found!</h3>
          )
        }

      </main>
      {readBookPopup && <ReadBookPopup book={readBook}/>}
    </>
  );
};

export default MyBorrowedBooks;
