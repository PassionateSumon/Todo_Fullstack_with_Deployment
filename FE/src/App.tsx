import { useEffect, useState } from "react";
import { loadingManager } from "./common/utils/AxiosInstance";
import { DotLoader } from "react-spinners";
import ToastInit from "./common/utils/ToastInit";
import { Navigate, Route, Routes } from "react-router-dom";
import SignupPage from "./modules/auth/pages/SignupPage";
import LoginPage from "./modules/auth/pages/LoginPage";
import ProtectedRoute from "./common/utils/ProtectedRoute";
import Otp from "./modules/auth/components/Otp";
import ResetPassword from "./modules/auth/components/ResetPassword";
import type { AppDispatch, RootState } from "./store/store";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus } from "./modules/auth/slices/AuthSlice";
import HomeLayout from "./common/components/HomeLayout";
import TaskPage from "./modules/task/pages/TaskPage";
import AdminDashboard from "./modules/dashboard/components/AdminDashboard";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [checkAuth, setCheckAuth] = useState(false);

  useEffect(() => {
    const unsubscribeLoading = loadingManager.subscribe((loading) => {
      // console.log(`Loading state changed: ${loading}`);
      setIsLoading(loading);
    });

    const unsubscribeRefresh = loadingManager.onRefreshSuccess(() => {
      // console.log("Refresh successful, re-checking auth status...");
      dispatch(checkAuthStatus());
    });

    return () => {
      unsubscribeLoading();
      unsubscribeRefresh();
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(checkAuthStatus()).finally(() => setCheckAuth(true));
  }, [dispatch]);

  if (!checkAuth)
    return (
      <DotLoader
        cssOverride={{ position: "fixed", top: "50%", left: "50%" }}
        speedMultiplier={1}
      />
    );

  return (
    <>
      {isLoading && (
        <DotLoader
          cssOverride={{ position: "fixed", top: "50%", left: "50%" }}
          speedMultiplier={1}
        />
      )}
      <ToastInit />

      <Routes>
        <Route path="/" element={<h1>Home normal</h1>} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/otp-verification" element={<Otp />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomeLayout />}>
            <Route path="task" element={<TaskPage />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route index element={<Navigate to="task" replace />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
