// src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- 图标组件 (保持不变) ---
const DashboardIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> );
const SendIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> );
const UsersIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> );
const RegisterIcon = () => ( // 新增注册图标
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="8.5" cy="7" r="4"></circle>
        <line x1="20" y1="8" x2="20" y2="14"></line>
        <line x1="17" y1="11" x2="23" y2="11"></line>
    </svg>
);
const Sidebar = () => {
    const { user } = useAuth();

    return (
        <aside className="sidebar">
            <nav>
                <ul>
                    {/* VENDOR 角色看到的链接 */}
                    {user?.role === 'VENDOR' && (
                        <>
                            <li><NavLink to="/vendor/dashboard"><DashboardIcon /><span>Dashboard</span></NavLink></li>
                            {/* *** 新增：恢复候选人管理链接 *** */}
                            <li><NavLink to="/vendor/candidates"><UsersIcon /><span>候选人管理</span></NavLink></li>
                            <li><NavLink to="/vendor/send-exam"><SendIcon /><span>考试题发送</span></NavLink></li>
                        </>
                    )}
                    
                    {/* PMO 角色看到的链接 */}
                    {user?.role === 'PMO' && (
                        <>
                            <li><NavLink to="/hr/dashboard"><DashboardIcon /><span>PMO Dashboard</span></NavLink></li>
                            <li><NavLink to="/hr/students"><UsersIcon /><span>学生详情</span></NavLink></li>
                            <li><NavLink to="/register"><RegisterIcon /><span>注册新用户</span></NavLink></li>
                        </>                    
                    )}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;