import React from 'react';
import { Navigate } from 'react-router-dom';

import Home from '../Home';
import About from '../About';
import Chat from '../Chat';
import Schedule from '../Schedule';
import Calendar from '../Calendar';
import Login from '../Login';
import SignUp from '../SignUp';


const routesConfig = [
    { path: "/", element: <Navigate to="/home" /> },
    { path: "*", element: <Navigate to="/home" /> },
    { path: "/home", element: <Home />, name: "Home" },
    { path: "/about", element: <About />, name: "About" },
    { path: "/chat", element: <Chat />, name: "Chat" },
    { path: "/schedule", element: <Schedule />, name: "Schedule" },
    { path: "/calendar", element: <Calendar />, name: "Calendar" }, 
    { path: "/login", element: <Login />, name: "Login" },  
    { path: "/signup", element: <SignUp />, name: "SignUp" },

  ];
  
  export default routesConfig;
  