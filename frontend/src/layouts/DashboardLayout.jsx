import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LayoutDashboard, LogOut, Settings, GraduationCap, User, PlusCircle, Search } from 'lucide-react';
import { getUserProfile } from '../api/userService';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('Loading...');
  const [searchQuery, setSearchQuery] = useState(''); // Search state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserProfile();
        setUsername(user.userName);
      } catch (err) {
        setUsername('Guest');
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if(searchQuery.trim()) {
      // Navigate to a search results page (you can build this later!)
      navigate(`/dashboard/search?q=${searchQuery}`);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <BookOpen className="text-blue-600 mr-3" size={24} />
          <span className="text-xl font-bold text-gray-900 tracking-tight">LearnSphere</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link to="/dashboard" className={`flex items-center px-4 py-3 rounded-xl transition-colors ${isActive('/dashboard') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
            <LayoutDashboard size={20} className="mr-3" /> Overview
          </Link>
          <Link to="/dashboard/courses" className={`flex items-center px-4 py-3 rounded-xl transition-colors ${isActive('/dashboard/courses') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
            <GraduationCap size={20} className="mr-3" /> My Courses
          </Link>

          {/* NEW: Global Add Content Link */}
          <Link to="/dashboard/add-content" className={`flex items-center px-4 py-3 rounded-xl transition-colors ${isActive('/dashboard/add-content') ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
            <PlusCircle size={20} className="mr-3" /> Add Content
          </Link>

          <Link to="/dashboard/settings" className={`flex items-center px-4 py-3 rounded-xl transition-colors ${isActive('/dashboard/settings') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
            <Settings size={20} className="mr-3" /> Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
            <LogOut size={20} className="mr-3" /> <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header with Search */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10">

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for subjects, topics, or content..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm"
              />
            </div>
          </form>

          <div className="flex items-center space-x-4 ml-4">
            <div className="flex items-center space-x-3 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <User size={18} />
              </div>
              <span className="text-sm font-medium text-gray-700">{username}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}