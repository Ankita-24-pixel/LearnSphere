import axiosInstance from './axiosInstance';

export const getUserProfile = async () => {
  // This expects your Spring Boot UserController to have an endpoint that
  // returns the logged-in user's details based on their JWT token.
  const response = await axiosInstance.get('/user/profile');
  return response.data;
};