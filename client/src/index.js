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
import Note from './components/Note';
import CoachingTips from './components/CoachingTips';
import Settings from './components/Settings';
import NotFound from './components/NotFound';

import reportWebVitals from './reportWebVitals';

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
                  <Route path="/note" element={<Note />} />
                  <Route path="/report" element={<Report />} />
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
