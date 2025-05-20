import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "../modules/auth/slices/AuthSlice";
import TaskSlice from "../modules/task/slices/TaskSlice";
import { logoutMiddleware } from "./middleware/logoutMiddleware";
import { loginMiddleware } from "./middleware/loginMiddleware";

export const store = configureStore({
  reducer: {
    auth: AuthSlice.reducer,
    task: TaskSlice.reducer,
  },
  middleware: (getdefaultMiddleware) => {
    return getdefaultMiddleware().concat(loginMiddleware, logoutMiddleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
