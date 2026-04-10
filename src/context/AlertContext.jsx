// context/AlertContext.jsx
import React, { createContext, useContext, useState } from 'react';
import GlobalAlert from '../components/GlobalAlert';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({ isOpen: false, message: '', type: 'error' });

  const showAlert = (message, type = 'error') => {
    setAlert({ isOpen: true, message, type });
  };

  const hideAlert = () => setAlert({ ...alert, isOpen: false });

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <GlobalAlert 
        isOpen={alert.isOpen} 
        message={alert.message} 
        type={alert.type} 
        onClose={hideAlert} 
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);