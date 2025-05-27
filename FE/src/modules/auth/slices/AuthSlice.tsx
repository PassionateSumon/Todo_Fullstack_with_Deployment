import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type {
  AuthState,
  LoginPayload,
  OtpPayload,
  SignupPayload,
} from "../types/Auth.interface";
import axiosInstance from "../../../common/utils/AxiosInstance";
import axios from "axios";

const initialState: AuthState = {
  isLoggedIn: false,
  email: null,
  role: null,
  loading: false,
  error: null,
};

export const signup = createAsyncThunk(
  "auth/signup",
  async (payload: SignupPayload, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/signup", payload);
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/login", payload);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:7030/auth/me", {
        withCredentials: true,
      });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Not authenticated"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (payload: any, { rejectWithValue }) => {
    try {
      await axiosInstance.put("/auth/reset-password", payload);
      return true;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Password reset failed"
      );
    }
  }
);

export const otpSend = createAsyncThunk(
  "auth/otpSend",
  async (email: string, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/otp-send", { email });
      return true;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);

export const otpCheck = createAsyncThunk(
  "auth/otpCheck",
  async (payload: OtpPayload, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/otp-check", payload);
      return true;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/logout");
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    signin: (state, action) => {
      state.isLoggedIn = true;
      state.email = action.payload.email;
    },
  },
  extraReducers: (builder) => {
    // Signup
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: any) => {
        state.loading = false;
        state.isLoggedIn = true;
        // console.log(action.payload);
        state.email = action.payload?.email;
        state.role = action.payload?.role;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // reset password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Check Auth Status
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action: any) => {
        // console.log(action.payload.data);
        state.loading = false;
        state.isLoggedIn = true;
        state.role = action.payload?.data?.user?.role;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.error = action.payload as string;
      })
      // OTP Send
      .addCase(otpSend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(otpSend.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(otpSend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // OTP Check
      .addCase(otpCheck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(otpCheck.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(otpCheck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.email = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, signin } = AuthSlice.actions;
export default AuthSlice;
