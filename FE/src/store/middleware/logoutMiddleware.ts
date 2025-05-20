import { logout } from "../../modules/auth/slices/AuthSlice";

//@ts-ignore
export const logoutMiddleware = (store) => (next) => (action) => {
  if (action?.payload?.code === 403 || action?.payload?.code === 401) {
    // console.log(action.payload)
    store.dispatch(logout());
  }
  return next(action);
};
