import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store/store";

const ProtectedRoute = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  // console.log(`ProtectedRoute rendering, isLoggedIn: ${isLoggedIn}`); // Debug log

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
