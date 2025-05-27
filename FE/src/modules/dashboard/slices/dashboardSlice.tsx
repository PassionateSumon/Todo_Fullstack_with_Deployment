import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../common/utils/AxiosInstance";
import type { dashboardInitialState } from "../types/dashboard.interfaces";

const initialState: dashboardInitialState = {
  dashboardData: [],
  dashboardDataOfActualUser: [],
  loading: false,
  error: null,
};

export const getDashboardData = createAsyncThunk(
  "dashboard/getDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/admin/dashboard");
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard data"
      );
    }
  }
);

export const getDashboardDataOfActualUser = createAsyncThunk(
  "dashboard/getDashboardDataOfActualUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/dashboard/me");
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch dashboard data for actual user"
      );
    }
  }
);

const DashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardData.fulfilled, (state, action: any) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(getDashboardData.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getDashboardDataOfActualUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardDataOfActualUser.fulfilled, (state, action: any) => {
        state.loading = false;
        state.dashboardDataOfActualUser = action.payload;
      })
      .addCase(getDashboardDataOfActualUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default DashboardSlice;
