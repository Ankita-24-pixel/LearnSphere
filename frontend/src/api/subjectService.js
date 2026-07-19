import axiosInstance from './axiosInstance';

// Fetch subjects for a specific course
export const getSubjectsByCourseId = async (courseId) => {
  // Note: Adjust this URL if your SubjectController maps this differently
  // (e.g., it might be '/subjects?courseId=' depending on your backend logic)
  const response = await axiosInstance.get(`/courses/${courseId}/subjects`);
  return response.data;
};
export const createSubject = async (subjectData) => {
  // Matches @PostMapping("/subject") in CourseController
  const response = await axiosInstance.post('/course/subject', subjectData);
  return response.data;
};