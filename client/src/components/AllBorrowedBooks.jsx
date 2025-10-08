import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { PiKeyReturnBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchAllBorrowedBooks, resetBorrowSlice } from "../store/slices/borrowSlice";
import { toggleReturnBookPopup } from "../store/slices/popUpSlice";
import Header from "../layout/Header";
import ReturnBookPopup from "../popups/ReturnBookPopup";

const AllBorrowedBooks = () => {
  const dispatch = useDispatch();
  const { allBorrowedBooks, loading, error, message } = useSelector(
    (state) => state.borrow
  );
  const { returnBookPopup } = useSelector((state) => state.popup);

  const [returnRecordId, setReturnRecordId] = useState(null);

  // Fetch all borrowed records on component mount
  useEffect(() => {
    dispatch(fetchAllBorrowedBooks());
  }, [dispatch]);

  // Handle messages/errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetBorrowSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, error, message]);

  const handleReturnBook = (recordId) => {
    setReturnRecordId(recordId);
    dispatch(toggleReturnBookPopup());
  };

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getFullYear())}`;
  };

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center mb-6">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            All Borrowed Records (Admin View)
          </h2>
        </header>

        {loading && <p className="text-center text-gray-500">Loading borrowed records...</p>}

        {!loading && allBorrowedBooks.length > 0 ? (
          <div className="overflow-auto bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="px-4 py-2 text-left">S.No.</th>
                  <th className="px-4 py-2 text-left">User Email</th>
                  <th className="px-4 py-2 text-left">Book Title</th>
                  <th className="px-4 py-2 text-left">Borrowed On</th>
                  <th className="px-4 py-2 text-left">Due Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {allBorrowedBooks.map((record, index) => (
                  <tr
                    key={record._id}
                    className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2 font-medium">{record.borrowerEmail}</td>
                    <td className="px-4 py-2">{record.bookTitle}</td>
                    <td className="px-4 py-2">{formatDate(record.borrowedDate)}</td>
                    <td className={`px-4 py-2 font-medium ${
                        !record.returned && new Date(record.dueDate) < new Date() ? 'text-red-600' : 'text-gray-700'
                    }`}>{formatDate(record.dueDate)}</td>
                    <td className="px-4 py-2 text-center">
                        {record.returned ? (
                            <FaCheck className="text-green-600 inline-block" title="Returned" />
                        ) : (
                            <FaTimes className="text-red-600 inline-block" title="Not Returned" />
                        )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {!record.returned && (
                        <PiKeyReturnBold
                          onClick={() => handleReturnBook(record._id)}
                          className="cursor-pointer text-blue-600 w-6 h-6 hover:text-blue-800 mx-auto"
                          title="Record Book Return"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && <p className="text-center text-gray-500">No books have been borrowed yet.</p>
        )}
      </main>
      {returnBookPopup && returnRecordId && (
        <ReturnBookPopup borrowRecordId={returnRecordId} />
      )}
    </>
  );
};

export default AllBorrowedBooks;
