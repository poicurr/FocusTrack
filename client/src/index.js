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
import { SettingsProvider } from './components/SettingsContext';

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
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth isLogin={true}/>} />
          <Route path="/signup" element={<Auth isLogin={false} />} />
          <Route path="*" element={
            <SettingsProvider>
              <ThemeProvider theme={lightTheme}>
                <PrivateRoute><ResponsiveAppBar>
                  <Routes>
                    <Route path="/tasks" element={<TaskList />} />
                    <Route path="/note" element={<Note />} />
                    <Route path="/report" element={<Report />} />
                    <Route path="/notification" element={<NotificationDemo />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ResponsiveAppBar></PrivateRoute>
             </ThemeProvider>
            </SettingsProvider>
          } />
        </Routes>
      </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
