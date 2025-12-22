import { useState, useEffect, type ChangeEvent, type KeyboardEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { otpSend, otpCheck, clearError } from "../slices/AuthSlice";
import type { RootState, AppDispatch } from "../../../store/store";
import { toast } from "react-toastify";
import { ShieldCheck } from "lucide-react";


const Otp = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpForm, setOtpForm] = useState<any>({
    digit1: "",
    digit2: "",
    digit3: "",
    digit4: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { email, loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (error) {
      toast.error(error, { toastId: "otp-error" });
      dispatch(clearError());
    }
  }, [error, dispatch]);

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

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>, digit: any) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === "") {
      setOtpForm((prev: any) => ({ ...prev, [digit]: value }));
      const nextInput = e.target.nextElementSibling as HTMLInputElement;
      if (value && nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    digit: any
  ) => {
    const order = ["digit1", "digit2", "digit3", "digit4"] as const;
    const index = order.indexOf(digit);

    if (e.key === "Backspace") {
      const currentValue = otpForm[digit];

      // If current box has value, just clear it
      if (currentValue) {
        setOtpForm((prev: any) => ({ ...prev, [digit]: "" }));
      } else if (index > 0) {
        const prevKey = order[index - 1];
        setOtpForm((prev: any) => ({ ...prev, [prevKey]: "" }));
        const prev = ((e.target as any).previousElementSibling as HTMLInputElement);
        if (prev) prev.focus();
      }
    }
  };

  const handleVerifyOtp = async () => {
    const otp = `${otpForm.digit1}${otpForm.digit2}${otpForm.digit3}${otpForm.digit4}`;
    if (otp.length !== 4 || !/^[0-9]{4}$/.test(otp)) {
      toast.error("Please enter a valid 4-digit OTP", { toastId: "otp-invalid" });
      return;
    }

    const result = await dispatch(otpCheck({ email: email ?? "", otp }));
    if (otpCheck.fulfilled.match(result)) {
      toast.success("OTP verified successfully!", { toastId: "otp-verify-success" });
      navigate("/home/task", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl space-y-6">
        <h2 className="text-3xl font-bold text-center text-indigo-700 flex justify-center items-center gap-2">
          <ShieldCheck className="w-6 h-6" /> OTP Verification
        </h2>

        <p className="text-center text-gray-700">
          {otpSent ? (
            <>
              Enter the 4-digit OTP sent to{" "}
              <span className="font-semibold text-indigo-600">{email}</span>
            </>
          ) : (
            <>
              We will send an OTP to{" "}
              <span className="font-semibold text-indigo-600">{email}</span>
            </>
          )}
        </p>

        {!otpSent ? (
          <button
            onClick={handleSendOtp}
            disabled={loading}
            className={`w-full text-white font-semibold py-3 rounded-lg transition shadow-md ${loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer "
              }`}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center space-x-4">
              {["digit1", "digit2", "digit3", "digit4"].map((digit, idx) => (
                <input
                  key={digit}
                  type="text"
                  maxLength={1}
                  autoFocus={idx === 0}
                  value={otpForm[digit]}
                  onChange={(e) => handleOtpChange(e, digit)}
                  onKeyDown={(e) => handleKeyDown(e, digit)}
                  className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  aria-label={`OTP digit ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className={`w-full text-white font-semibold py-3 rounded-lg transition shadow-md ${loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer "
                }`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {otpSent && (
          <p className="text-center text-sm text-gray-600">
            Didn’t receive the code?{" "}
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="text-indigo-600 font-semibold hover:underline cursor-pointer "
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
