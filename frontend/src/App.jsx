import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Subjects from './pages/Subjects';
import Chapters from './pages/Chapters';
import CreateCourse from './pages/CreateCourse';
import UploadContent from './pages/UploadContent';
import CreateSubject from './pages/CreateSubject';
import CreateChapter from './pages/CreateChapter';
import GlobalAddContent from './pages/GlobalAddContent';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/new" element={<CreateCourse />} />
          <Route path="add-content" element={<GlobalAddContent />} />
          <Route path="courses/:courseId" element={<Subjects />} />
          <Route path="subjects/:subjectsId" element={<Chapters />} />
          <Route path="topics/:topicId/upload" element={<UploadContent />} />
          <Route path="courses/:courseId/subjects/new" element={<CreateSubject />} />
          <Route path="subjects/:subjectId/chapters/new" element={<CreateChapter />} />

        </Route>


        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}