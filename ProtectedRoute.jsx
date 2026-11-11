import React, { useState } from 'react';

export const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('isAdminLoggedIn') === 'true'
  );
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Apni pasand ka password yahan set karein
  const ADMIN_PASSWORD = "ApnaSecretPassword123";

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('isAdminLoggedIn', 'true');
      setIsAuthenticated(true);
    } else {
      setError('Ghalat password! Dubara koshish karein.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 max-w-sm w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Admin Access</h2>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 mb-4 focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold transition">
            Login
          </button>
          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        </form>
      </div>
    );
  }

  return children;
};
