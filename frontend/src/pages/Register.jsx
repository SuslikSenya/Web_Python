import React, { useState } from 'react';
import api from '../axios';

const Register = () => {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const res = await api.post('/register/', form);
            setMessage(res.data.message || 'Registration successful');
        } catch (err) {
            if (err.response?.data) {
                const errors = Object.values(err.response.data).flat().join(', ');
                setMessage(errors);
            } else {
                setMessage('Registration failed');
            }
        }
    };

    return (
        <div className="bg-gray-900 p-6 rounded-2xl shadow-md w-full max-w-md mx-auto mt-6">
            <h3 className="text-xl font-semibold mb-4 text-center text-white">Register</h3>
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
                    <label className="block text-sm font-medium text-gray-300">Email</label>
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
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
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
                >
                    Register
                </button>
            </form>
            {message && (
                <p className="mt-4 text-center text-sm text-red-500">{message}</p>
            )}
        </div>
    );
};

export default Register;
