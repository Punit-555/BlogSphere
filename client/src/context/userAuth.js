

import React, { createContext, useState } from 'react';

// Create the LoaderContext
const AuthContext = createContext();

// Create a provider component
const AuthProvider = ({ children }) => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [userDetails, setUserDetails] = useState("");
    return (
        <AuthContext.Provider value={{ isUserLoggedIn, userDetails, setUserDetails, setIsUserLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
