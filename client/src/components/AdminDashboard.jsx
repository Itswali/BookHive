import React, { useEffect, useState } from "react";
import adminIcon from "../assets/pointing.png"; // Assuming asset path is correct
import usersIcon from "../assets/people-black.png"; // Assuming asset path is correct
import bookIcon from "../assets/book-square.png"; // Assuming asset path is correct
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";
import Header from "../layout/Header"; // Assuming Header is in "../layout/Header"
import { resetBookSlice } from "../store/slices/bookSlice";
import { resetBorrowSlice } from "../store/slices/borrowSlice";

// Register Chart.js components (already in the original snippet)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

const AdminDashboard = () => {
  const dispatch = useDispatch();

  // Redux State Selectors
  const { users, loading: userLoading, error: userError } = useSelector(
    (state) => state.user
  );
  const { books, loading: bookLoading, error: bookError } = useSelector(
    (state) => state.book
  );
  const { allBorrowedBooks, loading: borrowLoading, error: borrowError } =
    useSelector((state) => state.borrow);

  // Handle Redux messages/errors
  useEffect(() => {
    if (bookError) {
      toast.error(bookError);
      dispatch(resetBookSlice());
    }
    if (borrowError) {
      toast.error(borrowError);
      dispatch(resetBorrowSlice());
    }
    // userSlice does not have a message or reset, but handling the errors is good practice.
  }, [dispatch, bookError, borrowError]);

  // --- Summary Data Calculations ---
  const totalUsers = users ? users.filter((u) => u.role === "User").length : 0;
  const totalBooks = books ? books.length : 0;
  const totalBorrowedBooks = allBorrowedBooks
    ? allBorrowedBooks.length
    : 0;

  // --- Book Availability for Pie Chart ---
  const availableBooks = books
    ? books.filter((book) => book.availability).length
    : 0;
  const unavailableBooks = books
    ? totalBooks - availableBooks
    : 0;

  // --- Chart Data ---
  const chartData = {
    labels: ["Available Books", "Unavailable Books"],
    datasets: [
      {
        data: [availableBooks, unavailableBooks],
        backgroundColor: ["#34D399", "#EF4444"], // Green for available, Red for unavailable
        hoverBackgroundColor: ["#10B981", "#DC2626"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Book Availability Status",
      },
    },
  };

  // Helper component for the dashboard stats card
  const StatCard = ({ title, value, icon, bgColor, loading }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between transition-transform duration-300 hover:scale-[1.02]">
      <div>
        <h3 className="text-gray-500 font-medium">{title}</h3>
        {loading ? (
          <p className="mt-1 text-2xl font-bold">Loading...</p>
        ) : (
          <p className="mt-1 text-4xl font-bold text-gray-800">{value}</p>
        )}
      </div>
      <div
        className={`p-3 rounded-full ${bgColor} bg-opacity-10`}
        style={{ backgroundColor: bgColor, opacity: 0.1 }}
      >
        <img src={icon} alt={`${title} Icon`} className="w-8 h-8 opacity-100" />
      </div>
    </div>
  );

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        {/* Sub Header */}
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            Admin Dashboard
          </h2>
        </header>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Books"
            value={totalBooks}
            icon={bookIcon}
            bgColor="#3B82F6" // Blue
            loading={bookLoading}
          />
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon={usersIcon}
            bgColor="#10B981" // Green
            loading={userLoading}
          />
          <StatCard
            title="Total Borrowed Records"
            value={totalBorrowedBooks}
            icon={adminIcon}
            bgColor="#F59E0B" // Amber/Yellow
            loading={borrowLoading}
          />
        </div>

        {/* Charts Section */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart: Book Availability */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-80">
              <Pie data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Placeholder for another chart or stats */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <p className="text-gray-700">
                <span className="font-semibold">Available Books:</span>{" "}
                {availableBooks}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Unavailable Books:</span>{" "}
                {unavailableBooks}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Avg. Book Price:</span> $
                {totalBooks > 0
                  ? (
                      books.reduce((sum, book) => sum + book.price, 0) /
                      totalBooks
                    ).toFixed(2)
                  : "0.00"}
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;
