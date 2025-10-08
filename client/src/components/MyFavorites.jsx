import React, { useEffect, useState } from "react";
import { BookA } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
import { removeFromFavorites, fetchMyFavorites, resetFavoriteSlice } from "../store/slices/favoriteSlice";
import { toast } from "react-toastify";
import Header from "../layout/Header";
import ReadBookPopup from "../popups/ReadBookPopup";

const MyFavorites = () => {
  const dispatch = useDispatch();
  const { loading, error, message, myFavorites } = useSelector((state) => state.favorite);
  const { readBookPopup } = useSelector((state) => state.popup);

  const [readBook, setReadBook] = useState({});

  useEffect(() => {
    // Check for messages/errors from favorite operations
    if (error) {
      toast.error(error);
      dispatch(resetFavoriteSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetFavoriteSlice());
    }
  }, [dispatch, error, message]);

  const openReadPopup = (book) => {
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };

  const handleRemoveFavorite = (bookId) => {
    dispatch(removeFromFavorites(bookId));
  };

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        {/* Sub Header */}
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-x1 font-medium md:text-2x1 md:font-semibold">
            My Favorite Books
          </h2>
        </header>

        {/* Table/List */}
        {loading ? (
          <p className="text-xl mt-5">Loading favorites...</p>
        ) : myFavorites && myFavorites.length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Author</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myFavorites.map((book, index) => (
                  <tr
                    key={book._id}
                    className={(index + 1) % 2 == 0 ? "bg-gray-50" : ""}
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{book.title}</td>
                    <td className="px-4 py-2">{book.author}</td>
                    <td className="px-4 py-2 flex space-x-4 my-3 justify-center">
                      <BookA
                        className="cursor-pointer"
                        onClick={() => openReadPopup(book)}
                        title="View Info"
                      />

                      <button onClick={() => handleRemoveFavorite(book._id)} title="Remove from Favorites">
                        <FaHeart className="text-red-600 w-5 h-5 hover:text-red-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h3 className="text-3xl mt-5 font-medium"> No favorite books found!</h3>
        )}
      </main>
      {readBookPopup && <ReadBookPopup book={readBook} />}
    </>
  );
};

export default MyFavorites;
