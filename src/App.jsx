import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import RequestDemo from './pages/RequestDemo';
import Login from './pages/Login';
import ObservationAnalysis from './pages/ObservationAnalysis';
import './App.css';

function AppContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/request-demo" element={<RequestDemo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/observation-analysis" element={<ObservationAnalysis />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;


