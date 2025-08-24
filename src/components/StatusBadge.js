// src/components/StatusBadge.js
import React from 'react';

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

export default StatusBadge;