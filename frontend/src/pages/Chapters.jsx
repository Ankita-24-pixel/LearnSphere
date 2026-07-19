import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, PlayCircle, FileText, CheckCircle, UploadCloud } from 'lucide-react';
import { getChaptersBySubjectId, getContentByChapterId } from '../api/hierarchyService';

export default function Chapters() {
  const { subjectId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [contentCache, setContentCache] = useState({});

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const data = await getChaptersBySubjectId(subjectId);
        setChapters(data);
      } catch (err) {
        console.error("Failed to load chapters", err);
      }
    };
    fetchChapters();
  }, [subjectId]);

  const toggleChapter = async (chapterId) => {
    if (expandedChapter === chapterId) {
      setExpandedChapter(null);
      return;
    }

    setExpandedChapter(chapterId);

    if (!contentCache[chapterId]) {
      try {
        const contentData = await getContentByChapterId(chapterId);
        setContentCache(prev => ({ ...prev, [chapterId]: contentData }));
      } catch (err) {
        console.error("Failed to load content", err);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <nav className="flex items-center text-sm font-medium text-gray-500 mb-6">
        <Link to="/dashboard/courses" className="hover:text-blue-600 transition-colors">Courses</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Chapters & Modules</span>
      </nav>

      <Link
          to={`/dashboard/subjects/${subjectId}/chapters/new`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm shrink-0 inline-block"
        >
          + Add Chapter
      </Link>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Course Syllabus</h2>
        <p className="text-gray-600 mt-2">Expand a chapter to view its study materials.</p>
      </div>

      <div className="space-y-4">
        {chapters.map((chapter, index) => (
          <div key={chapter.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">

            <button
              onClick={() => toggleChapter(chapter.id)}
              className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{chapter.name}</h3>
              </div>
              {expandedChapter === chapter.id ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
            </button>

            {expandedChapter === chapter.id && (
              // ERROR 2 FIXED: Everything is now inside this single parent div
              <div className="px-6 pb-6 pt-2 bg-gray-50 border-t border-gray-100">
                {!contentCache[chapter.id] ? (
                  <p className="text-sm text-gray-500 py-2">Loading content...</p>
                ) : contentCache[chapter.id].length === 0 ? (
                  <p className="text-sm text-gray-500 py-2">No content available for this chapter yet.</p>
                ) : (
                  <ul className="space-y-3 mt-4">
                    {contentCache[chapter.id].map(item => (
                      <li key={item.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer group">
                        <div className="flex items-center space-x-3">
                          {item.type === 'VIDEO' ? <PlayCircle className="text-red-500" size={20} /> : <FileText className="text-blue-500" size={20} />}
                          <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{item.title}</span>
                        </div>
                        <CheckCircle className="text-gray-300 group-hover:text-green-500" size={20} />
                      </li>
                    ))}
                  </ul>
                )}

                {/* Upload Button now safely inside the parent wrapper */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link
                    to={`/dashboard/topics/${chapter.id}/upload`}
                    className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors"
                  >
                    <UploadCloud size={16} className="mr-2" />
                    + Add New Material
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}