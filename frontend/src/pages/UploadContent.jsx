import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { UploadCloud, Save, ArrowLeft, Video, FileText, FileQuestion } from 'lucide-react';
import { uploadContent } from '../api/contentService';

export default function UploadContent() {
  const navigate = useNavigate();
  const { topicId } = useParams(); // Gets the topic ID from the URL
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    type: 'VIDEO',
    topic: { id: parseInt(topicId) } // Maps to your backend's nested object requirement
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await uploadContent(formData);
      // Navigate back to the previous page on success
      navigate(-1);
    } catch (err) {
      console.error("Failed to upload content", err);
      alert("Failed to save content. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft size={18} className="mr-2" /> Back to Chapter
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 bg-indigo-50 border-b border-gray-200 flex items-center space-x-3">
          <UploadCloud className="text-indigo-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-900">Upload Study Material</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Material Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="e.g., Introduction to Calculus Part 1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Content Type</label>
            <div className="grid grid-cols-3 gap-4">
              {['VIDEO', 'PDF', 'PYQ'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({...formData, type})}
                  className={`flex items-center justify-center py-3 px-4 rounded-xl border font-medium transition-all ${
                    formData.type === type
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {type === 'VIDEO' && <Video size={18} className="mr-2" />}
                  {type === 'PDF' && <FileText size={18} className="mr-2" />}
                  {type === 'PYQ' && <FileQuestion size={18} className="mr-2" />}
                  {type === 'PYQ' ? 'Exam Qs' : type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Direct Resource URL</label>
            <input
              type="url"
              required
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="https://youtube.com/... or https://drive.google.com/..."
            />
            <p className="text-xs text-gray-500 mt-2">Provide a valid link to the hosted video or PDF document.</p>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              <Save size={18} className="mr-2" />
              {loading ? 'Uploading...' : 'Publish Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}