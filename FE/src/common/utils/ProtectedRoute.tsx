import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../../store/store";

const ProtectedRoute = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  if (isLoggedIn && (location.pathname === "/login" || location.pathname === "/otp-verification")) {
    return <Navigate to="/home/task" replace />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
