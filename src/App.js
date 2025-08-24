// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';

// --- 组件和页面导入 ---
import LoginPage from './components/LoginPage.js';
import Layout from './components/Layout.js';
import DashboardPage from './pages/DashboardPage';
import ExamSenderPage from './pages/ExamSenderPage';
import './App.css';

/**
 * 一个“受保护的路由”组件
 * - 如果用户已登录 (有token), 它会渲染其子路由 (<Outlet />)
 * - 如果用户未登录 (没有token), 它会导航到 /login 页面
 */
const ProtectedRoutes = ({ token }) => {
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

/**
 * 主要的应用逻辑组件
 */
function AppLogic() {
    const [token, setToken] = useState(localStorage.getItem('jwt_token'));
    const navigate = useNavigate();
    
    // handleLoginSuccess 和 handleLogout 现在由 AppLogic 管理
    const handleLoginSuccess = (jwt) => {
        localStorage.setItem('jwt_token', jwt);
        setToken(jwt);
        navigate('/dashboard');
    };

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        setToken(null);
        // navigate('/login') 会在 ProtectedRoutes 组件中自动处理
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>招聘管理系统</h1>
                {token && <button onClick={handleLogout} className="logout-button">退出登录</button>}
            </header>
            <Routes>
                {/* 1. 公共路由：登录页 */}
                {/* 如果用户已登录，访问/login会自动跳转到dashboard */}
                <Route path="/login" element={
                    !token ? <LoginPage onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/dashboard" replace />
                } />
                
                {/* 2. 受保护的路由组 */}
                <Route element={<ProtectedRoutes token={token} />}>
                    {/* 所有需要登录的页面都放在这里，并由 <Layout> 包裹 */}
                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/send-exam" element={<ExamSenderPage />} />
                        
                        {/* 默认路径重定向到 dashboard */}
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Route>
                </Route>

                {/* 3. (可选) 添加一个404 "未找到" 页面 */}
                <Route path="*" element={<div><h2>404: Page Not Found</h2><p>请检查URL或返回Dashboard。</p></div>} />
            </Routes>
        </div>
    );
}


/**
 * 根组件，负责提供 BrowserRouter 上下文
 * 这是程序的总入口
 */
function App() {
    return (
        <BrowserRouter>
            <AppLogic />
        </BrowserRouter>
    );
}

export default App;