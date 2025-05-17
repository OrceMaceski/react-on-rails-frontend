import api from './api';

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/login', { user: { email, password } });
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data);
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};

export const signupUser = async (email, password, password_confirmation) => {
  try {
    const response = await api.post('/signup', {
      user: { email, password, password_confirmation },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Signup failed');
  }
};

export const logoutUser = async () => {
  try {
    await api.delete('/logout');
    return { success: true };
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Logout failed');
  }
};

// Add this function to validate the token
export const validateToken = async (token) => {
  try {
    const response = await api.get('/validate_token', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.valid; // Assuming the backend returns { valid: true/false }
  } catch (error) {
    console.error('Token validation error:', error.response?.data);
    return false;
  }
};