import axiosInstance from './axiosInstance';

// -----------------------------------------
// PREVIOUS FUNCTIONS (Restored)
// -----------------------------------------

export const getChaptersBySubjectId = async (subjectId) => {
  const response = await axiosInstance.get(`/course/subject/${subjectId}/chapters`);
  return response.data;
};

// THIS IS THE MISSING FUNCTION THAT CAUSED THE CRASH!
export const getContentByChapterId = async (chapterId) => {
  const response = await axiosInstance.get(`/course/chapter/${chapterId}/content`);
  return response.data;
};

export const createChapter = async (chapterData) => {
  const response = await axiosInstance.post('/course/chapter', chapterData);
  return response.data;
};


// -----------------------------------------
// NEW CASCADING DROPDOWN FUNCTIONS
// -----------------------------------------

export const getYearsByCourseId = async (courseId) => {
  const response = await axiosInstance.get(`/course/${courseId}/years`);
  return response.data;
};

export const getSubjectsByYearId = async (semId) => {
  const response = await axiosInstance.get(`/course/year/${semId}/subjects`);
  return response.data;
};

export const getTopicsByChapterId = async (chapterId) => {
  const response = await axiosInstance.get(`/course/chapter/${chapterId}/topics`);
  return response.data;
};
// Add these exports so your + Add buttons can use them
export const createYear = async (yearData) => {
  const response = await axiosInstance.post('/course/year', yearData);
  return response.data;
};

export const createSubject = async (subjectData) => {
  const response = await axiosInstance.post('/course/subject', subjectData);
  return response.data;
};


export const createTopic = async (topicData) => {
  const response = await axiosInstance.post('/course/topic', topicData);
  return response.data;
};
export const getContentByTopicId = async (topicId) => {
  const response = await axiosInstance.get(`/content/topic/${topicId}/paginated?page=0&size=50`);
    return response.data.content;
};
export const likeContent = async (contentId) => {
  // Calls your @PutMapping("/{id}/like") endpoint
  const response = await axiosInstance.put(`/content/${contentId}/like`);
  return response.data;
};