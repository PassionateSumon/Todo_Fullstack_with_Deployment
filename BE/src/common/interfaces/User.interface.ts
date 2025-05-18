export interface signupPayload {
  name: string;
  email: string;
  username: string;
  password: string;
  user_type?: "admin" | "user";
}

export interface LoginPayload {
  emailOrUsername: string;
  password: string;
}

export interface ResetPasswordPayload {
  emailOrUsername: string;
  tempPassword: string;
  newPassword: string;
}
