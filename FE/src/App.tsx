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
import TaskPage from "./modules/task/pages/TaskPage";
import HomeLayout from "./common/components/HomeLayout";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [checkAuth, setCheckAuth] = useState(false);

  useEffect(() => {
    const unsubscribe = loadingManager.subscribe((loading) => {
      setIsLoading(loading);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    dispatch(checkAuthStatus()).finally(() => setCheckAuth(true));
  }, [dispatch]);

  // Re-check auth status when isLoading transitions from true to false
  useEffect(() => {
    if (!isLoading && checkAuth) {
      console.log("Loading finished, re-checking auth status...");
      dispatch(checkAuthStatus());
    }
  }, [isLoading, checkAuth, dispatch]);

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
            <Route index element={<Navigate to="task" replace />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;

/*
const allowedPriorities = ["high", "medium", "low"] as const;
    const priority = allowedPriorities.includes(formData.priority as any)
      ? (formData.priority as "high" | "medium" | "low")
      : undefined;

*/
