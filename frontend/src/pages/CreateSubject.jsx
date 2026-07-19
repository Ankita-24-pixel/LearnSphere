import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layers, Save, ArrowLeft } from 'lucide-react';
import { createSubject } from '../api/subjectService';

export default function CreateSubject() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    semId: '1' // Defaulting to 1 to ensure it maps to a valid Year entity in the DB
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Format the payload to match the backend Subject entity expectations
    const payload = {
      name: formData.name,
      sem: { id: parseInt(formData.semId) }
    };

    try {
      await createSubject(payload);
      navigate(-1); // Go back to the subjects list
    } catch (err) {
      console.error("Failed to create subject", err);
      alert("Failed to create subject. Ensure the Semester ID actually exists in your database!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft size={18} className="mr-2" /> Back to Course
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 bg-indigo-50 border-b border-gray-200 flex items-center space-x-3">
          <Layers className="text-indigo-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-900">Add New Subject</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="e.g., Data Structures and Algorithms"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Semester ID (Year Mapping)</label>
            <input
              type="number"
              required
              min="1"
              value={formData.semId}
              onChange={(e) => setFormData({...formData, semId: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">Enter the ID of the semester this subject belongs to (Must exist in the database).</p>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              <Save size={18} className="mr-2" />
              {loading ? 'Saving...' : 'Save Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}