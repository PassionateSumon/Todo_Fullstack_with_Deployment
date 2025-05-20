import { useState, type ChangeEvent, type FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login, signup, clearError } from "../slices/AuthSlice";
import type { AppDispatch, RootState } from "../../../store/store";
import type { AuthProps, FormData } from "../types/Auth.interface";
import { toast } from "react-toastify";

// Utility function to detect email
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

  // Show server-side errors as toasts only once
  useEffect(() => {
    if (error) {
      toast.error(error, { toastId: "auth-error" });
      dispatch(clearError()); // Clear the error after displaying
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

    if (from === "signup") {
      ["name", "email", "password"].forEach((field) => {
        newErrors[field as keyof FormData] = getFieldError(
          field as keyof FormData,
          formData,
          from
        );
      });
    } else {
      ["emailOrUsername", "password"].forEach((field) => {
        newErrors[field as keyof FormData] = getFieldError(
          field as keyof FormData,
          formData,
          from
        );
      });
    }

    setFieldErrors(newErrors);

    if (Object.values(newErrors).some((err) => err)) return;

    if (from === "signup") {
      const result = await dispatch(
        signup({
          name: formData.name!,
          email: formData.email!,
          password: formData.password,
          user_type: formData.user_type,
        })
      );
      if (signup.fulfilled.match(result)) {
        setFormData({
          name: "",
          email: "",
          emailOrUsername: "",
          password: "",
          user_type: "admin",
        });
        setFieldErrors({});
        toast.success("Signup successful! Please reset your password.", {
          toastId: "signup-success",
        });
        navigate("/reset-password");
      }
    } else {
      const result = await dispatch(
        login({
          emailOrUsername: formData.emailOrUsername,
          password: formData.password,
        })
      );
      if (login.fulfilled.match(result)) {
        setFormData({
          name: "",
          email: "",
          emailOrUsername: "",
          password: "",
          user_type: "admin",
        });
        setFieldErrors({});
        toast.success("Login successful! Please verify OTP.", {
          toastId: "login-success",
        });
        navigate("/otp-verification");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F5F6FA]">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96 space-y-6">
        <h2 className="text-2xl font-bold text-[#1A202C] text-center">
          {from === "signup" ? "Sign Up" : "Login"}
        </h2>

        {from === "signup" && (
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="text-lg font-medium text-[#1A202C]"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange(e, "name")}
              className={`border rounded-lg p-2 focus:outline-none transition ${
                fieldErrors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#E2E8F0] focus:ring-2 focus:ring-[#4C51BF]"
              }`}
              aria-label="Name"
            />
            {fieldErrors.name && (
              <span className="text-sm text-red-500">{fieldErrors.name}</span>
            )}
          </div>
        )}

        <div className="flex flex-col">
          <label
            htmlFor="emailOrUsername"
            className="text-lg font-medium text-[#1A202C]"
          >
            {from === "signup" ? "Email" : "Email or Username"}
          </label>
          <input
            id="emailOrUsername"
            type={from === "signup" ? "email" : "text"}
            value={
              from === "signup" ? formData.email : formData.emailOrUsername
            }
            onChange={(e) =>
              handleChange(e, from === "signup" ? "email" : "emailOrUsername")
            }
            className={`border rounded-lg p-2 focus:outline-none transition ${
              from === "signup"
                ? fieldErrors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#E2E8F0] focus:ring-2 focus:ring-[#4C51BF]"
                : fieldErrors.emailOrUsername
                ? "border-red-500 focus:ring-red-500"
                : "border-[#E2E8F0] focus:ring-2 focus:ring-[#4C51BF]"
            }`}
            aria-label={from === "signup" ? "Email" : "Email or Username"}
          />
          {from === "signup" && fieldErrors.email && (
            <span className="text-sm text-red-500">{fieldErrors.email}</span>
          )}
          {from === "login" && fieldErrors.emailOrUsername && (
            <span className="text-sm text-red-500">
              {fieldErrors.emailOrUsername}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="text-lg font-medium text-[#1A202C]"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange(e, "password")}
            className={`border rounded-lg p-2 focus:outline-none transition ${
              fieldErrors.password
                ? "border-red-500 focus:ring-red-500"
                : "border-[#E2E8F0] focus:ring-2 focus:ring-[#4C51BF]"
            }`}
            aria-label="Password"
          />
          {fieldErrors.password && (
            <span className="text-sm text-red-500">{fieldErrors.password}</span>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full bg-[#4C51BF] hover:bg-[#3C426F] transition text-white font-semibold py-3 rounded-lg shadow-md ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Loading..." : "Submit"}
        </button>

        {from === "signup" ? (
          <p className="text-center text-[#1A202C]">
            Already signed up? Go to{" "}
            <Link className="text-[#319795] font-bold" to="/signin">
              Login
            </Link>
          </p>
        ) : (
          <p className="text-center text-[#1A202C]">
            Not signed up? Go to{" "}
            <Link className="text-[#319795] font-bold" to="/signup">
              Signup
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;
