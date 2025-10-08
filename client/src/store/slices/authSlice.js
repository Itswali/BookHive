import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null,
    message: null,
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    registerRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
    },
    registerFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    otpVerificationRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    otpVerificationSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    otpVerificationFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    loginRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logoutRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    logoutSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
      state.isAuthenticated = false;
      state.user = null;
    },
    logoutFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    getUserRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    getUserSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    getUserFailed(state) {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    },
    forgotPasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    forgotPasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
    },
    forgotPasswordFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetPasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    resetPasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    resetPasswordFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updatePasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updatePasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
    },
    updatePasswordFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetAuthSlice(state) {
      state.error = null;
      state.loading = false;
      state.message = null;
    }
  }
});

export const {
  registerRequest, registerSuccess, registerFailed,
  otpVerificationRequest, otpVerificationSuccess, otpVerificationFailed,
  loginRequest, loginSuccess, loginFailed,
  logoutRequest, logoutSuccess, logoutFailed,
  getUserRequest, getUserSuccess, getUserFailed,
  forgotPasswordRequest, forgotPasswordSuccess, forgotPasswordFailed,
  resetPasswordRequest, resetPasswordSuccess, resetPasswordFailed,
  updatePasswordRequest, updatePasswordSuccess, updatePasswordFailed,
} = authSlice.actions;

export const resetAuthSlice = () => (dispatch) => {
  dispatch(authSlice.actions.resetAuthSlice());
};

export const register = (data) => async (dispatch) => {
  dispatch(registerRequest());
  try {
    const res = await axios.post("http://localhost:4000/api/v1/auth/register", data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(registerSuccess(res.data));
  } catch (error) {
    dispatch(registerFailed(error.response.data.message));
  }
};

export const otpVerification = (email, otp) => async (dispatch) => {
  dispatch(otpVerificationRequest());
  try {
    const res = await axios.post("http://localhost:4000/api/v1/auth/verify-otp", { email, otp }, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(otpVerificationSuccess(res.data));
  } catch (error) {
    dispatch(otpVerificationFailed(error.response.data.message));
  }
};

export const login = (data) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const res = await axios.post("http://localhost:4000/api/v1/auth/login", data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(loginSuccess(res.data));
  } catch (error) {
    dispatch(loginFailed(error.response.data.message));
  }
};

export const logout = () => async (dispatch) => {
  dispatch(logoutRequest());
  try {
    const res = await axios.get("http://localhost:4000/api/v1/auth/logout", {
      withCredentials: true,
    });
    dispatch(logoutSuccess(res.data.message));
    dispatch(resetAuthSlice());
  } catch (error) {
    dispatch(logoutFailed(error.response.data.message));
  }
};

export const getUser = () => async (dispatch) => {
  dispatch(getUserRequest());
  try {
    const res = await axios.get("http://localhost:4000/api/v1/auth/me", {
      withCredentials: true,
    });
    dispatch(getUserSuccess(res.data));
  } catch (error) {
    dispatch(getUserFailed(error.response.data.message));
  }
};

export const forgotPassword = (email) => async (dispatch) => {
  dispatch(forgotPasswordRequest());
  try {
    const res = await axios.post("http://localhost:4000/api/v1/auth/password/forgot", { email }, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(forgotPasswordSuccess(res.data));
  } catch (error) {
    dispatch(forgotPasswordFailed(error.response.data.message));
  }
};

export const resetPassword = (data, token) => async (dispatch) => {
  dispatch(resetPasswordRequest());
  try {
    const res = await axios.put(`http://localhost:4000/api/v1/auth/password/reset/${token}`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(resetPasswordSuccess(res.data));
  } catch (error) {
    dispatch(resetPasswordFailed(error.response.data.message));
  }
};

export const updatePassword = (data) => async (dispatch) => {
  dispatch(updatePasswordRequest());
  try {
    const res = await axios.put(`http://localhost:4000/api/v1/auth/password/update`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(updatePasswordSuccess(res.data));
  } catch (error) {
    dispatch(updatePasswordFailed(error.response.data.message));
  }
};

export default authSlice.reducer;
