// src/pages/PMOStudentsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { fetchStudents } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const PMOStudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [pageInfo, setPageInfo] = useState({ number: 0, totalPages: 1, first: true, last: true });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadStudents = useCallback(async (page) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchStudents(page, 10); // 每页加载10条
            setStudents(data.content || []);
            setPageInfo({ number: data.number, totalPages: data.totalPages, first: data.first, last: data.last });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadStudents(0); }, [loadStudents]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < pageInfo.totalPages) {
            loadStudents(newPage);
        }
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp).toLocaleString();
    };

    return (
        <div className="page-container">
            <h2>PMO - 候选人详情</h2>
            {error && <div className="error" style={{textAlign: 'center', padding: '1rem'}}>{`加载失败: ${error}`}</div>}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>考试头像</th>
                            <th>姓名</th>
                            <th>手机号</th>
                            <th>邮箱</th>
                            <th>招聘状态</th>
                            <th>供应商</th>
                            <th>创建时间</th>
                            <th>考试结束时间</th>
                            <th>考卷名称</th>
                            <th>PDF报告</th>
                            <th>成绩</th>
                            <th>作弊风险提示</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                             <tr><td colSpan="12" style={{textAlign: 'center', padding: '2rem'}}>正在加载...</td></tr>
                        ) : students.length > 0 ? students.map(student => (
                            <tr key={student.id}>
                                <td>{student.headUrl && <img src={student.headUrl} alt={student.name} className="table-avatar" />}</td>
                                <td>{student.name}</td>
                                <td>{student.mobile}</td>
                                <td>{student.email}</td>
                                <td><StatusBadge status={student.hiringStatus} /></td>
                                <td>{student.vendorCompany}</td>
                                <td>{formatTimestamp(student.createdTime)}</td>
                                <td>{formatTimestamp(student.paperEndTime)}</td>
                                <td>{student.paperName || '--'}</td>
                                <td>
                                    {student.pdfUrl ? 
                                        <a href={student.pdfUrl} target="_blank" rel="noopener noreferrer" className="details-link">查看PDF</a> 
                                        : 'N/A'}
                                </td>
                                <td>{student.userScore != null ? `${student.userScore} / ${student.paperScore}` : '--'}</td>
                                <td>{student.cheatInfoDesc || '无'}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan="12" style={{textAlign: 'center', padding: '2rem'}}>没有找到候选人信息。</td></tr>
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

export default PMOStudentsPage;