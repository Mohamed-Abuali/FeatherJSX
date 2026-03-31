/** @jsx hs */
import { hs, useState, createContext, useContext } from './index.js';

// 1. Create the context
const StateContext = createContext();

// Initial global state
const initialState = {
    user: null,
    theme: 'light',
};

// 2. Create the Provider component
export const StateProvider = ({ children }) => {
    const [state, setState] = useState(initialState);

    // You can add functions to update the state here
    const login = (username) => {
        setState(s => ({ ...s, user: { name: username } }));
    };

    const logout = () => {
        setState(s => ({ ...s, user: null }));
    };

    const toggleTheme = () => {
        setState(s => ({ ...s, theme: s.theme === 'light' ? 'dark' : 'light' }));
    };

    const value = {
        ...state,
        login,
        logout,
        toggleTheme,
    };

    return hs(StateContext.Provider, { value }, children);
};

// 3. Create the custom hook to consume the context
export const useGlobalState = () => {
    const context = useContext(StateContext);
    if (context === undefined) {
        throw new Error('useGlobalState must be used within a StateProvider');
    }
    return context;
};
