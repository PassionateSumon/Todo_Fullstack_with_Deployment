import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { StatusState } from "../types/Status.interfaces";
import axiosInstance from "../../../common/utils/AxiosInstance";

const initialState: StatusState = {
  statuses: [],
  loading: false,
  error: null,
};

export const createStatus = createAsyncThunk(
  "status/createStatus",
  async ({ name }: { name: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/status/create", { name }, {
        headers: { "X-Skip-Loader": "true" },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create status"
      );
    }
  }
);

export const getAllStatuses = createAsyncThunk(
  "status/getAllStatuses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/status/all");
      // console.log(response.data)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch statuses"
      );
    }
  }
);

export const updateStatus = createAsyncThunk(
  "status/updateStatus",
  async ({ id, name }: { id: number; name: string }, { rejectWithValue, getState }) => {
    try {
      const response = await axiosInstance.put("/status/update", { id, name }, {
        headers: { "X-Skip-Loader": "true" },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        {
          message: error.response?.data?.message || "Failed to update status",
          previousStatuses: (getState() as any).status.statuses

        }
      );
    }
  }
);

export const deleteStatus = createAsyncThunk(
  "status/deleteStatus",
  async ({ id }: { id: number }, { rejectWithValue, getState }) => {
    try {
      const response = await axiosInstance.delete("/status/delete", {
        data: { id },
        headers: { "X-Skip-Loader": "true" }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        {
          message: error.response?.data?.message || "Failed to update status",
          previousStatuses: (getState() as any).status.statuses

        }
      );
    }
  }
);

const StatusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create Status
    builder
      .addCase(createStatus.pending, (state, action: any) => {
        state.loading = false;
        const newStatus = {
          // id: Date.now(),
          id: action.meta.requestId,
          name: action.meta.arg.name,
        }
        state.statuses.push(newStatus);
        state.error = null;
      })
      .addCase(createStatus.fulfilled, (state, action) => {
        state.loading = false;
        // console.log(action.payload)
        const createdStatus = action.payload;
        const index = state.statuses.findIndex(
          (status) => {
            // console.log(JSON.parse(JSON.stringify(status)));
            return status.id === createdStatus.id
          }
        );
        if (index !== -1) {
          // console.log("here")
          state.statuses[index] = createdStatus;
        }
        state.error = null;
      })
      .addCase(createStatus.rejected, (state, action) => {
        state.loading = false;
        state.statuses = state.statuses.filter(
          (status) => status.id !== Number(action.meta.requestId)
        );
        state.error = action.payload as string;
      });

    // Get All Statuses
    builder
      .addCase(getAllStatuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllStatuses.fulfilled, (state, action) => {
        state.loading = false;
        // console.log("104 --> slice --> ", action.payload);
        state.statuses = action.payload;
      })
      .addCase(getAllStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Status
    builder
      .addCase(updateStatus.pending, (state, action: any) => {
        state.loading = false;
        const { id, name } = action.meta.arg;
        const index = state.statuses.findIndex((status) => status.id === id);
        if (index !== -1) {
          state.statuses[index] = { ...state.statuses[index], name };
        }

        state.error = null;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.statusCode === 200) {
          const updatedStatus = action.payload.data;
          const index = state.statuses.findIndex(
            (status) => status.id === updatedStatus.id
          );
          if (index !== -1) {
            state.statuses[index] = updatedStatus;
          }
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(updateStatus.rejected, (state, action: any) => {
        state.loading = false;
        state.statuses = action.payload.previousStatuses;
        state.error = action.payload as string;
      });

    // Delete Status
    builder
      .addCase(deleteStatus.pending, (state, action: any) => {
        state.loading = true;
        const { id } = action.meta.arg;
        state.statuses = state.statuses.filter(
          (status) => status.id !== id
        );
        state.error = null;
      })
      .addCase(deleteStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.statusCode !== 200) {
          state.error = action.payload.message;
        }
      })
      .addCase(deleteStatus.rejected, (state, action: any) => {
        state.loading = false;
        state.statuses = action.payload.previousStatuses;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = StatusSlice.actions;
export default StatusSlice;
