import axiosInstance from './axiosInstance';

// Upload new content to a specific topic
export const uploadContent = async (contentData) => {
  // Your backend ContentController expects a POST to /content
  const response = await axiosInstance.post('/content', contentData);
  return response.data;
};