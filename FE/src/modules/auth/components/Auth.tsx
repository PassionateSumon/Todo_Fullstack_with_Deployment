import {
  AtSign,
  Lock,
  Mail,
  User,
} from "lucide-react"; // Install: npm i lucide-react
import { useState, type ChangeEvent, type FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login, signup, clearError } from "../slices/AuthSlice";
import type { AppDispatch, RootState } from "../../../store/store";
import type { AuthProps, FormData } from "../types/Auth.interface";
import { toast } from "react-toastify";

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const getFieldError = (
  field: keyof FormData,
  formData: FormData,
  from: "signup" | "login"
) => {
  const value = formData[field]?.trim() || "";

  if (from === "signup") {
    if (field === "name" && !value) return "Name is required.";
    if (field === "email") {
      if (!value) return "Email is required.";
      if (!isEmail(value)) return "Invalid email format.";
    }
    if (field === "password" && !value) return "Password is required.";
  } else {
    if (field === "emailOrUsername") {
      if (!value) return "Email or Username is required.";
      if (isEmail(value) === false && value.includes("@"))
        return "Invalid email format.";
    }
    if (field === "password" && !value) return "Password is required.";
  }
  return null;
};

const Auth: FC<AuthProps> = ({ from }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    emailOrUsername: "",
    password: "",
    user_type: "admin",
  });

  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof FormData, string | null>>
  >({});

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (error) {
      toast.error(error, { toastId: "auth-error" });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    key: keyof FormData
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));

    const err = getFieldError(key, { ...formData, [key]: value }, from);
    setFieldErrors((prev) => ({
      ...prev,
      [key]: err || "",
    }));
  };

  const handleSubmit = async () => {
    const newErrors: Partial<Record<keyof FormData, string | null>> = {};

    const fields = from === "signup"
      ? ["name", "email", "password"]
      : ["emailOrUsername", "password"];

    fields.forEach((field) => {
      newErrors[field as keyof FormData] = getFieldError(
        field as keyof FormData,
        formData,
        from
      );
    });

    setFieldErrors(newErrors);
    if (Object.values(newErrors).some((err) => err)) return;

    const action = from === "signup"
      ? signup({
        name: formData.name!,
        email: formData.email!,
        password: formData.password,
        user_type: formData.user_type,
      })
      : login({
        emailOrUsername: formData.emailOrUsername,
        password: formData.password,
      });

    // @ts-expect-error: dispatch type mismatch for async thunk
    const result = await dispatch(action);

    if ((from === "signup" && signup.fulfilled.match(result)) ||
      (from === "login" && login.fulfilled.match(result))) {
      setFormData({
        name: "",
        email: "",
        emailOrUsername: "",
        password: "",
        user_type: "admin",
      });
      setFieldErrors({});
      toast.success(`${from === "signup" ? "Signup" : "Login"} successful!`, {
        toastId: "auth-success",
      });
      navigate(from === "signup" ? "/reset-password" : "/otp-verification");
    }
  };

  const renderInput = (
    label: string,
    key: keyof FormData,
    type: string,
    Icon: any
  ) => (
    <div className="space-y-1">
      <label htmlFor={key} className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className={`flex items-center border rounded-lg px-3 py-2 ${fieldErrors[key] ? "border-red-500" : "border-gray-300 focus-within:ring-2 focus-within:ring-indigo-500"}`}>
        <Icon className="text-gray-400 w-5 h-5 mr-2" />
        <input
          id={key}
          type={type}
          value={formData[key] as string}
          onChange={(e) => handleChange(e, key)}
          className="w-full outline-none bg-transparent text-sm"
        />
      </div>
      {fieldErrors[key] && (
        <span className="text-sm text-red-500">{fieldErrors[key]}</span>
      )}
    </div>
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f1f5f9] px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {from === "signup" ? "Create Account" : "Welcome Back"}
        </h2>

        {from === "signup" && renderInput("Name", "name", "text", User)}

        {from === "signup"
          ? renderInput("Email", "email", "email", Mail)
          : renderInput("Email or Username", "emailOrUsername", "text", AtSign)}

        {renderInput("Password", "password", "password", Lock)}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer `}
        >
          {loading ? "Please wait..." : "Submit"}
        </button>

        <p className="text-sm text-center text-gray-600">
          {from === "signup" ? (
            <>
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 font-semibold">
                Login
              </Link>
            </>
          ) : (
            <div className="flex flex-col ">
              <div>
                Don't have an account?{" "}
                <Link to="/signup" className="text-indigo-600 font-semibold">
                  Sign up
                </Link>
              </div>
              <div>
                Don't reset password?{" "}
                <Link to="/reset-password" className="text-indigo-600 font-semibold">
                  Reset password
                </Link>
              </div>

            </div>
          )}
        </p>
      </div>
    </div>
  );
};

export default Auth;
