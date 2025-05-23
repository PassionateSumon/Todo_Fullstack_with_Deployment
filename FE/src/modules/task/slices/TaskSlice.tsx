import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../common/utils/AxiosInstance";
import type { TaskState } from "../types/Task.interface";

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
};

export const createTask = createAsyncThunk(
  "task/createTask",
  async (
    payload: {
      name: string;
      description?: string;
      status: string;
      priority?: "high" | "medium" | "low";
      start_date?: string;
      end_date?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/task/create", payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create task"
      );
    }
  }
);

export const getAllTasks = createAsyncThunk(
  "task/getAllTasks",
  async (
    payload: {
      viewType?: "kanban" | "compact" | "calendar" | "table";
      id?: number | null;
    } = { viewType: "compact", id: null },
    { rejectWithValue }: { rejectWithValue: (value: any) => void }
  ) => {
    const { viewType = "compact", id = null } = payload;
    try {
      const response = await axiosInstance.get(`/task/all/${viewType}/${id}`);
      //   console.log(response)
      return { viewType, data: response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tasks"
      );
    }
  }
);

export const getSingleTask = createAsyncThunk(
  "task/getSingleTask",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/task/single/${id}`);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch task"
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  "task/updateTask",
  async (
    {
      id,
      payload,
    }: {
      id: number;
      payload: {
        name?: string;
        description?: string;
        status?: string;
        priority?: "high" | "medium" | "low";
        start_date?: string;
        end_date?: string;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(`/task/update/${id}`, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task"
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/task/delete/${id}`);
      return { id, data: response };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete task"
      );
    }
  }
);

const TaskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.tasks)) {
          state.tasks.push(action.payload);
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get All Tasks
      .addCase(getAllTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTasks.fulfilled, (state, action: any) => {
        state.loading = false;
        state.tasks = action.payload.data;
      })
      .addCase(getAllTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Single Task
      .addCase(getSingleTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleTask.fulfilled, (state, action: any) => {
        state.loading = false;
        state.currentTask = action.payload;
      })
      .addCase(getSingleTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action: any) => {
        state.loading = false;
        if (Array.isArray(state.tasks)) {
          const index = state.tasks.findIndex(
            (task) => task.id === action.payload.id
          );
          if (index !== -1) {
            state.tasks[index] = action.payload;
          }
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.tasks)) {
          state.tasks = state.tasks.filter(
            (task) => task.id !== action.payload.id
          );
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = TaskSlice.actions;
export default TaskSlice;
