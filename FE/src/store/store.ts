import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "../modules/auth/slices/AuthSlice";
import TaskSlice from "../modules/task/slices/TaskSlice";
import { logoutMiddleware } from "./middleware/logoutMiddleware";
import { loginMiddleware } from "./middleware/loginMiddleware";
import StatusSlice from "../modules/status/slices/StatusSlice";
import UserSlice from "../modules/user/slices/userSlice";
import DashboardSlice from "../modules/dashboard/slices/dashboardSlice";

export const store = configureStore({
  reducer: {
    auth: AuthSlice.reducer,
    task: TaskSlice.reducer,
    status: StatusSlice.reducer,
    dashboard: DashboardSlice.reducer,
    user: UserSlice.reducer,
  },
  middleware: (getdefaultMiddleware) => {
    return getdefaultMiddleware().concat(loginMiddleware, logoutMiddleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
