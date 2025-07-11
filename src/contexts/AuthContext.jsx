// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { attachTokenToApi } from "../services/api";
import { getUserApi } from "../services/userApi";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [identity, setIdentity] = useState(null);
    const [token, setToken] = useState(() => {
        const savedToken = sessionStorage.getItem('token');
        attachTokenToApi(savedToken);
        return savedToken;
    });

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        attachTokenToApi(token);
    }, [token]);

    useEffect(() => {

        if (token) {
            sessionStorage.setItem('token', token);
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);

            } catch (e) {
                console.error("Invalid token:", e);
            }
        } else {
            sessionStorage.removeItem('token');
            setUser(null);
        }

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [token]);

    useEffect(() => {
        if (!user || !user.id) return;

        let isMounted = true;
        const fetchData = async () => {
            try {
                const resUser = await getUserApi(user.id);
                if (isMounted) setIdentity(resUser);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchData();
        return () => { isMounted = false; };
    }, [user?.id]);

    const contextValue = useMemo(() => ({
        token, setToken, user, isLoading, identity
    }), [token, isLoading, identity]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
