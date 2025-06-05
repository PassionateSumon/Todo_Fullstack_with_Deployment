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

export const toggleStatus = createAsyncThunk("/user/toggle", async (id: number, { rejectWithValue, getState }) => {
  try {
    const res = await axiosInstance.put(`/user/toggle-active/${id}`, {}, {
      headers: { "X-Skip-Loader": "true" }
    })
    return res.data;
  } catch (error: any) {
    const state = getState() as any;
    const userIndex = state.dashboard.dashboardData.allIsActiveUsers.findIndex(
      (user: any) => user.id === id
    );
    const previousUser =
      userIndex !== -1
        ? state.dashboard.dashboardData.allIsActiveUsers[userIndex]
        : null;
    const previousActiveUsers = state.dashboard.dashboardData.activeUsers;
    return rejectWithValue({
      message:
        error.response?.data?.message ||
        "An error occurred while toggling the status.",
      previousUser,
      previousActiveUsers,
    });
  }
})

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
      })
      .addCase(toggleStatus.pending, (state: any, action) => {
        state.loading = false;
        const id = action.meta.arg;
        const userIndex = state.dashboardData.allIsActiveUsers.findIndex(
          (user: any) => user.id === id
        );
        if (userIndex !== -1) {
          const currentIsActive = state.dashboardData.allIsActiveUsers[userIndex].isActive;
          state.dashboardData.allIsActiveUsers[userIndex] = {
            ...state.dashboardData.allIsActiveUsers[userIndex],
            isActive: !currentIsActive,
          };
          // Update activeUsers count optimistically
          state.dashboardData.activeUsers = currentIsActive
            ? state.dashboardData.activeUsers - 1
            : state.dashboardData.activeUsers + 1;
        }
        state.error = null;
      })
      .addCase(toggleStatus.fulfilled, (state: any, action) => {
        state.loading = false;
        const updatedUser = action.payload;
        if (updatedUser && updatedUser.id) {
          const userIndex = state.dashboardData.allIsActiveUsers.findIndex(
            (user: any) => user.id === updatedUser.id
          );
          if (userIndex !== -1) {
            state.dashboardData.allIsActiveUsers[userIndex] = updatedUser;
          }
        } else {
          state.error = "Failed to update user status: Invalid response";
        }
      })
      .addCase(toggleStatus.rejected, (state: any, action: any) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to toggle user status";
        const previousUser = action.payload.previousUser;
        const previousActiveUsers = action.payload.previousActiveUsers;
        if (previousUser) {
          const userIndex = state.dashboardData.allIsActiveUsers.findIndex(
            (user: any) => user.id === previousUser.id
          );
          if (userIndex !== -1) {
            state.dashboardData.allIsActiveUsers[userIndex] = previousUser;
            // Revert activeUsers count
            state.dashboardData.activeUsers = previousActiveUsers;
          }
        }
      });
  },
});

export default DashboardSlice;
