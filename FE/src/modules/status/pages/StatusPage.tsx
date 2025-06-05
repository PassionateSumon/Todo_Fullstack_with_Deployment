import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteStatus, getAllStatuses } from "../slices/StatusSlice";
import type { AppDispatch, RootState } from "../../../store/store";
import StatusModal from "../components/StatusModal";

const StatusPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { statuses } = useSelector((state: RootState) => state.status);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    status: any;
  }>({
    isOpen: false,
    mode: "add",
    status: null,
  });

  useEffect(() => {
    dispatch(getAllStatuses());
  }, [dispatch]);

  const handleModalOpen = (mode: "add" | "edit", status: any) => {
    setModalState({ isOpen: true, mode, status });
  };
  const handleModalClose = () => {
    setModalState({ isOpen: false, mode: "add", status: null });
  };
  const handleEditStatus = (status: any) => {
    handleModalOpen("edit", status);
  };
  const handleDeleteStatus = (status: any) => {
    dispatch(deleteStatus({ id: Number(status.id) }));
  };

  return (
    <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-md h-[93vh] ">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Statuses</h1>
        <button
          onClick={() => handleModalOpen("add", null)}
          className="bg-[#5A67D8] hover:bg-[#434190] text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
        >
          + Add Status
        </button>
      </div>

      <div className="w-full max-h-[90%] overflow-y-auto rounded-lg shadow-md thin-scrollbar ">
        <table className="w-full border border-gray-200 rounded-xl shadow-lg ">
          <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold tracking-wider">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {statuses.map((status) => (
              <tr
                key={status.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="p-4 text-gray-800 text-sm font-medium">{status.id}</td>
                <td className="p-4 text-gray-800 text-sm font-medium">{status.name}</td>
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleEditStatus.bind(null, status)}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors duration-150 hover:underline cursor-pointer "
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDeleteStatus.bind(null, status)}
                      className="text-red-600 hover:text-red-800 font-semibold text-sm transition-colors duration-150 hover:underline cursor-pointer "
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <StatusModal
        isOpen={modalState.isOpen}
        handleClose={handleModalClose}
        mode={modalState.mode}
        status={modalState.status}
      />
    </div>
  );
};

export default StatusPage;
