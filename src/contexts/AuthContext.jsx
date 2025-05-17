import { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, signupUser, logoutUser, validateToken } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (token) {
        try {
          const isValid = await validateToken(token);
          if (isValid) {
            setIsAuthenticated(true);
            setCurrentUser(user ? JSON.parse(user) : null);
          } else {
            handleLogout();
          }
        } catch (err) {
          console.error('Token validation failed:', err);
          handleLogout();
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await loginUser(email, password);
      const token = data?.status?.token;
      const user = data?.status?.data?.user;

      if (token && user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setIsAuthenticated(true);
        setCurrentUser(user);
        return { success: true };
      } else {
        throw new Error('Invalid login response');
      }
    } catch (err) {
      setError(err.message || 'Failed to login');
      return { success: false, error: err.message };
    }
  };

  const signup = async (email, password, password_confirmation) => {
    setError(null);
    try {
      await signupUser(email, password, password_confirmation);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to signup');
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      handleLogout();
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
