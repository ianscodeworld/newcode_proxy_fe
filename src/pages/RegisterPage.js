// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        apiKey: '',
        token: '',
        company: '',
        role: 'VENDOR' // 默认角色
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await registerUser(formData);
            setSuccess(response.message || '用户注册成功！将在3秒后跳转到登录页...');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <form onSubmit={handleSubmit} className="register-form card-container">
                <h2>注册新用户</h2>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                <div className="form-group">
                    <label>用户名</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>密码</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>API Key</label>
                    <input type="text" name="apiKey" value={formData.apiKey} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Token</label>
                    <input type="text" name="token" value={formData.token} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>公司</label>
                    <input type="text" name="company" value={formData.company} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>角色</label>
                    <select name="role" value={formData.role} onChange={handleChange}>
                        <option value="VENDOR">VENDOR</option>
                        <option value="PMO">PMO</option>
                        <option value="HR">HR</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                </div>

                <button type="submit" className="send-all-button" disabled={loading}>
                    {loading ? '正在注册...' : '注册'}
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;