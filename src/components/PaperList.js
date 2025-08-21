// src/components/PaperList.js

import React, { useState, useEffect } from 'react';
import { fetchPapers } from '../services/api';
import PaperCard from './PaperCard';

const PaperList = ({ onSelectPaper }) => {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPapers = async () => {
            try {
                setLoading(true);
                setError(null);
                const papersData = await fetchPapers();
                setPapers(papersData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadPapers();
    }, []);

    if (loading) {
        return <div className="loading">正在加载试卷列表...</div>;
    }

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