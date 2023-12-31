import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function Navbar({ isLoggedIn, onLogout }) {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          Movie Database
        </Link>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link to="/add-movie" className="nav-link">
                    Add Movie
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/edit-movie" className="nav-link">
                    Delete Movies
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-logout" onClick={onLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;