import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import ResponsiveAppBar from './components/common/ResponsiveAppBar';

import PrivateRoute from './components/PrivateRoute';
import Home from './components/Home';
import Auth from './components/Auth';
import TaskList from './components/TaskList';
import Report from './components/Report';
import Note from './components/Note';
import NotificationDemo from './components/Notification';
import Settings from './components/Settings';
import NotFound from './components/NotFound';

import PomodoroTimer from './components/modals/PomodoroTimer';

import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

root.render(
  <React.StrictMode>
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth isLogin={true}/>} />
          <Route path="/signup" element={<Auth isLogin={false} />} />
          <Route path="/timer" element={<PrivateRoute><ResponsiveAppBar><PomodoroTimer /></ResponsiveAppBar></PrivateRoute>} />
          <Route path="/tasks" element={<PrivateRoute><ResponsiveAppBar><TaskList /></ResponsiveAppBar></PrivateRoute>} />
          <Route path="/note" element={<PrivateRoute><ResponsiveAppBar><Note /></ResponsiveAppBar></PrivateRoute>} />
          <Route path="/report" element={<PrivateRoute><ResponsiveAppBar><Report /></ResponsiveAppBar></PrivateRoute>} />
          <Route path="/notification" element={<PrivateRoute><ResponsiveAppBar><NotificationDemo /></ResponsiveAppBar></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><ResponsiveAppBar><Settings /></ResponsiveAppBar></PrivateRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
