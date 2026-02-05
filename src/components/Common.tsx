import { createContext, useContext, useState, ReactNode } from 'react';


// Create a context value with initial value then set it in Provider, then Provider's children get context with useContext
const RefreshContext = createContext<{ key: boolean, triggerRefresh: () => void } | null>(null)

export function RefreshProvider({ children }: { children: ReactNode }) {
    const [key, setKey] = useState(false);

    const triggerRefresh = () => {
        setKey(prev => !prev);
    }

    return (
        <RefreshContext.Provider value={{ key, triggerRefresh }}>
            {children}
        </RefreshContext.Provider>
    )
}

export const useRefresh = () => {
    // Get context in element wrapped by RefreshProvider who give context
    const context = useContext(RefreshContext);
    if (!context) {
        throw new Error('useRefresh must be used within RefreshProvider');
    }
    return context;
};