// src/components/PaperCard.js

import React from 'react';

const PaperCard = ({ paper, onSelect }) => {

    // 一个简单的辅助函数来格式化时间戳，例如: 2025-08-15 14:15
    const formatDateTime = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        // 使用 toLocaleString 并指定选项来获得 YYYY-MM-DD HH:mm 的格式
        return date.toLocaleString('sv-SE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).replace(' ', ' ');
    };
    
    // 根据API返回的数据决定显示的状态
    const getStatusTag = () => {
        // 示例逻辑：如果试卷已开始且未结束，则显示“进行中”
        // 您可以根据 paper.started, paper.finished, paper.beenTested 等字段扩展此逻辑
        if (paper.started && !paper.finished) {
            // 注意：图像中的锁图标 🔒 我也加上了
            return <span className="status-tag in-progress">进行中 🔒</span>;
        }
        if (paper.finished) {
            return <span className="status-tag finished">已结束</span>;
        }
        //可以添加更多状态...
        return null; // 如果没有匹配的状态，则不显示标签
    };

    const beginTimeText = formatDateTime(paper.createTime); // 使用创建时间作为开始时间
    const endTimeText = paper.forever ? '长期有效' : formatDateTime(paper.endTime);

    return (
        <div className="paper-card-new">
            {/* --- 上半部分：标题、时间、状态 --- */}
            <div className="card-header">
                <h3>{paper.paperName}</h3>
                <p className="time-range">{beginTimeText} 至 {endTimeText}</p>
                {getStatusTag()}
            </div>

            {/* --- 分隔线 --- */}
            <div className="separator"></div>

            {/* --- 下半部分：统计数据 --- */}
            <div className="card-stats">
                <div className="stat-item">
                    {/* API中无此数据，暂时显示 N/A */}
                    <span className="count">{paper.presetUserCount}</span> 
                    <span className="label">已邀请</span>
                </div>
                <div className="stat-item">
                    <span className="count">{paper.personTotal }</span>
                    <span className="label">已参与</span>
                </div>
                <div className="stat-item">
                     {/* API中无此数据，暂时显示 N/A */}
                    <span className="count">{paper.testCount}</span>
                    <span className="label">已完成</span>
                </div>
                <div className="stat-item">
                    <span className="count">{paper.duration}分钟</span>
                    <span className="label">时长</span>
                </div>
            </div>

            {/* --- 操作按钮 --- */}
            <button onClick={() => onSelect(paper)} className="select-button">
                选择并发送邀请
            </button>
        </div>
    );
};

export default PaperCard;