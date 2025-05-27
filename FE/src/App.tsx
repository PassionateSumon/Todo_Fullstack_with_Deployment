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
import type { AppDispatch } from "./store/store";
import { useDispatch } from "react-redux";
import { checkAuthStatus } from "./modules/auth/slices/AuthSlice";
import HomeLayout from "./common/components/HomeLayout";
import TaskPage from "./modules/task/pages/TaskPage";
import AdminDashboard from "./modules/dashboard/components/AdminDashboard";
import GeneralDashboard from "./modules/dashboard/components/GeneralDashboard";
import StatusCRUD from "./modules/status/components/StatusCRUD";
import NotFound from "./common/components/NotFound";
import StatusPage from "./modules/status/pages/StatusPage";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [checkAuth, setCheckAuth] = useState(false);

  useEffect(() => {
    const unsubscribeLoading = loadingManager.subscribe((loading) => {
      setIsLoading(loading);
    });

    return () => {
      unsubscribeLoading();
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
            <Route path="status" element={<StatusPage />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="dashboard/me" element={<GeneralDashboard />} />
            <Route index element={<Navigate to="task" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
