import React, { createContext, useContext, useState, useEffect } from 'react';

const ToggleContext = createContext();

export const ToggleProvider = ({ children }) => {
  const [isAdvanced, setIsAdvanced] = useState(false);

  const toggleAdvancedSearch = () => {
    setIsAdvanced(!isAdvanced);
  };

  const setSimpleSearch = () => {
    setIsAdvanced(false);
  };

  const setAdvancedSearch = () => {
    setIsAdvanced(true);
  };

  useEffect(() => {
    window.toggleAdvancedSearch = toggleAdvancedSearch;
    window.setSimpleSearch = setSimpleSearch;
    window.setAdvancedSearch = setAdvancedSearch;
  }, []);

  return (
    <ToggleContext.Provider
      value={{
        isAdvanced,
        toggleAdvancedSearch,
        setSimpleSearch,
        setAdvancedSearch,
      }}
    >
      {children}
    </ToggleContext.Provider>
  );
};

export const useToggle = () => {
  return useContext(ToggleContext);
};
