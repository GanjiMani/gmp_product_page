import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import RequestDemo from './pages/RequestDemo';
import Login from './pages/Login';
import ObservationAnalysis from './pages/ObservationAnalysis';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/request-demo" element={<RequestDemo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/observation-analysis" element={<ObservationAnalysis />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


