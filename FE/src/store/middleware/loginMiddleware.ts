import { signin } from "../../modules/auth/slices/AuthSlice";


export const loginMiddleware = (store: any) => (next: any) => (action: any) => {
  // console.log("action error: ", action.error);
  if (action.type === "auth/validate/fulfilled") {
    // console.log(action)
    store.dispatch(signin(action?.payload));
  }

  return next(action);
};