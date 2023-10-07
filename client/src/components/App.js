import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from './Login'
import Register from "./Register";
import Home from "./Home";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
      setIsLoggedIn(true);
  };

  const handleLogout = () => {
      setIsLoggedIn(false);
  };

  return (
    <Router>
      <div>
        {isLoggedIn ? (
            <div>
                <p>Welcome, User!</p>
                <button onClick={handleLogout}>Logout</button>
            </div>
        ) : (
            <div>
                <p>Please log in.</p>
                <Login onLogin={handleLogin} />
            </div>
        )}
        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/home" component={Home} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;