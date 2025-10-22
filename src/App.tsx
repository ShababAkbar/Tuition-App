import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AllTuitions from './pages/AllTuitions';
import MyTuitions from './pages/MyTuitions';
import TuitionDetails from './pages/TuitionDetails';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 transition-all duration-300">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tuitions" element={<AllTuitions />} />
            <Route path="/my-tuitions" element={<MyTuitions />} />
            <Route path="/tuition/:id" element={<TuitionDetails />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
