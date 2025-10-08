import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSingleBook } from "../store/slices/bookSlice";
import { toast } from "react-toastify";

const OnlineReader = () => {
  const { id } = useParams(); // Get bookId from URL
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [bookData, setBookData] = useState(null);
  const { loading, error } = useSelector((state) => state.book);

  useEffect(() => {
    if (id) {
      // Use the thunk to fetch book data
      dispatch(getSingleBook(id))
        .then((book) => {
          if (book && book.bookFile && book.bookFile.url) {
            setBookData(book);
          } else {
            toast.error("Digital book file not available.");
            navigate("/"); // Navigate back if no file is found
          }
        })
        .catch(() => {
          // Error handled by Redux slice, toast will show
          navigate("/");
        });
    } else {
      navigate("/");
    }
    // Clear any previous error on cleanup, though slices handle this best
    // dispatch(resetBookSlice());
  }, [dispatch, id, navigate]);

  // Handle Redux error/message feedback in bookSlice.js

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <h1 className="text-3xl font-medium">Loading Book...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-medium text-red-600 mb-4">Error Loading Book</h1>
        <p className="text-gray-700">{error}</p>
        <button
            onClick={() => navigate('/')}
            className="mt-6 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
            Back to Home
        </button>
      </div>
    );
  }

  // Use an iframe to embed the PDF content
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-black text-white p-4 flex justify-between items-center shadow-lg">
        <h1 className="text-xl font-bold truncate">Reading: {bookData?.title}</h1>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition"
        >
          Close Reader
        </button>
      </header>
      <main className="flex-1">
        {bookData && bookData.bookFile.url ? (
          <iframe
            src={bookData.bookFile.url}
            title={bookData.title}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          >
            Your browser does not support PDF embedding. You can download the file directly.
          </iframe>
        ) : (
          <div className="flex justify-center items-center h-full">
            <h1 className="text-2xl text-gray-500">Book file not found.</h1>
          </div>
        )}
      </main>
    </div>
  );
};

export default OnlineReader;
