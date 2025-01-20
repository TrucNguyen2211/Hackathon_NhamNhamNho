import React from 'react';
import { Navigate } from 'react-router-dom';

const routesConfig = [
    { path: "/", element: <Navigate to="/home" /> },
    { path: "*", element: <Navigate to="/home" /> }
  ];
  
  export default routesConfig;
  