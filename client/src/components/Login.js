import React, { useState } from 'react';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState('');

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
                    setUsername('');
                    setPassword('');
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

    return (
        <div>
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
            <p>{loginMessage}</p>
        </div>
    );
}

export default Login;