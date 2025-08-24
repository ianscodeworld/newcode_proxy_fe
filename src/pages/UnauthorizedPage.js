// src/pages/UnauthorizedPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
    return (
        <div className="page-container" style={{ textAlign: 'center' }}>
            <h2>403 - 无访问权限</h2>
            <p>抱歉，您没有权限访问此页面。</p>
            <Link to="/">返回首页</Link>
        </div>
    );
};

export default UnauthorizedPage;