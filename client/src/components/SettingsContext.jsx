import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Contextの作成
export const SettingsContext = createContext();

// Providerコンポーネント
export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    primaryColor: "#2E0B17",
    secondaryColor: "#FF8E53",
    theme: "light",
  });
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();  
  useEffect(() => {
    axios.get(`http://localhost:5000/api/settings/fetch`, {
      withCredentials: true, // クッキーを含めるために必要
    }).then(res => {
      setSettings(res.data);
    }).catch(error => {
      if (error.status === 401 || error.status === 403) {
        navigate("/login");
      }
    });
  }, []);

  const updateSettings = async (newSettings) => {
    const res = await axios.post(`http://localhost:5000/api/settings/update`, newSettings, {
      withCredentials: true, // クッキーを含めるために必要
    }).then(res => {
      setSettings(res.data);
    }).catch(error => {
      if (error.status === 401 || error.status === 403) {
        navigate("/login");
      }
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
