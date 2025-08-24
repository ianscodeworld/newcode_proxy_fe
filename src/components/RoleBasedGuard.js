// src/components/RoleBasedGuard.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedGuard = ({ allowedRoles }) => {
    const { token, user } = useAuth();

    // 1. 检查是否登录
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 2. 检查角色是否匹配
    // user?.role 会安全地访问role属性，如果user是null则返回undefined
    const isAuthorized = allowedRoles.includes(user?.role);

    return isAuthorized ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default RoleBasedGuard;