import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { resetBorrowSlice } from "../store/slices/borrowSlice";
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
import Header from "../layout/Header";

// Icons (assuming asset paths are correct and will be used)
import returnIcon from "../assets/redo.png";
import browseIcon from "../assets/pointing.png";
import bookIcon from "../assets/book-square.png";
import heartIcon from "../assets/heart-black.png"; // Assuming a heart icon for favorites

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

const UserDashboard = ({ setSelectedComponent }) => {
  const dispatch = useDispatch();

  // Redux State Selectors
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { userBorrowedBooks, loading: borrowLoading, error: borrowError } =
    useSelector((state) => state.borrow);

  // Handle Redux errors/messages
  useEffect(() => {
    if (borrowError) {
      toast.error(borrowError);
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, borrowError]);

  // --- Summary Data Calculations ---
  const totalBorrowedRecords = userBorrowedBooks ? userBorrowedBooks.length : 0;
  const returnedBooks = userBorrowedBooks
    ? userBorrowedBooks.filter((book) => book.returned).length
    : 0;
  const notReturnedBooks = totalBorrowedRecords - returnedBooks;
  const totalFavoriteBooks =
    user && user.favoriteBooks ? user.favoriteBooks.length : 0;

  // Overdue Books calculation
  const overdueBooks = userBorrowedBooks
    ? userBorrowedBooks.filter(
        (book) =>
          !book.returned && new Date(book.dueDate) < new Date()
      ).length
    : 0;

  // --- Chart Data: Borrowing Status ---
  const chartData = {
    labels: ["Returned", "Not Returned", "Overdue"],
    datasets: [
      {
        data: [returnedBooks, notReturnedBooks - overdueBooks, overdueBooks],
        backgroundColor: ["#10B981", "#F59E0B", "#EF4444"], // Green, Yellow/Amber, Red
        hoverBackgroundColor: ["#059669", "#D97706", "#DC2626"],
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
        text: "My Borrowing Status",
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
        className={`p-3 rounded-full`}
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
            Welcome Back, {user?.name.split(" ")[0]}!
          </h2>
        </header>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Borrowed Records"
            value={totalBorrowedRecords}
            icon={bookIcon}
            bgColor="#3B82F6" // Blue
            loading={borrowLoading}
          />
          <StatCard
            title="Books to Return"
            value={notReturnedBooks}
            icon={returnIcon}
            bgColor="#F59E0B" // Amber/Yellow
            loading={borrowLoading}
          />
          <StatCard
            title="Overdue Books"
            value={overdueBooks}
            icon={returnIcon}
            bgColor="#EF4444" // Red
            loading={borrowLoading}
          />
          <StatCard
            title="Favorite Books"
            value={totalFavoriteBooks}
            icon={heartIcon}
            bgColor="#DC2626" // Red
            loading={!isAuthenticated} // Use auth loading as proxy for user data
          />
        </div>

        {/* Charts and Quick Actions Section */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart: Borrowing Status */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-80">
              <Pie data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold mb-4 border-b pb-2">
                Quick Actions
              </h3>
              <p className="text-gray-600 mb-6">
                Jump directly to the most important sections.
              </p>
            </div>
            <div className="space-y-4">
              <button
                className="w-full py-3 bg-black text-white rounded-md font-semibold text-lg hover:bg-gray-800 transition"
                onClick={() => setSelectedComponent("Catalog")}
              >
                Browse Catalog
              </button>
              <button
                className="w-full py-3 bg-gray-200 text-black rounded-md font-semibold text-lg hover:bg-gray-300 transition"
                onClick={() => setSelectedComponent("My Borrowed Books")}
              >
                View My Borrowed Books
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default UserDashboard;
