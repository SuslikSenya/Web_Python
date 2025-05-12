import React, { useEffect, useState } from 'react';
import api from '../axios';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '' });
    const [editUser, setEditUser] = useState(null);
    const [message, setMessage] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await api.get('users/');
            setUsers(res.data);
        } catch (err) {
            setMessage('Failed to load users');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('users/create/', newUser);
            setMessage('User created');
            setNewUser({ username: '', email: '', password: '' });
            fetchUsers();
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Ошибка при создании пользователя';
            setMessage({ text: errorMessage, type: 'error' });

            if (errorMessage.includes('имя пользователя')) {
                // Подсветить поле username
            }
            else if (errorMessage.includes('email')) {
                // Подсветить поле email
            }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`users/${editUser.id}/update/`, editUser);
            setMessage('User updated');
            setEditUser(null);
            fetchUsers();
        } catch (err) {
            setMessage('Failed to update user');
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`users/${userId}/delete/`);
            setMessage('User deleted');
            fetchUsers();
        } catch (err) {
            setMessage('Failed to delete user');
        }
    };

    return (
        <div>
            <h2>Admin Panel</h2>

            <h4>Create User</h4>
            <form onSubmit={handleCreate}>
                <input
                    name="username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    placeholder="Username"
                    required
                />
                <input
                    name="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Email"
                    type="email"
                />
                <input
                    name="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Password"
                    required
                />
                <button type="submit">Create</button>
            </form>

            <h4>All Users</h4>
            <ul>
                {users.map((u) => (
                    <li key={u.id}>
                        {editUser?.id === u.id ? (
                            <form onSubmit={handleUpdate}>
                                <input
                                    value={editUser.username}
                                    onChange={(e) =>
                                        setEditUser({ ...editUser, username: e.target.value })
                                    }
                                />
                                <input
                                    value={editUser.email}
                                    onChange={(e) =>
                                        setEditUser({ ...editUser, email: e.target.value })
                                    }
                                />
                                <button type="submit">Save</button>
                                <button onClick={() => setEditUser(null)}>Cancel</button>
                            </form>
                        ) : (
                            <>
                                {u.username} ({u.email || 'no email'})
                                {u.is_superuser && ' [admin]'}
                                <button onClick={() => setEditUser(u)}>Edit</button>
                                <button onClick={() => handleDelete(u.id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>

            <p>{message}</p>
        </div>
    );
};

export default AdminDashboard;