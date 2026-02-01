import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import ResetPassword from './pages/ResetPassword';
import TutorOnboarding from './pages/TutorOnboarding';
import TuitionRequest from './pages/TuitionRequest';
import TuitionRequestSuccess from './pages/TuitionRequestSuccess';
import EmailVerification from './pages/EmailVerification';
import AboutUs from './pages/AboutUs';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AllTuitions from './pages/AllTuitions';
import MyTuitions from './pages/MyTuitions';
import TuitionDetails from './pages/TuitionDetails';
import TutorApplicationDetail from './pages/TutorApplicationDetail';
import TuitionRequestDetail from './pages/TuitionRequestDetail';
import TuitionApplications from './pages/TuitionApplications';
import Profile from './pages/Profile';
import { Toaster } from './components/ui/toaster';

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page - No sidebar/navbar */}
        <Route path="/" element={<Landing />} />
        
        {/* Auth Page - No sidebar/navbar */}
        <Route path="/auth" element={<Auth />} />
        
        {/* Reset Password Page - No sidebar/navbar */}
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Email Verification Page - No sidebar/navbar */}
        <Route path="/verify-email" element={<EmailVerification />} />
        
        {/* Tutor Onboarding Page - No sidebar/navbar */}
        <Route path="/tutor-onboarding" element={<TutorOnboarding />} />
        
        {/* Tuition Request Page - No sidebar/navbar */}
        <Route path="/tuition-request" element={<TuitionRequest />} />
        
        {/* Tuition Request Success Page - No sidebar/navbar */}
        <Route path="/tuition-request-success" element={<TuitionRequestSuccess />} />
        
        {/* Public Pages - No sidebar/navbar */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        
        {/* Admin Dashboard - No sidebar */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/tutor-application/:id" element={<TutorApplicationDetail />} />
        <Route path="/admin/tuition-request/:id" element={<TuitionRequestDetail />} />
        <Route path="/admin/tuition-applications/:tuitionId" element={<TuitionApplications />} />
        
        {/* Dashboard routes with sidebar and navbar */}
        <Route path="/*" element={
          <div className="min-h-screen bg-gray-50">
            <Navbar onMenuClick={() => setIsMobileSidebarOpen(true)} />
            <div className="flex pt-14 sm:pt-16">
              <Sidebar 
                isExpanded={isSidebarExpanded} 
                setIsExpanded={setIsSidebarExpanded}
                isMobileOpen={isMobileSidebarOpen}
                setIsMobileOpen={setIsMobileSidebarOpen}
              />
              <div className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'lg:ml-64' : 'lg:ml-20'}`}>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/tuitions" element={<AllTuitions />} />
                  <Route path="/my-tuitions" element={<MyTuitions />} />
                  <Route path="/tuition/:id" element={<TuitionDetails />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </div>
            </div>
          </div>
        } />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
