import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { getYearsByCourseId, getSubjectsByYearId, getChaptersBySubjectId, getTopicsByChapterId ,getContentByTopicId, likeContent} from '../api/hierarchyService';
const Dashboard = () => {

  // 1. Core Data State
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Drill-Down State (What is currently clicked?)
  const [activeCourse, setActiveCourse] = useState(null);
  const [years, setYears] = useState([]);

  const [activeYear, setActiveYear] = useState(null);
  const [subjects, setSubjects] = useState([]);

    const [activeSubject, setActiveSubject] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [topics, setTopics] = useState([]);

    const [activeChapter, setActiveChapter] = useState(null);


    const [activeTopic, setActiveTopic] = useState(null);
      const [topicContent, setTopicContent] = useState([]);

  // Fetch Initial Courses on Load
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get('/course');
        setCourses(response.data);
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Handler: When a Course is clicked
  const handleCourseClick = async (course) => {
    setActiveCourse(course);
    setActiveYear(null); // Reset lower levels
    setSubjects([]);     // Reset lower levels

    try {
      const fetchedYears = await getYearsByCourseId(course.id);
      setYears(fetchedYears);
    } catch (err) {
      console.error("Failed to fetch years", err);
    }
  };

  // Handler: When a Year is clicked
  const handleYearClick = async (year) => {
    setActiveYear(year);
    try {
      const fetchedSubjects = await getSubjectsByYearId(year.id);
      setSubjects(fetchedSubjects);
    } catch (err) {
      console.error("Failed to fetch subjects", err);
    }
  };

// Handler: When a Subject is clicked (View Chapters)
  const handleSubjectClick = async (subject) => {
    setActiveSubject(subject);
    // If we had topics state here, we would reset it: setActiveTopic(null)
    try {
      const fetchedChapters = await getChaptersBySubjectId(subject.id);
      setChapters(fetchedChapters);
    } catch (err) {
      console.error("Failed to fetch chapters", err);
    }
  };
// Handler: When a Chapter is clicked (View Topics)
  const handleChapterClick = async (chapter) => {
    setActiveChapter(chapter);
    setActiveTopic(null); // Reset content view
    try {
      const fetchedTopics = await getTopicsByChapterId(chapter.id);
      setTopics(fetchedTopics);
    } catch (err) {
      console.error("Failed to fetch topics", err);
    }
  };
// Handler: When a Topic is clicked (Fetch REAL Content)
  const handleTopicClick = async (topic) => {
    setActiveTopic(topic);

    try {
      // Fetching the real content from your database!
      const fetchedContent = await getContentByTopicId(topic.id);
      setTopicContent(fetchedContent);
    } catch (err) {
      console.error("Failed to fetch content", err);
      setTopicContent([]); // Clear the view if it fails
    }
  };
// Handler: When the Like button is clicked
  const handleLike = async (e, contentId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const updatedContent = await likeContent(contentId);

      setTopicContent((prevContent) =>
        prevContent.map((item) =>
          item.id === contentId ? {
            ...item,
            likes: updatedContent.likes,
            // FIXED: Removed the "is" so it matches your backend perfectly!
            likedByCurrentUser: updatedContent.likedByCurrentUser
          } : item
        )
      );
    } catch (err) {
      console.error("Failed to like content", err);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500 font-semibold text-xl animate-pulse">Loading Workspace...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Content Explorer</h1>
          <p className="text-gray-600 mt-1">Navigate your curriculum hierarchy.</p>
        </div>
      </header>

      {/* --- BREADCRUMB NAVIGATION --- */}
      {(activeCourse) && (
        <div className="flex items-center space-x-2 mb-6 text-sm font-medium text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <button onClick={() => setActiveCourse(null)} className="hover:text-indigo-600">All Courses</button>

          {activeCourse && (
            <>
              <span>/</span>
              <button onClick={() => setActiveYear(null)} className={`hover:text-indigo-600 ${!activeYear ? 'text-indigo-600 font-bold' : ''}`}>
                {activeCourse.name}
              </button>
            </>
          )}

          {activeYear && (
            <>
              <span>/</span>
              <span className="text-indigo-600 font-bold">Sem {activeYear.sem}</span>
            </>
          )}
        </div>
      )}
  {/* NEW: Subject Breadcrumb */}
              {activeSubject && (
                <>
                  <span>/</span>
                  <span className="text-indigo-600 font-bold">{activeSubject.name}</span>
                </>
              )}

      {/* --- LEVEL 1: COURSES (Only show if no course is selected) --- */}
      {!activeCourse && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => handleCourseClick(course)}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                {course.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-lg font-bold text-gray-900">{course.name}</h3>
              <p className="text-sm text-gray-500 mt-2">Click to view semesters →</p>
            </div>
          ))}
        </div>
      )}

      {/* --- LEVEL 2: YEARS (Only show if Course is selected, but no Year is selected) --- */}
      {activeCourse && !activeYear && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Semesters / Years for {activeCourse.name}</h2>
          {years.length === 0 ? (
            <p className="text-gray-500 bg-white p-4 rounded-lg border border-dashed">No semesters added yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {years.map((year) => (
                <div
                  key={year.id}
                  onClick={() => handleYearClick(year)}
                  className="bg-white p-4 rounded-lg border border-gray-200 hover:border-indigo-500 cursor-pointer hover:shadow-sm text-center"
                >
                  <p className="text-lg font-bold text-gray-800">Semester {year.sem}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- LEVEL 3: SUBJECTS (Only show if Year is selected, but no Subject is selected) --- */}
            {activeYear && !activeSubject && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Subjects for Semester {activeYear.sem}</h2>
                {subjects.length === 0 ? (
                  <p className="text-gray-500 bg-white p-4 rounded-lg border border-dashed">No subjects added yet.</p>
                ) : (
                  <div className="space-y-3">
                    {subjects.map((subject) => (
                      <div key={subject.id} className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center hover:border-indigo-300 transition-colors">
                        <div>
                          <h3 className="font-bold text-gray-900">{subject.name}</h3>
                          <p className="text-xs text-gray-500">ID: {subject.id}</p>
                        </div>
                        {/* FIXED: Hooked up the click handler here! */}
                        <button
                          onClick={() => handleSubjectClick(subject)}
                          className="px-4 py-2 text-sm bg-indigo-50 text-indigo-700 font-semibold rounded-md hover:bg-indigo-100 transition-colors"
                        >
                          View Chapters
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* --- LEVEL 4: CHAPTERS (Only show if Subject is selected) --- */}
            {activeSubject && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Chapters in {activeSubject.name}</h2>
                {chapters.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-8 text-center border border-dashed border-gray-300">
                     <p className="text-gray-500">No chapters added yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {chapters.map((chapter, index) => (
                      <div key={chapter.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                            {index + 1}
                          </div>
                          <h3 className="font-bold text-gray-900 line-clamp-1">{chapter.name}</h3>
                        </div>
                        <button
                          onClick={() => handleChapterClick(chapter)}
                          className="w-full mt-2 py-2 text-sm border border-indigo-200 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                          View Topics →
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
        {/* --- LEVEL 5: TOPICS (Only show if Chapter is selected, but no Topic is selected) --- */}
              {activeChapter && !activeTopic && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4 mt-6">Topics in {activeChapter.name}</h2>
                  {topics.length === 0 ? (
                    <p className="text-gray-500 bg-white p-4 rounded-lg border border-dashed">No topics added yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {topics.map((topic) => (
                        <div
                          key={topic.id}
                          onClick={() => handleTopicClick(topic)}
                          className="bg-white p-4 rounded-lg border border-gray-200 hover:border-indigo-500 cursor-pointer hover:shadow-sm flex justify-between items-center group"
                        >
                          <span className="font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">{topic.name}</span>
                          <span className="text-sm text-gray-400 group-hover:text-indigo-500">View Content ➔</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
        {/* --- LEVEL 6: CONTENT VIEWER (Only show if Topic is selected) --- */}
              {activeTopic && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
                  <div className="bg-indigo-50 p-6 border-b border-indigo-100 flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-indigo-900">{activeTopic.name}</h2>
                      <p className="text-indigo-700 text-sm mt-1">Study Materials and Resources</p>
                    </div>
                  </div>

                  <div className="p-6">
                    {topicContent.length === 0 ? (
                      <p className="text-gray-500 italic">No content uploaded for this topic yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {topicContent.map((content) => (
                          <a
                            key={content.id}
                            href={content.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col p-4 rounded-lg border border-gray-100 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all cursor-pointer"
                          >
                            <div className="flex items-start">
                              {/* Dynamic Icon based on your enum type */}
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl mr-4 ${
                                content.type?.toLowerCase() === 'pdf' ? 'bg-red-100 text-red-600' :
                                content.type?.toLowerCase() === 'video' ? 'bg-blue-100 text-blue-600' :
                                'bg-green-100 text-green-600'
                              }`}>
                                {content.type?.toLowerCase() === 'pdf' ? '📄' : content.type?.toLowerCase() === 'video' ? '▶️' : '🔗'}
                              </div>

                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900">{content.title}</h4>
                                <div className="flex items-center space-x-2 mt-1">
                                   <span className="text-xs text-gray-500 uppercase tracking-wide bg-gray-100 px-2 py-0.5 rounded">
                                     {content.type}
                                   </span>
                                   <span className="text-xs text-gray-400">
                                     By {content.uploadedByName || 'Unknown'}
                                   </span>
                                </div>
                              </div>
                            </div>

                            {/* Displaying your Likes! */}
                            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                                                   <button
                                                     onClick={(e) => handleLike(e, content.id)}
                                                     className={`flex items-center text-sm font-semibold transition-colors p-2 -mr-2 rounded-lg
                                                       ${content.likedByCurrentUser
                                                           ? 'text-red-500 bg-red-50'
                                                           : 'text-gray-500 hover:text-red-500 hover:bg-gray-50'
                                                       }`}
                                                   >
                                                     <span className="mr-1">
                                                       {content.likedByCurrentUser ? '❤️' : '🤍'}
                                                     </span>
                                                     {content.likes || 0} Likes
                                                   </button>
                                                </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}


    </div>
  );
};

export default Dashboard;