import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import LoginForm from './Login'
import Register from "./Register";

function App() {
  return (
      <div>
        <h1>Login</h1>
        <LoginForm />

        <h1>Register</h1>
        <Register />
      </div>
  )
}

export default App;
