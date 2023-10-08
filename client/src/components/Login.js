import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Login.css'

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState('');
    const [showLoginForm, setShowLoginForm] = useState(true);
    const history = useHistory();

    const handleLogin = () => {
        const data = {
            username: username,
            password: password,
        };

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.ok) {
                    setLoginMessage('Login successful');
                    onLogin();
                    history.push('/home');
                } else {
                    setLoginMessage('Login failed');
                    console.error('Login failed');
                }
            })
            .catch((error) => {
                setLoginMessage('Login error');
                console.error('Login error:', error);
            });
    };

    const toggleLoginForm = () => {
        setShowLoginForm(!showLoginForm);
    };

    return (
        <div className="login-container">
          {showLoginForm && (
            <>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handleLogin}>Login</button>
              <p className="text-danger">{loginMessage}</p>
            </>
          )}
          <p className="link-text">
            Don't have an account?{' '}
            <Link to="/register" onClick={toggleLoginForm}>
              Register here
            </Link>
          </p>
        </div>
      );
    }

export default Login;