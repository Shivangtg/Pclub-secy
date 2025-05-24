'use client'
import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = function (props) {
    const [user, setUser] = useState(null);
    const [loading,setLoading] = useState(null);
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedUser = sessionStorage.getItem('user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
            setLoading(false);
        }
    }, []);

    // Save to sessionStorage when user changes
    useEffect(() => {
        if (typeof window !== "undefined") {
            if (user) {
                sessionStorage.setItem('user', JSON.stringify(user));
            } else {
                sessionStorage.removeItem('user');
            }
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {props.children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
