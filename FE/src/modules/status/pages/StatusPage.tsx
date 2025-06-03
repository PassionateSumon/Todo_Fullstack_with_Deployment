import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllStatuses } from "../slices/StatusSlice";
import type { AppDispatch } from "../../../store/store";

const StatusPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: string;
    task: any;
  }>({
    isOpen: false,
    mode: "add",
    task: null,
  });

  useEffect(() => {
    // dispatch(getAllStatuses());
  }, [dispatch]);

  const handleModalOpen = (mode: "add" | "edit", task: any) => {
    setModalState({ isOpen: true, mode, task });
  };
  const handleModalClose = () => {
    setModalState({ isOpen: false, mode: "add", task: null });
  };
  const handleEditStatus = (status: any) => {
    handleModalOpen("edit", status);
  };

  return <div>
    <div className="flex items-center justify-between mb-4">
      <div></div>
      <button
        onClick={() => handleModalOpen("add", null)}
        className="bg-[#5A67D8] hover:bg-[#434190] text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
      >
        <span>+</span> Add Status
      </button>
    </div>
    {/* Modal for adding/editing status */}
    {modalState.isOpen && (
      <div>
        {/* Your modal content goes here */}
        <h2>{modalState.mode === "add" ? "Add Status" : "Edit Status"}</h2>
        {/* Form for adding/editing status */}
        <button onClick={handleModalClose}>Close</button>
      </div>
    )}
  </div>;
};

export default StatusPage;
