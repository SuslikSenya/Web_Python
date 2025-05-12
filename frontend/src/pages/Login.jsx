import React, { useState } from 'react';
import api from '../axios';

const Login = ({ setUser }) => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await api.post('/login/', form);
            const res = await api.get('/users/me/');
            setUser(res.data);
            setMessage('Login successful');
        } catch (err) {
            if (err.response?.data?.error) {
                setMessage(err.response.data.error);
            } else {
                setMessage('Login failed');
            }
        }
    };

    return (
        <div className="bg-gray-900 p-6 rounded-2xl shadow-md w-full max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-4 text-center text-white">Login</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Username</label>
                    <input
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="Username"
                        required
                        className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                        className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                >
                    Login
                </button>
            </form>
            {message && (
                <p className="mt-4 text-center text-sm text-red-500">{message}</p>
            )}
        </div>
    );
};

export default Login;
