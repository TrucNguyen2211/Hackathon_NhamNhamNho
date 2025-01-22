import { StrictMode } from 'react'
import ReactDom from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Navbar } from "./component/Navbar";

import './index.css'
import routeConfig from './router/routerConfig.jsx'
import ScrollToHash from './util/ScrollToHash.jsx';
import Home from './Home.jsx'

ReactDom.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <ScrollToHash />
      <Navbar />
      <Routes>
        {routeConfig.map((route,index) => (
          <Route key={index} path={route.path} element={route.element} /> 
        ))}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
