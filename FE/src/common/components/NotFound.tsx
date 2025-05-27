import { Link } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
        Page Not Found
      </p>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/home/task"
        className="inline-flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
