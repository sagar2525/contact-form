import React, { useState } from 'react';
import FormField from './FormField';

// Component for Admin Login
// Props: onLogin - function to call when login is successful
const Login = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
        // Clear error when user types again
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { email, password } = credentials;

        // Simple Validation
        // Note: In a real app, this should be done on the backend!
        // For this assignment, hardcoded credentials are fine.
        if (email === 'admin123@gmail.com' && password === 'adminsagar123') {
            onLogin(); // Call parent function to update state
        } else {
            setError('Invalid email or password.');
        }
    };

    return (
        <div className="contact-form-container">
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
                <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={credentials.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter admin email"
                />
                <FormField
                    label="Password"
                    name="password"
                    type="password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter admin password"
                />

                {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}

                <button type="submit" className="btn-submit">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
