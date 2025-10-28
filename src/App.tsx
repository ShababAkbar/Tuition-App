import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import AllTuitions from './pages/AllTuitions';
import MyTuitions from './pages/MyTuitions';
import TuitionDetails from './pages/TuitionDetails';
import Profile from './pages/Profile';

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page - No sidebar/navbar */}
        <Route path="/" element={<Landing />} />
        
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
    </BrowserRouter>
  );
}

export default App;
