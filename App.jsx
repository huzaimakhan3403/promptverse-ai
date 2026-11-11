import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';

// Agar aapka koi home page ya admin page hai to unhein yahan import karein
// import HomePage from './pages/HomePage';
// import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<div className="text-center p-10 text-2xl font-bold">PromptVerse Home Page</div>} />

        {/* Protected Admin Route */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <div className="p-10 text-2xl font-bold">Welcome to Admin Panel</div>
              {/* Yahan aap apna <AdminPage /> component laga sakte hain */}
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
