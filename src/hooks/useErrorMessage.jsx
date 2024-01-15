import { useState, useContext, createContext } from "react";

const ErrorMessageContext = createContext({});

export function ErrorMessageProvider({ children }) {
  const [errorMessage, setErrorMessage] = useState(null);

  return (
    <ErrorMessageContext.Provider value={{ errorMessage, setErrorMessage }}>
      {children}
    </ErrorMessageContext.Provider>
  );
}

export function useErrorMessage() {
  const context = useContext(ErrorMessageContext);

  return context;
}
