import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const favoriteSlice = createSlice({
  name: "favorite",
  initialState: {
    loading: false,
    error: null,
    message: null,
    myFavorites: [],
  },
  reducers: {
    // Fetch Favorites
    fetchFavoritesRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchFavoritesSuccess(state, action) {
      state.loading = false;
      state.myFavorites = action.payload;
    },
    fetchFavoritesFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Add/Remove Favorite
    toggleFavoriteRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    toggleFavoriteSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    toggleFavoriteFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    resetFavoriteSlice(state) {
      state.error = null;
      state.message = null;
      state.loading = false;
    },
  },
});

export const {
  resetFavoriteSlice,
} = favoriteSlice.actions;

// Async Thunks

// Fetch user's favorite books
export const fetchMyFavorites = () => async (dispatch) => {
  dispatch(favoriteSlice.actions.fetchFavoritesRequest());
  try {
    const res = await axios.get("http://localhost:4000/api/v1/favorite/my-favorites", { withCredentials: true });
    dispatch(favoriteSlice.actions.fetchFavoritesSuccess(res.data.favoriteBooks));
  } catch (error) {
    dispatch(favoriteSlice.actions.fetchFavoritesFailed(error.response.data.message));
  }
};

// Add a book to favorites
export const addToFavorites = (bookId) => async (dispatch) => {
  dispatch(favoriteSlice.actions.toggleFavoriteRequest());
  try {
    const res = await axios.put(`http://localhost:4000/api/v1/favorite/add/${bookId}`, {}, { withCredentials: true });
    dispatch(favoriteSlice.actions.toggleFavoriteSuccess(res.data.message));
    dispatch(fetchMyFavorites()); // Refresh favorites list
  } catch (error) {
    dispatch(favoriteSlice.actions.toggleFavoriteFailed(error.response.data.message));
  }
};

// Remove a book from favorites
export const removeFromFavorites = (bookId) => async (dispatch) => {
  dispatch(favoriteSlice.actions.toggleFavoriteRequest());
  try {
    const res = await axios.put(`http://localhost:4000/api/v1/favorite/remove/${bookId}`, {}, { withCredentials: true });
    dispatch(favoriteSlice.actions.toggleFavoriteSuccess(res.data.message));
    dispatch(fetchMyFavorites()); // Refresh favorites list
  } catch (error) {
    dispatch(favoriteSlice.actions.toggleFavoriteFailed(error.response.data.message));
  }
};

export default favoriteSlice.reducer;
