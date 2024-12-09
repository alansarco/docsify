import { createContext, useContext, useState, useEffect } from "react";

const StateContext = createContext({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
});

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
  
  const setToken = (newToken) => {
    _setToken(newToken);
    if (newToken) {
      localStorage.setItem("ACCESS_TOKEN", newToken);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  // Define the inactivity timeout (e.g., 30 minutes)
  const inactivityTimeout = 30 * 60 * 1000; // 30 minutes in milliseconds

  // Function to clear the token when it expires
  const clearExpiredToken = () => {
    const tokenExpiration = localStorage.getItem("TOKEN_EXPIRATION");
    if (tokenExpiration && Date.now() > parseInt(tokenExpiration)) {
      setToken(null); // Token has expired, clear it
    }
  };

  // Set up a timer to periodically check for token expiration
  useEffect(() => {
    const intervalId = setInterval(clearExpiredToken, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, []);

  // Function to update the token's expiration time
  const updateTokenExpiration = () => {
    const expirationTime = Date.now() + inactivityTimeout;
    localStorage.setItem("TOKEN_EXPIRATION", expirationTime);
  };

  return (
    <StateContext.Provider
      value={{
        user,
        token,
        setUser,
        setToken,
        updateTokenExpiration, // Expose this function to update the token's expiration
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
