import React, { useEffect, useState } from 'react';
import api from '../axios';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '' });
    const [editUser, setEditUser] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });

    const fetchUsers = async () => {
        try {
            const res = await api.get('users/');
            setUsers(res.data);
        } catch (err) {
            setMessage({ text: 'Failed to load users', type: 'error' });
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('users/create/', newUser);
            setMessage({ text: response.data.message || 'User created successfully', type: 'success' });
            setNewUser({ username: '', email: '', password: '' });
            fetchUsers();
        } catch (err) {
            const errorMessage = err.response?.data?.detail ||
                err.response?.data?.username?.[0] ||
                err.response?.data?.email?.[0] ||
                'Failed to create user';
            setMessage({ text: errorMessage, type: 'error' });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`users/${editUser.id}/update/`, {
                username: editUser.username,
                email: editUser.email
            });
            setMessage({ text: 'User updated successfully', type: 'success' });
            setEditUser(null);
            fetchUsers();
        } catch (err) {
            setMessage({ text: 'Failed to update user', type: 'error' });
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`users/${userId}/delete/`);
            setMessage({ text: 'User deleted successfully', type: 'success' });
            fetchUsers();
        } catch (err) {
            setMessage({ text: 'Failed to delete user', type: 'error' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-400">Admin Panel</h1>
                    <button className="text-red-400 hover:text-red-300">Logout</button>
                </div>

                {/* Message display */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-md ${message.type === 'success'
                        ? 'bg-green-900 text-green-200'
                        : 'bg-red-900 text-red-200'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Create User Form */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
                    <h2 className="text-xl font-semibold text-blue-300 mb-4">Create New User</h2>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                type="text"
                                placeholder="Username"
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={newUser.username}
                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Create User
                        </button>
                    </form>
                </div>

                {/* Users List */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                    <h2 className="text-xl font-semibold text-blue-300 mb-4">All Users</h2>
                    <ul className="space-y-3">
                        {users.map((u) => (
                            <li key={u.id} className="bg-gray-750 hover:bg-gray-700 rounded-lg p-4 transition-colors">
                                {editUser?.id === u.id ? (
                                    <form onSubmit={handleUpdate} className="space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md"
                                                value={editUser.username}
                                                onChange={(e) =>
                                                    setEditUser({ ...editUser, username: e.target.value })
                                                }
                                            />
                                            <input
                                                type="email"
                                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md"
                                                value={editUser.email}
                                                onChange={(e) =>
                                                    setEditUser({ ...editUser, email: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                type="submit"
                                                className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditUser(null)}
                                                className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-500"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                                        <div>
                                            <span className="font-medium">{u.username}</span>
                                            <span className="text-gray-400 ml-2">({u.email || 'no email'})</span>
                                            {u.is_superuser && (
                                                <span className="ml-2 px-2 py-1 bg-yellow-900 text-yellow-200 text-xs rounded-full">
                                                    admin
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-2 md:mt-0 space-x-2">
                                            <button
                                                onClick={() => setEditUser(u)}
                                                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(u.id)}
                                                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
