// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PMOStudentsPage from './pages/PMOStudentsPage'; // 引入新页面
import RegisterPage from './pages/RegisterPage'; // 引入新页面

// --- 组件和页面导入 ---
import LoginPage from './components/LoginPage.js';
import Layout from './components/Layout.js';
import RoleBasedGuard from './components/RoleBasedGuard';
import VendorDashboard from './pages/VendorDashboard';
import PMODashboard from './pages/PMODashboard';
import ExamSenderPage from './pages/ExamSenderPage';
import CandidatesPage from './pages/CandidatesPage'; // 重新引入
import UnauthorizedPage from './pages/UnauthorizedPage';
import './App.css';


const ProtectedRoutes = ({ token }) => {
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

const HomeRedirect = () => {
    const { user } = useAuth();
    if (user?.role === 'PMO') return <Navigate to="/hr/dashboard" replace />;
    if (user?.role === 'VENDOR') return <Navigate to="/vendor/dashboard" replace />;
    return <Navigate to="/login" replace />;
};

function AppRoutes() {
    const { user, logout } = useAuth();

    return (
        <div className="App">
            <header className="App-header">
                <h1>招聘管理系统</h1>
                {user && <button onClick={logout} className="logout-button">退出登录</button>}
            </header>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                <Route element={<RoleBasedGuard allowedRoles={['PMO']} />}>
                    <Route element={<Layout />}>
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/hr/dashboard" element={<PMODashboard />} />
                        <Route path="/hr/students" element={<PMOStudentsPage />} />
                    </Route>
                </Route>
                
                <Route element={<RoleBasedGuard allowedRoles={['VENDOR']} />}>
                     <Route element={<Layout />}>
                        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                        {/* *** 新增：恢复候选人管理路由 *** */}
                        <Route path="/vendor/candidates" element={<CandidatesPage />} /> 
                        <Route path="/vendor/send-exam" element={<ExamSenderPage />} />
                     
                     </Route>
                </Route>

                <Route path="/" element={<HomeRedirect />} />
                <Route path="*" element={<h2>404: Page Not Found</h2>} />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;