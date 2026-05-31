import axiosInstance from './axiosInstance';

// Fetch all courses from the backend
export const getAllCourses = async () => {
  const response = await axiosInstance.get('/course');
  return response.data;
};

// Fetch a single course by ID
export const getCourseById = async (courseId) => {
  const response = await axiosInstance.get(`/course/${courseId}`);
  return response.data;
};

// Create a new course
export const createCourse = async (courseData) => {
  const response = await axiosInstance.post('/course', courseData);
  return response.data;
};