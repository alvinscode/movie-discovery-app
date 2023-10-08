import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import NavBar from './NavBar';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import UserSettings from './UserSettings';


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <div>
            <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <Switch>
                <Route path="/login">
                    <Login onLogin={handleLogin} />
                </Route>
                <Route path="/register">
                    <Register />
                </Route>
                <Route path="/user-settings">
                    <UserSettings />
                </Route>
                <Route exact path="/">
                    <Home isLoggedIn={isLoggedIn} onLogout={handleLogout} />
                </Route>
            </Switch>
        </div>
    );
}

export default App;
