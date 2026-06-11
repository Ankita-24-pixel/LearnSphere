import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Save, ArrowLeft, Video, FileText, FileQuestion } from 'lucide-react';
import { getAllCourses , createCourse} from '../api/courseService';
import { getYearsByCourseId, getSubjectsByYearId, getChaptersBySubjectId, getTopicsByChapterId } from '../api/hierarchyService';
import { uploadContent } from '../api/contentService';
import { createYear, createSubject, createChapter, createTopic } from '../api/hierarchyService';


export default function GlobalAddContent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Lists for datalists
  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);

  // Text inputs (what the user sees)
  const [courseInput, setCourseInput] = useState('');
  const [yearInput, setYearInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('');
  const [chapterInput, setChapterInput] = useState('');
  const [topicInput, setTopicInput] = useState('');

  // Selected IDs (what the backend needs)
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  // Content payload
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    type: 'VIDEO'
  });

  // 1. Initial Load: Fetch all courses
  useEffect(() => {
    getAllCourses().then(setCourses).catch(console.error);
  }, []);

  // 2. Fetch Years when Course ID changes
  useEffect(() => {
    // Always clear downstream values when parent changes
    setYearInput(''); setSelectedYear(''); setYears([]);
    setSubjectInput(''); setSelectedSubject(''); setSubjects([]);
    setChapterInput(''); setSelectedChapter(''); setChapters([]);
    setTopicInput(''); setSelectedTopic(''); setTopics([]);

    if (selectedCourse) {
      getYearsByCourseId(selectedCourse).then(setYears).catch(console.error);
    }
  }, [selectedCourse]);

  // 3. Fetch Subjects when Year ID changes
  useEffect(() => {
    setSubjectInput(''); setSelectedSubject(''); setSubjects([]);
    setChapterInput(''); setSelectedChapter(''); setChapters([]);
    setTopicInput(''); setSelectedTopic(''); setTopics([]);

    if (selectedYear) {
      getSubjectsByYearId(selectedYear).then(setSubjects).catch(console.error);
    }
  }, [selectedYear]);

  // 4. Fetch Chapters when Subject ID changes
  useEffect(() => {
    setChapterInput(''); setSelectedChapter(''); setChapters([]);
    setTopicInput(''); setSelectedTopic(''); setTopics([]);

    if (selectedSubject) {
      getChaptersBySubjectId(selectedSubject).then(setChapters).catch(console.error);
    }
  }, [selectedSubject]);

  // 5. Fetch Topics when Chapter ID changes
  useEffect(() => {
    setTopicInput(''); setSelectedTopic(''); setTopics([]);

    if (selectedChapter) {
      getTopicsByChapterId(selectedChapter).then(setTopics).catch(console.error);
    }
  }, [selectedChapter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTopic) return alert("Please select a valid final topic from the list!");

    setLoading(true);
    try {
      await uploadContent({
        ...formData,
        topic: { id: parseInt(selectedTopic) }
      });
      alert("Content uploaded successfully!");
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert("Failed to upload. Ensure all fields are valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 bg-indigo-50 border-b border-gray-200 flex items-center space-x-3">
          <UploadCloud className="text-indigo-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-900">Upload Global Content</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">

          {/* Cascading Hierarchy Selection */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
            <h3 className="font-semibold text-gray-800 border-b pb-2 mb-4">1. Where does this belong?</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* COURSE DATALIST */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <div className="flex space-x-2">
                  <input
                    list="courses-list"
                    value={courseInput}
                    placeholder="-- Type or Select Course --"
                    onChange={(e) => {
                      const val = e.target.value;
                      setCourseInput(val);
                      // FIXED: Case-insensitive matching
                      const match = courses.find(c => c.name.toLowerCase() === val.toLowerCase().trim());
                      setSelectedCourse(match ? match.id : '');
                    }}
                    required
                    className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <datalist id="courses-list">
                    {courses.map(c => <option key={c.id} value={c.name} />)}
                  </datalist>

                  {/* NEW: Show Add Button if it's a new course */}
                  {courseInput && !selectedCourse && (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const newCourse = await createCourse({ name: courseInput });
                          setCourses([...courses, newCourse]);
                          setSelectedCourse(newCourse.id);
                          alert("New course created! The next field is now unlocked.");
                        } catch (err) {
                          // NEW: We are extracting the exact error message from the backend!
                          const backendMessage = err.response?.data?.message
                                              || err.response?.data
                                              || err.message
                                              || "Unknown Error";

                          alert(`Backend rejected it! Reason: ${backendMessage}`);
                        }
                      }}
                      className="px-4 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-200 transition-colors whitespace-nowrap"
                    >
                      + Add
                    </button>
                  )}
                </div>
              </div>

              {/* YEAR DATALIST */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year / Semester</label>
                <div className="flex space-x-2">
                  <input
                    list="years-list"
                    value={yearInput}
                    placeholder="e.g., 1 or Semester 1"
                    onChange={(e) => {
                      const val = e.target.value;
                      setYearInput(val);
                      const match = years.find(y => `Semester ${y.sem}`.toLowerCase() === val.toLowerCase().trim());
                      setSelectedYear(match ? match.id : '');
                    }}
                    disabled={!selectedCourse}
                    required
                    className="flex-1 p-2.5 border border-gray-300 rounded-lg disabled:bg-gray-200 disabled:text-gray-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <datalist id="years-list">
                    {years.map(y => <option key={y.id} value={`Semester ${y.sem}`} />)}
                  </datalist>

                  {yearInput && !selectedYear && selectedCourse && (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          // Extract numbers if they typed "Semester 1", or use the raw input
                          const semNum = yearInput.replace(/[^0-9]/g, '') || yearInput;
                          const newYear = await createYear({
                            sem: semNum,
                            course: { id: selectedCourse } // Sending Parent ID!
                          });
                          setYears([...years, newYear]);
                          setSelectedYear(newYear.id);
                          alert("New Year/Semester added!");
                        } catch (err) {
                          console.error(err);
                          alert("Failed to add Year.");
                        }
                      }}
                      className="px-4 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-200 transition-colors whitespace-nowrap"
                    >
                      + Add
                    </button>
                  )}
                </div>
              </div>

              {/* SUBJECT DATALIST */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <div className="flex space-x-2">
                  <input
                    list="subjects-list"
                    value={subjectInput}
                    placeholder="-- Type or Select Subject --"
                    onChange={(e) => {
                      const val = e.target.value;
                      setSubjectInput(val);
                      const match = subjects.find(s => s.name.toLowerCase() === val.toLowerCase().trim());
                      setSelectedSubject(match ? match.id : '');
                    }}
                    disabled={!selectedYear}
                    required
                    className="flex-1 p-2.5 border border-gray-300 rounded-lg disabled:bg-gray-200 disabled:text-gray-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <datalist id="subjects-list">
                    {subjects.map(s => <option key={s.id} value={s.name} />)}
                  </datalist>

                  {subjectInput && !selectedSubject && selectedYear && (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const newSubject = await createSubject({
                            name: subjectInput,
                            sem: { id: selectedYear } // Sending Parent ID!
                          });
                          setSubjects([...subjects, newSubject]);
                          setSelectedSubject(newSubject.id);
                          alert("New Subject added!");
                        } catch (err) {
                          console.error(err);
                          alert("Failed to add Subject.");
                        }
                      }}
                      className="px-4 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-200 transition-colors whitespace-nowrap"
                    >
                      + Add
                    </button>
                  )}
                </div>
              </div>

              {/* CHAPTER DATALIST */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chapter</label>
                <div className="flex space-x-2">
                  <input
                    list="chapters-list"
                    value={chapterInput}
                    placeholder="-- Type or Select Chapter --"
                    onChange={(e) => {
                      const val = e.target.value;
                      setChapterInput(val);
                      const match = chapters.find(c => c.name.toLowerCase() === val.toLowerCase().trim());
                      setSelectedChapter(match ? match.id : '');
                    }}
                    disabled={!selectedSubject}
                    required
                    className="flex-1 p-2.5 border border-gray-300 rounded-lg disabled:bg-gray-200 disabled:text-gray-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <datalist id="chapters-list">
                    {chapters.map(c => <option key={c.id} value={c.name} />)}
                  </datalist>

                  {chapterInput && !selectedChapter && selectedSubject && (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const newChapter = await createChapter({
                            name: chapterInput,
                            subject: { id: selectedSubject } // Sending Parent ID!
                          });
                          setChapters([...chapters, newChapter]);
                          setSelectedChapter(newChapter.id);
                          alert("New Chapter added!");
                        } catch (err) {
                          console.error(err);
                          alert("Failed to add Chapter.");
                        }
                      }}
                      className="px-4 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-200 transition-colors whitespace-nowrap"
                    >
                      + Add
                    </button>
                  )}
                </div>
              </div>

              {/* TOPIC DATALIST */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                <div className="flex space-x-2">
                  <input
                    list="topics-list"
                    value={topicInput}
                    placeholder="-- Type or Select Final Topic --"
                    onChange={(e) => {
                      const val = e.target.value;
                      setTopicInput(val);
                      const match = topics.find(t => t.name.toLowerCase() === val.toLowerCase().trim());
                      setSelectedTopic(match ? match.id : '');
                    }}
                    disabled={!selectedChapter}
                    required
                    className="flex-1 p-2.5 border border-gray-300 rounded-lg disabled:bg-gray-200 disabled:text-gray-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <datalist id="topics-list">
                    {topics.map(t => <option key={t.id} value={t.name} />)}
                  </datalist>

                  {topicInput && !selectedTopic && selectedChapter && (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const newTopic = await createTopic({
                            name: topicInput,
                            chapter: { id: selectedChapter } // Sending Parent ID!
                          });
                          setTopics([...topics, newTopic]);
                          setSelectedTopic(newTopic.id);
                          alert("New Topic added! You can now upload content.");
                        } catch (err) {
                          console.error(err);
                          alert("Failed to add Topic.");
                        }
                      }}
                      className="px-4 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-200 transition-colors whitespace-nowrap"
                    >
                      + Add
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Actual Content Fields */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 border-b pb-2 mb-4">2. Material Details</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="Enter title..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resource URL</label>
              <input type="url" required value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="https://..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
              <div className="flex space-x-4">
                {['VIDEO', 'PDF', 'PYQ'].map((type) => (
                  <button key={type} type="button" onClick={() => setFormData({...formData, type})} className={`flex-1 py-2 px-4 rounded-lg border font-medium transition-all flex justify-center items-center ${formData.type === type ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-gray-200 text-gray-600'}`}>
                    {type === 'VIDEO' && <Video size={16} className="mr-2" />}
                    {type === 'PDF' && <FileText size={16} className="mr-2" />}
                    {type === 'PYQ' && <FileQuestion size={16} className="mr-2" />}
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={loading || !selectedTopic} className="w-full flex justify-center items-center py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50">
              <Save size={18} className="mr-2" />
              {loading ? 'Uploading...' : 'Publish Content'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}