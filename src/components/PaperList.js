// src/components/PaperList.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 引入
import { fetchPapers } from '../services/api';
import PaperCard from './PaperCard';

const PaperList = ({ onSelectPaper }) => {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // 通用错误状态

    // 新增：权限错误弹窗状态
    const [permissionError, setPermissionError] = useState(null); 
    const navigate = useNavigate();

    useEffect(() => {
        const loadPapers = async () => {
            try {
                setLoading(true);
                setError(null);
                const papersData = await fetchPapers();
                setPapers(papersData);
            } catch (err) {
                // 在这里处理特定的权限错误
                if (err.status === 500 && err.message?.includes('[401]')) {
                    setPermissionError("你没有获取考试题权限");
                } else {
                    // 处理其他所有错误
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        loadPapers();
    }, []);

    // 关闭弹窗并跳转到Dashboard
    const handlePermissionModalClose = () => {
        setPermissionError(null);
        navigate('/dashboard');
    };

    if (loading) {
        return <div className="loading">正在加载试卷列表...</div>;
    }

    // 优先显示权限错误弹窗
    if (permissionError) {
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <p>{permissionError}</p>
                    <button className="modal-close-button" onClick={handlePermissionModalClose}>
                        OK
                    </button>
                </div>
            </div>
        );
    }

    // 显示通用错误
    if (error) {
        return <div className="error">加载失败: {error}</div>;
    }

    return (
        <div className="paper-list-container">
            <h2>请选择一份考试题</h2>
            <div className="papers-grid">
                {papers.length > 0 ? (
                    papers.map(paper => (
                        <PaperCard key={paper.id} paper={paper} onSelect={onSelectPaper} />
                    ))
                ) : (
                    <p>没有可用的试卷。</p>
                )}
            </div>
        </div>
    );
};

export default PaperList;