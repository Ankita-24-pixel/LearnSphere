import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { getAllCourses } from '../api/courseService';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load courses. Please ensure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Loader2 className="animate-spin mb-4 text-blue-600" size={32} />
        <p>Loading your courses...</p>
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Available Courses</h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {courses.length} Courses
        </span>
      </div>
      <Link
          to="/dashboard/courses/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          + Create Course
        </Link>

      {courses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <Book className="mx-auto text-gray-400 mb-3" size={48} />
          <h3 className="text-lg font-medium text-gray-900">No courses found</h3>
          <p className="text-gray-500 mt-1">There are currently no courses available on the platform.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4 text-blue-600 bg-blue-50 w-fit p-3 rounded-lg">
                <Book size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{course.name}</h3>
              {/* Assuming your backend sends a description field */}
              <p className="text-gray-600 mb-6 flex-1 line-clamp-3">
                {course.description || 'No description provided for this course.'}
              </p>

              <Link
                to={`/dashboard/courses/${course.id}`}
                className="mt-auto flex items-center justify-center w-full px-4 py-2.5 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-colors border border-gray-200 hover:border-blue-200"
              >
                <span>View Subjects</span>
                <ChevronRight size={18} className="ml-1" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}