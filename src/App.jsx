import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import Terms from './components/Terms.jsx';
import Privacy from './components/Privacy.jsx';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import GriphillDashboard from './components/GriphillDashboard.jsx'; // <-- IMPORT TARGET HERE

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/griphill" element={<GriphillDashboard />} /> {/* <-- MAP SUB-ROUTING LINK */}
        
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}