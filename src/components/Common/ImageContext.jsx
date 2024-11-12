import React, { createContext, useContext, useState } from "react";

// Creating a context
const PicContext = createContext();

// A component that provides the theme
export const PicProvider = ({ children }) => {
  const [theme, setTheme] = useState([]);

  return (
    <PicContext.Provider value={{ theme, setTheme }}>
      {children}
    </PicContext.Provider>
  );
};

// A custom hook to consume the theme context
export const usePic = () => useContext(PicContext);
