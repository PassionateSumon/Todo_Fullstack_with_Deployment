import { Link } from "react-router-dom";
import { LayoutDashboard, UserPlus, LogIn } from "lucide-react";

const Landing = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#fcfdfe] text-slate-900 font-sans">
            {/* Navbar - Reduced vertical padding */}
            <header className="w-full px-6 md:px-16 py-3.5 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg tracking-tight cursor-pointer">
                    <div className="bg-indigo-600 p-1 rounded-md">
                        <LayoutDashboard className="w-5 h-5 text-white" />
                    </div>
                    Task Vault
                </div>
                <nav className="flex items-center gap-6">
                    <Link
                        to="/login"
                        className="text-slate-500 text-xs font-bold hover:text-indigo-600 transition-colors cursor-pointer uppercase tracking-wider"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/signup"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-indigo-600 transition-all active:scale-95 cursor-pointer shadow-sm"
                    >
                        <UserPlus className="w-3.5 h-3.5" />
                        Join Now
                    </Link>
                </nav>
            </header>

            {/* Hero Section - Optimized spacing and max-width */}
            <main className="flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 py-12 lg:py-20 gap-12 max-w-6xl mx-auto flex-1">
                <div className="lg:w-1/2 space-y-5 text-center lg:text-left">
                    {/* Reduced font sizes from 6xl/5xl to 5xl/4xl */}
                    <h2 className="text-4xl md:text-5xl font-black leading-tight text-slate-900 tracking-tight">
                        Organize your work in the <span className="text-indigo-600">Task Vault</span>
                    </h2>
                    {/* More compact paragraph */}
                    <p className="text-slate-500 text-base md:text-lg max-w-md mx-auto lg:mx-0 leading-relaxed font-medium">
                        The modern standard for task management.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                        <Link
                            to="/signup"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer"
                        >
                            <UserPlus className="w-4 h-4" />
                            Start for Free
                        </Link>
                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
                        >
                            <LogIn className="w-4 h-4 text-indigo-600" />
                            Existing Member?
                        </Link>
                    </div>
                </div>

                {/* Right Content - More compact cards */}
                <div className="lg:w-5/12 relative">
                    {/* Subtle decorative blurs - reduced size */}
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-100 rounded-full blur-[80px] opacity-50"></div>
                    
                    <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="group p-6 bg-white border border-slate-100 rounded-3xl text-center shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-600 transition-colors">
                                <LayoutDashboard className="text-indigo-600 w-6 h-6 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">Dashboard</h3>
                            <p className="text-slate-500 text-xs mt-2 leading-relaxed">Visualize your progress with analytics.</p>
                        </div>
                        
                        <div className="group p-6 bg-white border border-slate-100 rounded-3xl text-center shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 sm:mt-8">
                            <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-violet-600 transition-colors">
                                <UserPlus className="text-violet-600 w-6 h-6 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">Role Control</h3>
                            <p className="text-slate-500 text-xs mt-2 leading-relaxed">Granular permissions for teams.</p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-8 text-center border-t border-slate-50">
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">© 2026 Task Vault Inc.</p>
            </footer>
        </div>
    );
};

export default Landing;