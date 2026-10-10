import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import AdminOrders from './components/AdminOrders.jsx';
import Terms from './components/Terms.jsx';
import Privacy from './components/Privacy.jsx';
import TrackOrder from "./pages/TrackOrder";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
// import TestimonialsManager from './components/TestimonialsManager.jsx';

export default function App() {
  return <Router><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/track-order" element={<Home />} />
    <Route path="/admin" element={<AdminOrders />} />
    <Route path="/admin/orders" element={<AdminOrders />} />
    <Route path="/terms" element={<Terms />} />
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/track-order" element={<TrackOrder />} />
    {/* <Route path="/admin/testimonials" element={<TestimonialsManager />} /> */}
    <Route
  path="/admin/login"
  element={<AdminLogin />}
/>

<Route
  path="/admin"
  element={<AdminDashboard />}
/>
    <Route path="*" element={<Home />} />
  </Routes></Router>;
}
