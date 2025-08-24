// src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { 
    fetchAccountBalance,
    fetchUntestedCount,
    fetchProgressingCount,
    fetchUserInfo
} from '../services/api';
import CandidatesTable from '../components/CandidatesTable'; // 引入新的表格组件

// 辅助函数：格式化时间戳 (毫秒)
const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString();
}

const DashboardPage = () => {
    const [stats, setStats] = useState({ balance: null, untested: null, progressing: null });
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadStats = async () => {
            const results = await Promise.allSettled([
                fetchAccountBalance(),
                fetchUntestedCount(),
                fetchProgressingCount(),
                fetchUserInfo()
            ]);

            // (这部分逻辑保持不变)
            if (results[0].status === 'fulfilled') setStats(prev => ({ ...prev, balance: results[0].value?.money }));
            if (results[1].status === 'fulfilled') setStats(prev => ({ ...prev, untested: results[1].value }));
            if (results[2].status === 'fulfilled') setStats(prev => ({ ...prev, progressing: results[2].value }));
            if (results[3].status === 'fulfilled') {
                setUserInfo(results[3].value);
            } else {
                setError('无法加载用户信息');
            }
            setLoading(false);
        };
        loadStats();
    }, []);

    return (
        <div className="page-container">
            <h2>Dashboard</h2>
            {error && <div className="error" style={{textAlign: 'center', marginBottom: '1rem'}}>{error}</div>}
            
            <div className="dashboard-grid">
                <StatCard title="牛客网余额" value={stats.balance !== null ? `¥ ${stats.balance.toLocaleString()}` : '...'} isLoading={loading} />
                <StatCard title="尚未完成测试" value={stats.untested !== null ? `${stats.untested} 人` : '...'} isLoading={loading} />
                <StatCard title="进程中人数" value={stats.progressing !== null ? `${stats.progressing} 人` : '...'} isLoading={loading} />
                <UserInfoCard userInfo={userInfo} isLoading={loading} />
            </div>

            {/* 直接渲染独立的候选人表格组件 */}
            <CandidatesTable />
        </div>
    );
};
// --- 可复用的小组件 ---

// 统计卡片组件
const StatCard = ({ title, value, isLoading }) => (
    <div className="stat-card">
        <h4 className="stat-card-title">{title}</h4>
        {isLoading ? <div className="stat-card-value loading-shimmer">...</div> : <div className="stat-card-value">{value}</div>}
    </div>
);

// 用户信息卡片组件
const UserInfoCard = ({ userInfo, isLoading }) => (
    <div className="stat-card info-card">
         <h4 className="stat-card-title">当前用户信息：</h4>
         {isLoading ? <div className="loading-shimmer" style={{height: '80px', borderRadius:'4px'}}></div> : (
             <ul>
                 <li><span>公司：</span><span>{userInfo?.companyName}</span></li>
                 <li><span>邮箱：</span><span>{userInfo?.email}</span></li>
                 <li><span>电话：</span><span>{userInfo?.phone}</span></li>
                 <li><span>账号有效期：</span><span>{formatTimestamp(userInfo?.validBeginTime)} - {formatTimestamp(userInfo?.validEndTime)}</span></li>
             </ul>
         )}
    </div>
);

// 状态框组件
const statusMap = {
    'test invitation sent': { text: '测试已邀请', className: 'status-blue' },
    'test finished':        { text: '测试已完成', className: 'status-green' },
    'waiting for interview':{ text: '等待面试',  className: 'status-orange' },
    'reject':               { text: '拒绝',      className: 'status-red' },
    'sending offer':        { text: '正在发 Offer', className: 'status-purple' },
    'done':                 { text: '结束',      className: 'status-dark-green' },
    'default':              { text: '未知',  className: 'status-grey' }
};
const StatusBadge = ({ status }) => {
    const { text, className } = statusMap[status] || statusMap['default'];
    return <span className={`status-badge ${className}`}>{text}</span>;
};


export default DashboardPage;