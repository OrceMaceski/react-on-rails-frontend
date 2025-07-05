import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { isAuthenticated, logout, currentUser } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderAuthButtons = () => {
    if (isAuthenticated) {
      return (
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
          <span className="text-sm">
            Welcome, {currentUser?.displayName || currentUser?.email}
          </span>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`px-4 py-2 rounded-md transition-colors self-start md:self-center ${
              isLoggingOut
                ? 'bg-red-400 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600'
            } text-white`}
            aria-label="Logout"
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      );
    } else {
      return (
        <div className="flex space-x-2">
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            aria-label="Login"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
            aria-label="Signup"
          >
            Signup
          </Link>
        </div>
      );
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/posts', label: 'Posts' },
    { to: '/about', label: 'About' },
  ];

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold">
          <Link to="/" className="hover:text-blue-200 transition-colors">
            React on Rails
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="hover:text-blue-200 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {renderAuthButtons()}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-blue-700 transition-colors"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-blue-500">
          <div className="flex flex-col space-y-2 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="hover:text-blue-200 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              {renderAuthButtons()}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;