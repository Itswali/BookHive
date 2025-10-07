import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSingleBook } from "../store/slices/bookSlice";
import { toast } from "react-toastify";

const OnlineReader = () => {
  const { bookId } = useParams();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.book);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [bookUrl, setBookUrl] = useState(null);
  const [bookTitle, setBookTitle] = useState("");
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && bookId) {
      const fetchBook = async () => {
        setFetchError(null);
        try {
          // getSingleBook thunk returns the book object on success
          const book = await dispatch(getSingleBook(bookId));
          if (book && book.bookFile && book.bookFile.url) {
            setBookUrl(book.bookFile.url);
            setBookTitle(book.title);
          } else if (book) {
            setFetchError("This book does not have an online reading file.");
          } else {
            setFetchError("Failed to fetch book or book not found.");
          }
        } catch (err) {
          // Async errors are typically caught and handled in the slice,
          // but this provides a fallback UI for an unhandled error.
          setFetchError("An unexpected error occurred while fetching the book.");
        }
      };
      fetchBook();
    }
  }, [bookId, isAuthenticated, dispatch]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-3xl font-bold">Loading Book...</h1>
      </div>
    );
  }

  if (fetchError || !bookUrl) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center p-4">
        <h1 className="text-3xl font-bold text-red-600">Error</h1>
        <p className="text-xl mt-4">{fetchError || "Book file not available."}</p>
        <button
          onClick={() => window.history.back()}
          className="mt-6 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full">
      <header className="bg-black text-white p-4 flex justify-between items-center shadow-lg">
        <h1 className="text-xl font-semibold truncate">{bookTitle || "Online Book Reader"}</h1>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-1 bg-gray-700 rounded-md hover:bg-gray-600 transition"
        >
          Close Reader
        </button>
      </header>
      <main className="flex-1">
        {/* Using an iframe to display the PDF. Set style to ensure full viewport usage. */}
        <iframe
          src={bookUrl}
          title={bookTitle || "Online Book"}
          className="w-full h-full"
          frameBorder="0"
          style={{ width: '100%', height: '100%', border: 'none' }}
        >
          <p className="p-4 text-center">Your browser does not support iframes. You can download the PDF to view it.</p>
        </iframe>
      </main>
    </div>
  );
};

export default OnlineReader;
