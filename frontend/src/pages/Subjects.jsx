import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, ChevronRight, ArrowLeft, Layers, AlertCircle, Loader2 } from 'lucide-react';
import { getSubjectsByCourseId } from '../api/subjectService';
import { getCourseById } from '../api/courseService';

export default function Subjects() {
  // Extracts the :courseId from the URL
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourseAndSubjects = async () => {
      try {
        // Fetch both the course details (for the title) and its subjects concurrently
        const [courseData, subjectsData] = await Promise.all([
          getCourseById(courseId),
          getSubjectsByCourseId(courseId)
        ]);

        setCourse(courseData);
        setSubjects(subjectsData);
      } catch (err) {
        console.error(err);
        setError('Failed to load subjects. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndSubjects();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Loader2 className="animate-spin mb-4 text-blue-600" size={32} />
        <p>Loading subjects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center space-x-2">
        <AlertCircle size={20} className="shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center text-sm font-medium text-gray-500 mb-6">
        <Link to="/dashboard/courses" className="hover:text-blue-600 flex items-center transition-colors">
          <ArrowLeft size={16} className="mr-1" />
          All Courses
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-gray-900">{course?.name || 'Course Subjects'}</span>
      </nav>

      {/* Header */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{course?.name}</h2>
        <p className="text-gray-600 max-w-3xl">Select a subject below to view its chapters and study materials.</p>
      </div>
      <Link
          to={`/dashboard/courses/${courseId}/subjects/new`}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm shrink-0"
        >
          + Add Subject
        </Link>

      {/* Subject Grid */}
      {subjects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <Layers className="mx-auto text-gray-400 mb-3" size={48} />
          <h3 className="text-lg font-medium text-gray-900">No subjects found</h3>
          <p className="text-gray-500 mt-1">This course doesn't have any subjects added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              to={`/dashboard/subjects/${subject.id}`} // The next drill-down level
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col hover:shadow-md hover:border-blue-300 transition-all group"
            >
              <div className="flex items-center space-x-3 mb-4 text-indigo-600 bg-indigo-50 w-fit p-3 rounded-lg group-hover:bg-indigo-100 transition-colors">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{subject.name}</h3>
              <p className="text-gray-600 mb-6 flex-1 line-clamp-2">
                {subject.description || 'Explore topics, chapters, and materials for this subject.'}
              </p>

              <div className="mt-auto flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                <span>Browse Chapters</span>
                <ChevronRight size={16} className="ml-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}