# 📚 MERN Stack Library Management System

A full-stack application built using the **MERN (MongoDB, Express, React, Node.js)** stack to manage books, user accounts, borrowing records, and digital copies (PDFs). The system features separate dashboards for Admin and User roles.

## ✨ Features

### 🔐 Authentication & Authorization
* **Role-Based Access Control (RBAC):** Separate routes and functionalities for **Admin** and **User**.
* **Secure Authentication:** User registration, login, and secure user sessions using cookies.
* **Password Management:** Functionality for updating credentials.

### 📖 Book Management (Admin)
* **CRUD Operations:** Admins can **Add**, **View**, and **Delete** books.
* **Digital Copy Support:** Upload books with an optional **PDF file** for online viewing/download.
* **Availability Tracking:** Automatic tracking of book quantities and availability status (available/unavailable).

### 👥 User Features
* **Catalog Browsing:** View all available books in the library.
* **Favorites:** Add and remove books from a personalized favorites list.
* **Borrowing:** Users can self-borrow books from the catalog.
* **Borrowed Books:** View a list of currently and previously borrowed books with due dates.
* **Online Reading:** View digital copies (PDFs) of books directly in the browser.

### 👨‍💻 Admin Management
* **Dashboard Overview:** Visualize key metrics like book availability, borrowed books, and user statistics using **Chart.js**.
* **Borrow Record Management:** Admins can **record a new book borrow** for a user (via email) and **record a book return**.
* **User Management:** View a list of all registered users and their borrowing statistics.

***

## ⚙️ Project Structure (Simplified)

| Folder/File | Description |
| :--- | :--- |
| `client/` | **Frontend (React)** application. |
| `server/` | **Backend (Node/Express)** API. |
| &nbsp;&nbsp;`routes/` | API route definitions (`bookRouter.js` included here). |
| &nbsp;&nbsp;`controllers/` | Logic for handling API requests. |
| &nbsp;&nbsp;`middlewares/` | Authentication (`authMiddleware.js`) and authorization logic. |
| `client/src/pages/` | Main components (`Catalog.jsx`, `BookManagement.jsx`, `UserDashboard.jsx`, etc.). |
| `client/src/popups/` | Modal components (`AddBookPopup.jsx`, `ReadBookPopup.jsx`, etc.). |
| `client/src/store/slices/` | Redux Slices (`authSlice.js`, `bookSlice.js`, `borrowSlice.js`, etc.). |

***

## 🛠️ Installation Guide

Follow these steps to set up the project locally.

### Prerequisites
* Node.js (v18+)
* MongoDB Instance (Local or MongoDB Atlas)

### 1. Backend Setup

1.  Navigate into the `server` directory.
    ```bash
    cd server
    ```
2.  Install dependencies.
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `server` directory and add your configuration variables (Example below):
    ```
    # Example .env file for the server
    PORT=4000
    MONGODB_URI=mongodb://localhost:27017/librarydb
    JWT_SECRET=YOUR_SECRET_KEY
    CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
    CLOUDINARY_API_KEY=YOUR_API_KEY
    CLOUDINARY_API_SECRET=YOUR_API_SECRET
    COOKIE_EXPIRE=7d
    ```
4.  Start the backend server.
    ```bash
    npm start  # or npm run dev if you use nodemon
    ```

### 2. Frontend Setup

1.  Navigate into the `client` directory (from the root).
    ```bash
    cd ../client
    ```
2.  Install dependencies.
    ```bash
    npm install
    ```
3.  The frontend is configured to communicate with the backend at `http://localhost:4000/api/v1/` as seen in your Redux thunks (e.g., `http://localhost:4000/api/v1/book/all`). No further configuration is needed unless your backend port changes.

4.  Start the React application.
    ```bash
    npm run dev  # or npm start
    ```

The application should now be accessible in your browser, typically at `http://localhost:5173` or `http://localhost:3000`.
