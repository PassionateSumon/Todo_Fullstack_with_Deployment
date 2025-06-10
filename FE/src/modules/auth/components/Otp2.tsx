import React, {
  createRef,
  useEffect,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";

const Otp = ({ box }: { box: number }) => {
  const dynamicArray = Array(box).fill("");
  const refs = Array(box)
    .fill(null)
    .map(() => createRef<HTMLInputElement>());
  const [inputs, setInputs] = useState(dynamicArray);
  const [missing, setMissing] = useState<number[]>([]);
  const PIN = "1234";

  useEffect(() => {
    refs[0].current?.focus();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, ind: number) => {
    const { value } = e.target;
    if (!/^\d$/.test(value)) return;

    const newInputs = [...inputs];
    newInputs[ind] = value;
    setInputs(newInputs);
    setMissing((prev) => prev.filter((i) => i !== ind));

    if (ind < box - 1) {
      refs[ind + 1].current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, ind: number) => {
    if (e.key === "Backspace") {
      const newInputs = [...inputs];
      newInputs[ind] = "";
      setInputs(newInputs);
      if (ind > 0 && !inputs[ind]) {
        refs[ind - 1].current?.focus();
      }
    } else if (e.key === "ArrowLeft" && ind > 0) {
      refs[ind - 1].current?.focus();
    } else if (e.key === "ArrowRight" && ind < box - 1) {
      refs[ind + 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const copied = e.clipboardData.getData("Text").trim();
    if (!/^\d+$/.test(copied) || copied.length !== box) return;
    const final = copied.split("").slice(0, box);
    setInputs(final);
    setMissing([]);
    refs[box - 1].current?.focus();
  };

  const handleSubmit = () => {
    const missed = inputs
      .map((val, i) => (val === "" ? i : null))
      .filter((i) => i !== null) as number[];

    if (missed.length > 0) {
      setMissing(missed);
      return;
    }

    const entered = inputs.join("");
    alert(entered === PIN ? "Valid PIN" : "Invalid PIN");
    setInputs(dynamicArray);
  };

  const handleReset = () => {
    setInputs(dynamicArray);
    setMissing([]);
    refs[0].current?.focus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl space-y-6">
        <h2 className="text-3xl font-bold text-center text-indigo-700">
          OTP Verification
        </h2>
        <p className="text-center text-gray-700">
          Enter the {box}-digit OTP below to continue
        </p>

        <div className="flex justify-center space-x-4">
          {Array(box)
            .fill("")
            .map((_, ind) => (
              <input
                key={ind}
                ref={refs[ind]}
                type={inputs[ind] ? "password" : "text"}
                value={inputs[ind]}
                maxLength={1}
                onChange={(e) => handleInputChange(e, ind)}
                onKeyDown={(e) => handleKeyDown(e, ind)}
                onPaste={handlePaste}
                onFocus={(e) => (e.target.type = "text")}
                onBlur={(e) => (e.target.type = "password")}
                className={`w-12 h-12 text-center text-xl border rounded-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  missing.includes(ind)
                    ? "border-red-500 ring-red-300"
                    : "border-gray-300"
                }`}
              />
            ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition shadow-md"
          >
            Submit
          </button>
          <button
            onClick={handleReset}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg transition shadow-md"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Otp;
