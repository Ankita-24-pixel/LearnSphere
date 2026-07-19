import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BookOpen, Save, ArrowLeft } from 'lucide-react';
import { createChapter } from '../api/hierarchyService';

export default function CreateChapter() {
  const navigate = useNavigate();
  const { subjectId } = useParams(); // Get the current subject ID from URL
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Format the payload exactly as the Spring Boot entity expects
    const payload = {
      name: name,
      subject: { id: parseInt(subjectId) }
    };

    try {
      await createChapter(payload);
      navigate(-1); // Go back to the chapters list on success
    } catch (err) {
      console.error("Failed to create chapter", err);
      alert("Failed to create chapter. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft size={18} className="mr-2" /> Back to Subject
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 bg-blue-50 border-b border-gray-200 flex items-center space-x-3">
          <BookOpen className="text-blue-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-900">Add New Chapter</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Chapter Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="e.g., Chapter 1: Introduction to Kinetics"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              <Save size={18} className="mr-2" />
              {loading ? 'Saving...' : 'Save Chapter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}