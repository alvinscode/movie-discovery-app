import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import NavBar from "./NavBar";

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
              <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
              <Switch>
                  <Route path="/login">
                      <Login onLogin={handleLogin} />
                  </Route>
                  <Route path="/register">
                      <Register />
                  </Route>
                  <Route path="/">
                      {isLoggedIn ? (
                          <div>
                              <p>Welcome, User!</p>
                          </div>
                      ) : (
                          <Home />
                      )}
                  </Route>
              </Switch>
          </div>
      </Router>
  );
}

export default App;