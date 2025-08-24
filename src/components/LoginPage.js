// src/components/LoginPage.js

import React, { useState } from 'react';
import { loginUser } from '../services/api';

// --- 图标组件 (保持不变) ---
const UserAvatarIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="#FFFFFF" strokeWidth="4"><circle cx="50" cy="50" r="48" /><circle cx="50" cy="40" r="18" /><path d="M25,85 A25,25 0 0,1 75,85" strokeLinecap="round" /></svg> );
const UserIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg> );
const LockIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" /></svg> );


const LoginPage = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    // *** 新增: 用于控制弹窗显示/隐藏的状态 ***
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // ... (handleSubmit 的逻辑保持不变)
        if (!username || !password) {
            setError('用户名和密码不能为空');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const data = await loginUser({ username, password });
            if (data.jwt) {
                onLoginSuccess(data.jwt);
            } else {
                setError('登录失败：未收到Token');
            }
        } catch (err) {
            setError(err.message || '登录时发生未知错误');
        } finally {
            setLoading(false);
        }
    };

    // *** 新增: 处理"忘记密码"链接点击事件的函数 ***
    const handleForgotPasswordClick = (e) => {
        e.preventDefault(); // 阻止链接的默认跳转行为
        setIsModalOpen(true); // 打开弹窗
    };

    return (
        <> {/* 使用 Fragment 包裹，因为我们现在有多个顶级元素 (弹窗和容器) */}
            <div className="login-container">
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-avatar-container"><UserAvatarIcon /></div>
                    <h2>LOGIN</h2>
                    {error && <p className="error-message">{error}</p>}

                    <div className="input-wrapper">
                        <span className="input-icon"><UserIcon /></span>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" disabled={loading} />
                    </div>

                    <div className="input-wrapper">
                        <span className="input-icon"><LockIcon /></span>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" disabled={loading} />
                    </div>

                    <div className="login-options">
                        <label><input type="checkbox" /> Remember me</label>
                        {/* *** 修改: 为链接添加 onClick 事件 *** */}
                        <a href="#forgot" className="forgot-password" onClick={handleForgotPasswordClick}>
                            Forgot Password?
                        </a>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'LOGGING IN...' : 'LOGIN'}
                    </button>
                </form>
            </div>

            {/* *** 新增: 弹窗的 JSX 结构 *** */}
            {/* 只有当 isModalOpen 为 true 时，才会渲染这个弹窗 */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>Too lazy to build a rest-password service, <br /> &nbsp; &nbsp;but you can send a Coffee to Ian. <br /> He'll know what to do😉</p>
                        <button className="modal-close-button" onClick={() => setIsModalOpen(false)}>
                            好的
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default LoginPage;