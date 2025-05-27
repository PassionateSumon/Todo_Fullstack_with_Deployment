export interface AuthState {
  isLoggedIn: boolean;
  email: string | null;
  role: string | null;
  loading: boolean;
  error: string | null;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  user_type?: string;
}

export interface LoginPayload {
  emailOrUsername: string;
  password: string;
}

export interface OtpPayload {
  email: string;
  otp: string;
}

export interface AuthProps {
  from: "signup" | "login";
}

export interface FormData {
  name?: string;
  email?: string;
  emailOrUsername: string;
  password: string;
  user_type?: string;
}