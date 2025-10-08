import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toggleRecordBookPopup, toggleReturnBookPopup } from "./popUpSlice";
import { fetchAllBooks } from "./bookSlice"; // Assumed fetchAllBooks is defined in bookSlice and imported

const borrowSlice = createSlice({
  name: "borrow",
  initialState: {
    loading: false,
    error: null,
    userBorrowedBooks: [],
    allBorrowedBooks: [], // List of all borrowed records for Admin
    message: null,
  },
  reducers: {
    // User Borrowed Books Fetch
    fetchUserBorrowedBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchUserBorrowedBooksSuccess(state, action) {
      state.loading = false;
      state.userBorrowedBooks = action.payload;
    },
    fetchUserBorrowedBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Admin Record Borrow
    recordBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    recordBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    recordBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // User Self-Borrow
    borrowBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    borrowBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    borrowBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Admin Fetch All Borrowed Books
    fetchAllBorrowedBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchAllBorrowedBooksSuccess(state, action) {
      state.loading = false;
      state.allBorrowedBooks = action.payload;
    },
    fetchAllBorrowedBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Admin Return Book Request
    returnBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    returnBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    returnBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // *** NEW REDUCERS FOR USER SELF-RETURN ***
    userReturnBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    userReturnBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    userReturnBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    // *****************************************

    resetBorrowSlice(state) {
      state.error = null;
      state.message = null;
      state.loading = false;
    },
  },
});

export const {
  resetBorrowSlice,
  fetchUserBorrowedBooksRequest,
  fetchUserBorrowedBooksSuccess,
  fetchUserBorrowedBooksFailed,
  recordBookRequest,
  recordBookSuccess,
  recordBookFailed,
  borrowBookRequest,
  borrowBookSuccess,
  borrowBookFailed,
  fetchAllBorrowedBooksRequest,
  fetchAllBorrowedBooksSuccess,
  fetchAllBorrowedBooksFailed,
  returnBookRequest,
  returnBookSuccess,
  returnBookFailed,
  // *** NEW EXPORTS ***
  userReturnBookRequest,
  userReturnBookSuccess,
  userReturnBookFailed,
  // *******************
} = borrowSlice.actions;

export default borrowSlice.reducer;

// Async Thunks

export const fetchUserBorrowedBooks = () => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchUserBorrowedBooksRequest());
  await axios.get("https://bookhive-digital.onrender.com/api/v1/borrow/my-borrowed-books", { withCredentials: true }).then(res => {
    dispatch(borrowSlice.actions.fetchUserBorrowedBooksSuccess(res.data.borrowedBooks));
  }).catch(err => {
    dispatch(borrowSlice.actions.fetchUserBorrowedBooksFailed(err.response.data.message));
  });
};

export const fetchAllBorrowedBooks = () => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchAllBorrowedBooksRequest());
  await axios.get("https://bookhive-digital.onrender.com/api/v1/borrow/borrowed-books-by-users", { withCredentials: true }).then(res => {
    dispatch(borrowSlice.actions.fetchAllBorrowedBooksSuccess(res.data.borrowedBooks));
  }).catch(err => {
    dispatch(borrowSlice.actions.fetchAllBorrowedBooksFailed(err.response.data.message));
  });
};

// ADMIN: Record a new borrow
export const recordBorrowBook = (email, id) => async (dispatch) => {
  dispatch(borrowSlice.actions.recordBookRequest());
  await axios.post(`https://bookhive-digital.onrender.com/api/v1/borrow/record-borrow-book/${id}`, {email}, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  }).then(res=> {
    dispatch(borrowSlice.actions.recordBookSuccess(res.data.message));
    dispatch(toggleRecordBookPopup());
    dispatch(fetchAllBooks()); // Update book availability in BookManagement
    dispatch(fetchAllBorrowedBooks()); // Update Admin list
  }).catch(err=> {
    dispatch(borrowSlice.actions.recordBookFailed(err.response.data.message));
  });
};

// USER: Self-borrow a book
export const borrowBook = (bookId) => async (dispatch) => {
  dispatch(borrowSlice.actions.borrowBookRequest());
  try {
    const res = await axios.post(`https://bookhive-digital.onrender.com/api/v1/borrow/user-borrow-book/${bookId}`, {}, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(borrowSlice.actions.borrowBookSuccess(res.data.message));
    dispatch(fetchAllBooks());
    dispatch(fetchUserBorrowedBooks());
  } catch (error) {
    dispatch(borrowSlice.actions.borrowBookFailed(error.response.data.message));
  }
};

// ADMIN: Return a borrowed book record (via email)
export const returnBook = (email, id) => async (dispatch)=> {
  dispatch(borrowSlice.actions.returnBookRequest());
  await axios.post(`https://bookhive-digital.onrender.com/api/v1/borrow/return-borrowed-book/${id}`, {email}, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  }
).then(res=>{
  dispatch(borrowSlice.actions.returnBookSuccess(res.data.message));
  dispatch(fetchAllBorrowedBooks()); // Refresh Admin's list of all borrowed books
  dispatch(fetchAllBooks()); // Update book availability
  dispatch(toggleReturnBookPopup());
}).catch(err=> {
  dispatch(borrowSlice.actions.returnBookFailed(err.response.data.message));
});
};

// *** NEW THUNK: USER SELF-RETURN ***
export const userReturnBook = (borrowRecordId) => async (dispatch) => {
  dispatch(borrowSlice.actions.userReturnBookRequest());
  try {
    const res = await axios.put(`https://bookhive-digital.onrender.com/api/v1/borrow/user-return-book/${borrowRecordId}`, {}, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(borrowSlice.actions.userReturnBookSuccess(res.data.message));
    dispatch(fetchUserBorrowedBooks()); // Refresh user's list
    dispatch(fetchAllBooks()); // Update book availability
  } catch (error) {
    dispatch(borrowSlice.actions.userReturnBookFailed(error.response.data.message));
  }
};
