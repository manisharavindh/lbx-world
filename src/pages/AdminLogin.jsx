import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarContext } from '../context/CarContext';
// import { Lock, User } from 'lucide-react';
import './Admin.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useCarContext();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (login(username, password)) {
            navigate('/admin-dashboard');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <section className="admin-login-container">
            <div
                className="glass login-card"
            >
                <h2 className="login-title">Admin Access</h2>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Username</label>
                        <div className="input-wrapper">
                            {/* <User className="input-icon" size={18} /> */}
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="form-input"
                                placeholder="Enter username"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <div className="input-wrapper">
                            {/* <Lock className="input-icon" size={18} /> */}
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                placeholder="Enter password"
                            />
                        </div>
                    </div>

                    {error && <p className="error-msg">{error}</p>}

                    <button
                        type="submit"
                        className="btn-primary login-btn"
                    >
                        Login
                    </button>
                </form>
            </div>
        </section>
    );
};

export default AdminLogin;
