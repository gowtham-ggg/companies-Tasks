import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth(); 

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">SocialBook</Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-blue-200">Home</Link>
          {user && <Link to="/feed" className="hover:text-blue-200">Feed</Link>}
          {user ? (
            <button 
              onClick={logout} 
              className="bg-red-500 px-4 py-1 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="hover:text-blue-200">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
