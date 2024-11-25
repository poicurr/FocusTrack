import React, { createContext, useState, useContext } from 'react';

// Contextの作成
export const SettingsContext = createContext();

// Providerコンポーネント
export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <SettingsContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </SettingsContext.Provider>
  );
};

// カスタムフック
export const useSettings = () => useContext(SettingsContext);
