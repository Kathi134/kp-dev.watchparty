import React, { createContext, useContext, useState } from 'react';

const SettingsContext = createContext();

class Settings {
   constructor(showOptionsMenu) {
    this.showOptionsMenu = showOptionsMenu;
   }
}

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(new Settings(true));

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);