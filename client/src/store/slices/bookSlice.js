import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {toggleAddBookPopup} from "./popUpSlice";


const bookSlice = createSlice({
  name: "book",
  initialState: {
    loading: false,
    error: null,
    message: null,
    books: [],
  },
  reducers: {
    fetchBooksRequest(state){
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchBooksSucess(state, action){
      state.loading = false;
      state.books = action.payload;
    },
    fetchBooksFailed(state, action){
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    addBookRequest(state){
      state.loading = true;
      state.error = null;
      state.message = null
    },
    addBookSuccess(state, action){
      state.loading = false;
      state.message = action.payload;
    },
    addBookFailed(state, action){
      state.loading = false;
      state.error = action.payload;
    },
    // New Reducers for single book fetch
    fetchSingleBookRequest(state){
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchSingleBookFailed(state, action){
      state.loading = false;
      state.error = action.payload;
    },
    // End New Reducers
    resetBookSlice(state){
      state.error = null;
      state.message = null;
      state.loading = false;
    }
  },
});

export const { resetBookSlice } = bookSlice.actions;

export default bookSlice.reducer;

export const fetchAllBooks = () => async (dispatch) => {
  dispatch(bookSlice.actions.fetchBooksRequest());
  await axios.get("http://localhost:4000/api/v1/book/all", { withCredentials: true}).then(res=>{
    dispatch(bookSlice.actions.fetchBooksSucess(res.data.books))
  }).catch(err=>{
    dispatch(bookSlice.actions.fetchBooksFailed(err.response.data.message));
  });
};

// FIX: Removed 'headers: { "Content-Type": "application/json" }' to allow FormData with file upload
export const addBook = (data)=> async(dispatch)=>{
  dispatch(bookSlice.actions.addBookRequest());
  await axios.post("http://localhost:4000/api/v1/book/admin/add", data, {
    withCredentials: true,
    // Headers are now correctly omitted for multipart/form-data
  }).then(res=>{
    dispatch(bookSlice.actions.addBookSuccess(res.data.message));
    dispatch(toggleAddBookPopup());
    dispatch(fetchAllBooks()); // Refresh list after adding book
  }).catch(err=>{
    dispatch(bookSlice.actions.addBookFailed(err.response.data.message));
  });
};

// NEW THUNK: Admin Delete a book
export const deleteBook = (bookId, data) => async(dispatch) => {
  dispatch(bookSlice.actions.addBookRequest()); // Re-using request/loading state for simplicity
  try {
    const res = await axios.delete(`http://localhost:4000/api/v1/book/admin/delete/${bookId}`, data, {
      withCredentials: true,
    });
    dispatch(bookSlice.actions.addBookSuccess(res.data.message));
    dispatch(fetchAllBooks()); // Refresh the book list after deletion
  } catch (err) {
    dispatch(bookSlice.actions.addBookFailed(err.response.data.message));
  }
};


// NEW THUNK: Fetch single book for the OnlineReader component
export const getSingleBook = (bookId) => async (dispatch) => {
  dispatch(bookSlice.actions.fetchSingleBookRequest());
  try {
    const res = await axios.get(`http://localhost:4000/api/v1/book/${bookId}`, { withCredentials: true });
    // Success payload can be returned directly to the component
    return res.data.book;
  } catch (error) {
    dispatch(bookSlice.actions.fetchSingleBookFailed(error.response.data.message));
  }
};
