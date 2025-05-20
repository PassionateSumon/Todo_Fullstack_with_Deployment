import { useState, useEffect, type ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { otpSend, otpCheck, clearError } from "../slices/AuthSlice";
import type { RootState, AppDispatch } from "../../../store/store";
import { toast } from "react-toastify";

// Interface for OTP input
interface OtpForm {
  digit1: string;
  digit2: string;
  digit3: string;
  digit4: string;
}

const Otp = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpForm, setOtpForm] = useState<OtpForm>({
    digit1: "",
    digit2: "",
    digit3: "",
    digit4: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { email, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  // Show server-side errors as toasts
  useEffect(() => {
    if (error) {
      toast.error(error, { toastId: "otp-error" });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Handle sending OTP
  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Email is missing. Cannot send OTP.", { toastId: "otp-email-missing" });
      return;
    }
    const result = await dispatch(otpSend(email));
    if (otpSend.fulfilled.match(result)) {
      setOtpSent(true);
      toast.success("OTP sent successfully!", { toastId: "otp-sent" });
    }
  };

  // Handle OTP input change and auto-focus
  const handleOtpChange = (
    e: ChangeEvent<HTMLInputElement>,
    digit: keyof OtpForm
  ) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === "") {
      setOtpForm((prev) => ({ ...prev, [digit]: value }));
      const nextInput = e.target.nextElementSibling as HTMLInputElement;
      if (value && nextInput) nextInput.focus();
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    const otp = `${otpForm.digit1}${otpForm.digit2}${otpForm.digit3}${otpForm.digit4}`;
    if (otp.length !== 4 || !/^[0-9]{4}$/.test(otp)) {
      toast.error("Please enter a valid 4-digit OTP", {
        toastId: "otp-invalid",
      });
      return;
    }

    const result = await dispatch(otpCheck({ email: email ?? "", otp }));
    if (otpCheck.fulfilled.match(result)) {
      toast.success("OTP verified successfully!", {
        toastId: "otp-verify-success",
      });
      navigate("/home");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F5F6FA]">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96 space-y-6">
        <h2 className="text-2xl font-bold text-[#1A202C] text-center">
          OTP Verification
        </h2>

        {/* Display email */}
        <p className="text-center text-[#1A202C]">
          An OTP will be sent to <span className="font-semibold">{email}</span>
        </p>

        {/* Send OTP Button */}
        {!otpSent ? (
          <button
            onClick={handleSendOtp}
            disabled={loading}
            className={`w-full bg-[#4C51BF] hover:bg-[#3C426F] transition text-white font-semibold py-3 rounded-lg shadow-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        ) : (
          <div className="space-y-6">
            {/* OTP Input Boxes */}
            <div className="flex justify-center space-x-4">
              {["digit1", "digit2", "digit3", "digit4"].map((digit, idx) => (
                <input
                  key={digit}
                  type="text"
                  maxLength={1}
                  value={otpForm[digit as keyof OtpForm]}
                  onChange={(e) => handleOtpChange(e, digit as keyof OtpForm)}
                  className="w-12 h-12 text-center text-xl border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4C51BF] transition"
                  aria-label={`OTP digit ${idx + 1}`}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className={`w-full bg-[#4C51BF] hover:bg-[#3C426F] transition text-white font-semibold py-3 rounded-lg shadow-md ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {/* Resend OTP Link */}
        {otpSent && (
          <p className="text-center text-[#1A202C]">
            Didn’t receive OTP?{" "}
            <button
              onClick={handleSendOtp}
              className="text-[#319795] font-bold"
              disabled={loading}
            >
              Resend OTP
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default Otp;
