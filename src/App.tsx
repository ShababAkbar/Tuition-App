import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import TutorOnboarding from './pages/TutorOnboarding';
import TuitionRequest from './pages/TuitionRequest';
import Dashboard from './pages/Dashboard';
import AllTuitions from './pages/AllTuitions';
import MyTuitions from './pages/MyTuitions';
import TuitionDetails from './pages/TuitionDetails';
import Profile from './pages/Profile';
import { Toaster } from './components/ui/toaster';

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page - No sidebar/navbar */}
        <Route path="/" element={<Landing />} />
        
        {/* Auth Page - No sidebar/navbar */}
        <Route path="/auth" element={<Auth />} />
        
        {/* Tutor Onboarding Page - No sidebar/navbar */}
        <Route path="/tutor-onboarding" element={<TutorOnboarding />} />
        
        {/* Tuition Request Page - No sidebar/navbar */}
        <Route path="/tuition-request" element={<TuitionRequest />} />
        
        {/* Dashboard routes with sidebar and navbar */}
        <Route path="/*" element={
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex pt-16">
              <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />
              <div className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-20'}`}>
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
