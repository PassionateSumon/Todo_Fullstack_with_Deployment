import { useState, useEffect, type ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword, clearError } from "../slices/AuthSlice";
import type { RootState, AppDispatch } from "../../../store/store";
import { toast } from "react-toastify";

// Interface for form data
interface ResetPasswordForm {
  emailOrUsername: string;
  tempPassword: string;
  newPassword: string;
}

const ResetPassword = () => {
  const [formData, setFormData] = useState<ResetPasswordForm>({
    emailOrUsername: "",
    tempPassword: "",
    newPassword: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  // Show server-side errors as toasts
  useEffect(() => {
    if (error) {
      toast.error(error, { toastId: "reset-password-error" });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>, key: keyof ResetPasswordForm) => {
    setFormData((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    const { emailOrUsername, tempPassword, newPassword } = formData;

    // Basic client-side validation
    if (!emailOrUsername || !tempPassword || !newPassword) {
      toast.error("All fields are required.", { toastId: "reset-password-validation" });
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.", {
        toastId: "reset-password-length",
      });
      return;
    }

    const result = await dispatch(
      resetPassword({ emailOrUsername, tempPassword, newPassword })
    );

    if (resetPassword.fulfilled.match(result)) {
      setFormData({ emailOrUsername: "", tempPassword: "", newPassword: "" });
      toast.success("Password reset successful! Please login.", {
        toastId: "reset-password-success",
      });
      navigate("/login");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F5F6FA]">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96 space-y-6">
        <h2 className="text-2xl font-bold text-[#1A202C] text-center">
          Reset Password
        </h2>

        {/* Email or Username Field */}
        <div className="flex flex-col">
          <label
            htmlFor="emailOrUsername"
            className="text-lg font-medium text-[#1A202C]"
          >
            Email or Username
          </label>
          <input
            id="emailOrUsername"
            type="text"
            value={formData.emailOrUsername}
            onChange={(e) => handleChange(e, "emailOrUsername")}
            className="border border-[#E2E8F0] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4C51BF] transition"
            aria-label="Email or Username"
          />
        </div>

        {/* Temporary Password Field */}
        <div className="flex flex-col">
          <label
            htmlFor="tempPassword"
            className="text-lg font-medium text-[#1A202C]"
          >
            Temporary Password
          </label>
          <input
            id="tempPassword"
            type="password"
            value={formData.tempPassword}
            onChange={(e) => handleChange(e, "tempPassword")}
            className="border border-[#E2E8F0] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4C51BF] transition"
            aria-label="Temporary Password"
          />
        </div>

        {/* New Password Field */}
        <div className="flex flex-col">
          <label
            htmlFor="newPassword"
            className="text-lg font-medium text-[#1A202C]"
          >
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={(e) => handleChange(e, "newPassword")}
            className="border border-[#E2E8F0] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4C51BF] transition"
            aria-label="New Password"
          />
        </div>

        {/* Reset Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full bg-[#4C51BF] hover:bg-[#3C426F] transition text-white font-semibold py-3 rounded-lg shadow-md ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {/* Link to Login */}
        <p className="text-center text-[#1A202C]">
          Back to{" "}
          <Link className="text-[#319795] font-bold" to="/signin">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;