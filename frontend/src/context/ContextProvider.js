import { createContext, useContext, useState, useEffect } from "react";

const StateContext = createContext({
  user: null,
  role: null,
  access: null,
  token: null,
  clientprovider: null,
  clientname: null,
  clientacr: null,
  setUser: () => {},
  setRole: () => {},
  setAccess: () => {},  
  setToken: () => {},
  setClientProvider: () => {},
  setClientName: () => {},
  setClientAcr: () => {},
  updateTokenExpiration: () => {}, // Expose this function to update the token's expiration
});

export const ContextProvider = ({ children }) => {
  const [user, _setUser] = useState(localStorage.getItem("ACCESS_USER"));
  const [role, _setRole] = useState(localStorage.getItem("ACCESS_ROLE"));   
  const [access, _setAccess] = useState(localStorage.getItem("ACCESS_LEVEL"));
  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
  const [clientprovider, _setClientProvider] = useState(localStorage.getItem("ACCESS_CLIENT"));
  const [clientname, _setClientName] = useState(localStorage.getItem("ACCESS_CLIENT_NAME"));
  const [clientacr, _setClientAcr] = useState(localStorage.getItem("ACCESS_CLIENT_ACR"));
  // const [token, _setToken] = useState("expired");
  
  const setUser = (newUser) => {
    _setUser(newUser);
    if (newUser) {
      localStorage.setItem("ACCESS_USER", newUser);
    } else {
      localStorage.removeItem("ACCESS_USER");
    }
  };

  const setRole = (newRole) => {
    _setRole(newRole);
    if (newRole) {
      localStorage.setItem("ACCESS_ROLE", newRole);
    } else {
      localStorage.removeItem("ACCESS_ROLE");
    }
  };
  const setAccess = (newAccess) => {
    _setAccess(newAccess);
    if (newAccess) {
      localStorage.setItem("ACCESS_LEVEL", newAccess);
    } else {
      localStorage.removeItem("ACCESS_LEVEL");
    }
  };

  const setToken = (newToken) => {
    _setToken(newToken);
    if (newToken) {
      localStorage.setItem("ACCESS_TOKEN", newToken);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  const setClientProvider = (newClient) => {
    _setClientProvider(newClient);
    if (newClient) {
      localStorage.setItem("ACCESS_CLIENT", newClient);
    } else {
      localStorage.removeItem("ACCESS_CLIENT");
    }
  };

  const setClientName = (newClientName) => {
    _setClientName(newClientName);
    if (newClientName) {
      localStorage.setItem("ACCESS_CLIENT_NAME", newClientName);
    } else {
      localStorage.removeItem("ACCESS_CLIENT_NAME");
    }
  };
  const setClientAcr = (newClientAcr) => {
    _setClientAcr(newClientAcr);
    if (newClientAcr) {
      localStorage.setItem("ACCESS_CLIENT_ACR", newClientAcr);
    } else {
      localStorage.removeItem("ACCESS_CLIENT_ACR");
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

  // Function to update the token's expiration time
  const updateTokenExpiration = () => {
    const expirationTime = Date.now() + inactivityTimeout;
    localStorage.setItem("TOKEN_EXPIRATION", expirationTime);
  };

  useEffect(() => {
    // Periodically check for token expiration
    const intervalId = setInterval(clearExpiredToken, 60000); // Check every minute

    // Add event listener to update token expiration on tab or browser closure
    const handleBeforeUnload = () => {
      updateTokenExpiration(); // Update token expiration before unloading
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup: Remove the event listener and the interval
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <StateContext.Provider
      value={{
        user,
        role,
        access,
        token,
        clientprovider,
        clientname,
        clientacr,
        setUser,
        setRole,
        setAccess,
        setToken,
        setClientProvider,
        setClientName,
        setClientAcr,
        updateTokenExpiration,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
