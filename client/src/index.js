import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { CssBaseline } from '@mui/material';
import { SettingsProvider } from './components/SettingsContext';
import ResponsiveAppBar from './components/ResponsiveAppBar';

import PrivateRoute from './components/PrivateRoute';
import Home from './components/Home';
import Auth from './components/Auth';
import TaskList from './components/TaskList';
import Report from './components/Report';
import Archive from './components/Archive';
import NotificationManager from './components/NotificationManager';
import CoachingTips from './components/CoachingTips';
import Settings from './components/Settings';
import NotFound from './components/NotFound';

import reportWebVitals from './reportWebVitals';

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register(`${process.env.PUBLIC_URL}/service-worker.js`)
        .then(reg => {
          console.log('Service Worker registered', reg);
        })
        .catch(err => console.error('Service Worker registration failed:', err));
    });
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth isLogin={true}/>} />
        <Route path="/signup" element={<Auth isLogin={false} />} />
        <Route path="*" element={
          <PrivateRoute>
            <SettingsProvider>
              <ResponsiveAppBar>
                <CssBaseline /> 
                <Routes>
                  <Route path="/tasks" element={<TaskList />} />
                  <Route path="/archive" element={<Archive />} />
                  <Route path="/report" element={<Report />} />
                  <Route path="/notification" element={<NotificationManager />} />
                  <Route path="/coaching" element={<CoachingTips />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ResponsiveAppBar>
            </SettingsProvider>
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  </React.StrictMode>
);

registerServiceWorker();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
