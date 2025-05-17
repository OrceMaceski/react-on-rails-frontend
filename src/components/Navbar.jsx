import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { isAuthenticated, logout, currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const renderAuthButtons = () => {
    if (isAuthenticated) {
      return (
        <span>
          <span className="mx-2">{currentUser.email}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            aria-label="Logout"
          >
            Logout
          </button>
        </span>
      );
    } else {
      return (
        <>
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md ml-2"
            aria-label="Login"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
            aria-label="Signup"
          >
            Signup
          </Link>
        </>
      );
    }
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/">React on Rails</Link>
        </div>
        <div className="space-x-4">
          <Link to="/" className="hover:text-blue-200">
            Home
          </Link>
          <Link to="/posts" className="hover:text-blue-200">
            Posts
          </Link>
          <Link to="/about" className="hover:text-blue-200">
            About
          </Link>
          {renderAuthButtons()}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;