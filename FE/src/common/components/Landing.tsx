import { Link } from "react-router-dom";
import { LayoutDashboard, UserPlus, LogIn } from "lucide-react";

const Landing = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900">
            {/* Navbar */}
            <header className="w-full px-8 py-4 shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
                    <LayoutDashboard className="w-6 h-6" />
                    Task Vault
                </div>
                <nav className="space-x-4">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-1 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 transition"
                    >
                        <LogIn className="w-4 h-4" />
                        Sign In
                    </Link>
                    <Link
                        to="/signup"
                        className="inline-flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                    >
                        <UserPlus className="w-4 h-4" />
                        Sign Up
                    </Link>
                </nav>
            </header>

            {/* Hero Section */}
            <main className="flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-20 gap-10 flex-1">
                <div className="md:w-1/2 space-y-6 text-center md:text-left">
                    <h2 className="text-4xl font-extrabold leading-tight">
                        Welcome to <span className="text-indigo-600">Task Valut</span>
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Build modern apps faster with seamless authentication and clean UI.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                        <Link
                            to="/signup"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                        >
                            <UserPlus className="w-5 h-5" />
                            Get Started
                        </Link>
                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition"
                        >
                            <LogIn className="w-5 h-5" />
                            Already Registered?
                        </Link>
                    </div>
                </div>

                {/* Right Content - You can add stats or keep it minimal */}
                <div className="md:w-1/2 grid grid-cols-2 gap-6">
                    <div className="p-6 border rounded-xl text-center shadow-sm">
                        <LayoutDashboard className="mx-auto mb-2 text-indigo-600 w-8 h-8" />
                        <p className="font-semibold text-gray-700">User Dashboard</p>
                    </div>
                    <div className="p-6 border rounded-xl text-center shadow-sm">
                        <UserPlus className="mx-auto mb-2 text-indigo-600 w-8 h-8" />
                        <p className="font-semibold text-gray-700">Role Management</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Landing;
