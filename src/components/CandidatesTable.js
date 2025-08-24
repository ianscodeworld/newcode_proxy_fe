// src/components/CandidatesTable.js
import React, { useState, useEffect, useCallback } from 'react';
import { fetchStudents } from '../services/api';
import StatusBadge from './StatusBadge'; // 引入我们刚创建的组件

const CandidatesTable = () => {
    const [students, setStudents] = useState([]);
    const [pageInfo, setPageInfo] = useState({ number: 0, totalPages: 1, first: true, last: true });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadStudents = useCallback(async (page) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchStudents(page, 5); // 每页加载5条
            setStudents(data.content || []);
            setPageInfo({
                number: data.number,
                totalPages: data.totalPages,
                first: data.first,
                last: data.last,
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStudents(0); // 初始加载第一页
    }, [loadStudents]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < pageInfo.totalPages) {
            loadStudents(newPage);
        }
    };

    const formatDateTime = (isoString) => new Date(isoString).toLocaleString();

    return (
        <div className="candidate-table-section">
            <h2 style={{ marginTop: '2.5rem' }}>候选人管理</h2>
            
            {/* 错误提示 */}
            {error && <div className="error" style={{textAlign: 'center'}}>加载失败: {error}</div>}

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>姓名</th>
                            <th>邮箱</th>
                            <th>手机号</th>
                            <th>招聘状态</th>
                            <th>供应商</th>
                            <th>创建时间</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{textAlign: 'center'}}>正在加载候选人...</td></tr>
                        ) : students.length > 0 ? students.map(student => (
                            <tr key={student.id}>
                                <td>{student.name}</td>
                                <td>{student.email}</td>
                                <td>{student.mobile}</td>
                                <td><StatusBadge status={student.hiringStatus} /></td>
                                <td>{student.vendorCompany}</td>
                                <td>{formatDateTime(student.createdTime)}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan="6" style={{textAlign: 'center'}}>没有找到候选人信息。</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination-controls">
                <button onClick={() => handlePageChange(pageInfo.number - 1)} disabled={pageInfo.first}>&larr; 上一页</button>
                <span>第 {pageInfo.number + 1} 页 / 共 {pageInfo.totalPages} 页</span>
                <button onClick={() => handlePageChange(pageInfo.number + 1)} disabled={pageInfo.last}>下一页 &rarr;</button>
            </div>
        </div>
    );
};

export default CandidatesTable;