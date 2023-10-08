import React, { useState } from 'react';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [registrationMessage, setRegistrationMessage] = useState('');

    const handleRegister = () => {
        if (password !== confirmPassword) {
            setRegistrationMessage('Passwords do not match');
            return;
        }

        const data = {
            username: username,
            email: email,
            password: password,
        };

        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.ok) {
                    setRegistrationMessage('Registration successful');
                    setUsername('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                } else {
                    setRegistrationMessage('Registration failed');
                    console.error('Registration failed');
                }
            })
            .catch((error) => {
                setRegistrationMessage('Registration error');
                console.error('Registration error:', error);
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
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={handleRegister}>Register</button>
            <p>{registrationMessage}</p>
        </div>
    );
}

export default Register;