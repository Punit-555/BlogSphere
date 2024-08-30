import React, { createContext, useState } from 'react';

// Create the LoaderContext
const LoaderContext = createContext();

// Create a provider component
const LoaderProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <LoaderContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </LoaderContext.Provider>
    );
};

export { LoaderContext, LoaderProvider };
