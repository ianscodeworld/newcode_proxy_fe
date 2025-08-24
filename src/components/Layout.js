// src/components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <Outlet /> {/* 子页面将在这里渲染 */}
            </main>
        </div>
    );
};

export default Layout;