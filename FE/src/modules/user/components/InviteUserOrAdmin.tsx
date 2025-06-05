import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import { signup } from "../../auth/slices/AuthSlice";

const InviteUserOrAdmin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<any>({
    name: '',
    email: '',
    user_type: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    // console.log(`Input value changed: ${e.target.value}`);
    const value = e.target.value;
    setData({
      ...data,
      [key]: value,
    });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // console.log(`Role changed to: ${e.target.value}`);
    const value = e.target.value;
    setData({
      ...data,
      user_type: value,
    });
  };

  const handleSubmit = () => {
    if (!data.name || !data.email || !data.user_type) {
      setError("Please fill in all fields.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email)) {
      setError("Invalid email format.");
      return;
    }

    const password = Math.random().toString(36).slice(-8);
    const userData = {
      name: data.name,
      email: data.email,
      password: password,
      user_type: data.user_type,
    };

    dispatch(signup(userData));
    setError(null);
    setData({
      name: '',
      email: '',
      user_type: '',
    });
  }

  return (
    <div className="flex flex-col space-y-5 w-full h-[50vh] ">
      <h1 className="text-left text-3xl font-bold cursor-pointer p-4 mb-[-2px] ">Invite</h1>
      <div className="flex justify-between items-center p-4 m-3 border-2 border-gray-400 rounded-lg">
        <input type="text" placeholder="Enter Name" value={data.name} onChange={(e) => handleInputChange(e, "name")} className="w-1/4 border border-gray-400 rounded-lg p-2 cursor-pointer " />
        <input type="email" placeholder="Enter Email" value={data.email} onChange={(e) => handleInputChange(e, "email")} className="w-1/4 border border-gray-400 rounded-lg p-2 cursor-pointer " />
        <select name="" id="" value={data.user_type} onChange={handleRoleChange} className="w-1/6 border border-gray-400 rounded-lg p-2 cursor-pointer">
          <option value="">Select Role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button className="bg-[#5A67D8] hover:bg-[#434190] text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 cursor-pointer" onClick={handleSubmit} >Invite</button>
      </div>
      {error && <span className="text-red-500">{error}</span>}
    </div>
  )
}

export default InviteUserOrAdmin