import axiosInstance from './axiosInstance';

// FIXED: Using email instead of userName
export const loginUser = async (email, password) => {
  const response = await axiosInstance.post('/auth/login', { email, password });

  if (response.data && response.data.token) {
    localStorage.setItem('jwt_token', response.data.token);
  }
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axiosInstance.post('/auth/register', userData);
  return response.data;
};