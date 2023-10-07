import React from 'react';
import { Link } from 'react-router-dom';

function Home({ isLoggedIn, onLogout }) {
    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <p>Welcome, User!</p>
                    <button onClick={onLogout}>Logout</button>
                </div>
            ) : (
                <div>
                    <p>Please log in.</p>
                </div>
            )}
        </div>
    );
}

export default Home;