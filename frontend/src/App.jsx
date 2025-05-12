import React, { useState, useEffect } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import api from './axios';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/csrf/').catch(err => console.error('CSRF error:', err));
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/users/me/');
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/logout/');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) return <p className="text-center text-gray-400 mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-gray-800 shadow-lg rounded-2xl p-8 space-y-6">
        <header className="border-b pb-4">
          {user ? (
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xl font-semibold text-white">
                  Welcome, {user.username}
                </p>
                <p className="text-sm text-gray-400">
                  Role: {user.is_superuser ? 'Admin' : 'User'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-400 text-lg">Not logged in</p>
          )}
        </header>

        <main>
          {!user ? (
            <div className="space-y-6">
              <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
                <h2 className="text-lg font-semibold mb-2 text-white">Login</h2>
                <Login setUser={setUser} />
              </div>

              <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
                <h2 className="text-lg font-semibold mb-2 text-white">Register</h2>
                <Register />
              </div>
            </div>
          ) : user.is_superuser ? (
            <AdminDashboard />
          ) : (
            <p className="text-center text-gray-400 text-lg">
              You are logged in as a regular user.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
