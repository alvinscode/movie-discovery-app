import React from 'react';
import { Link } from 'react-router-dom';

function NavBar({ isLoggedIn, onLogout }) {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                {isLoggedIn ? (
                    <li><Link to="/" onClick={onLogout}>Logout</Link></li>
                ) : (
                    <li><Link to="/login">Login</Link></li>
                )}
            </ul>
        </nav>
    );
}

export default NavBar;