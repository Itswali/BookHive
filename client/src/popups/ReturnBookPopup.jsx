import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { toggleReturnBookPopup } from "../store/slices/popUpSlice";
import { returnBook } from "../store/slices/borrowSlice";

// Assumes this is used for Admin to return a book for a user
const ReturnBookPopup = ({ borrowRecordId }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const { loading } = useSelector((state) => state.borrow);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter the user's email.");
      return;
    }
    // Dispatch the returnBook thunk with the email and the record ID
    dispatch(returnBook(email, borrowRecordId));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
      <div className="w-11/12 bg-white rounded-lg shadow-lg sm:w-1/2 lg:w-1/3">
        <div className="flex justify-between bg-black text-white px-6 py-4 rounded-t-lg">
          <h2 className="text-lg font-bold">Return Book Record</h2>
          <button
            className="text-white text-lg font-bold"
            onClick={() => dispatch(toggleReturnBookPopup())}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              User Email
            </label>
            <input
              type="email"
              placeholder="Enter user's email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              type="button"
              onClick={() => dispatch(toggleReturnBookPopup())}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
              type="submit"
              disabled={loading}
            >
              {loading ? "Returning..." : "Confirm Return"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnBookPopup;
