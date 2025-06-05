import { useEffect, useRef, useState, type FormEvent } from "react";
import type { AppDispatch } from "../../../store/store";
import { useDispatch } from "react-redux";
import { createStatus, updateStatus } from "../slices/StatusSlice";

const StatusModal = ({ isOpen, handleClose, mode, status }: {
  isOpen: boolean;
  handleClose: () => void;
  mode: "add" | "edit";
  status: { id?: string; name?: string };
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode === "edit" && status) {
      setName(status.name || "");
    } else {
      setName("");
    }
  }, [mode, status]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setName("");
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data = { name };

    if (mode === "add") {
      dispatch(createStatus(data));
    } else {
      dispatch(updateStatus({ id: Number(status.id), name: data.name }));
    }

    handleClose();
  };

  const handleCloseModal = () => {
    setName("");
    handleClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed cursor-pointer inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center ">
      <div ref={ref} className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {mode === "add" ? "Add Status" : "Edit Status"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Status Name"
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />

          <div className="flex justify-between gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer "
            >
              {mode === "add" ? "Add" : "Update"}
            </button>
            <button
              type="button"
              onClick={handleCloseModal}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 cursor-pointer "
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusModal;