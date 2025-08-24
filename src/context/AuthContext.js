// src/context/AuthContext.js
import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('jwt_token'));
    const [user, setUser] = useState(() => {
        const storedToken = localStorage.getItem('jwt_token');
        if (storedToken) {
            try { return jwtDecode(storedToken); } 
            catch (error) { return null; }
        }
        return null;
    });

    const navigate = useNavigate();

    // 使用 useCallback 包装，确保函数引用稳定
    const loginAction = useCallback((jwt) => {
        try {
            const decodedUser = jwtDecode(jwt);
            const role = decodedUser.role;

            if (!role) {
                const errorMessage = "Login failed: User information is incomplete (missing role).";
                console.error("AuthContext ERROR:", errorMessage);
                return errorMessage;
            }
            
            localStorage.setItem('jwt_token', jwt);
            setToken(jwt);
            setUser(decodedUser);
            
            if (role === 'PMO') {
                navigate('/hr/dashboard');
            } else if (role === 'VENDOR') {
                navigate('/vendor/dashboard');
            } else {
                navigate('/');
            }
            return null;
        } catch (error) {
            const errorMessage = "Login failed: The received authentication info is invalid.";
            console.error("AuthContext ERROR:", errorMessage, error);
            return errorMessage;
        }
    }, [navigate]);

    // 使用 useCallback 包装，确保函数引用稳定
    const logoutAction = useCallback(() => {
        localStorage.removeItem('jwt_token');
        setToken(null);
        setUser(null);
        navigate('/login');
    }, [navigate]);

    // 使用 useMemo 包装，只有在依赖项变化时才重新创建 value 对象
    const authContextValue = useMemo(() => ({
        token,
        user,
        login: loginAction,
        logout: logoutAction,
    }), [token, user, loginAction, logoutAction]);

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};