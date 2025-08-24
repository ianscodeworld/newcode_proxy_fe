// src/pages/CandidatesPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { fetchStudents } from '../services/api';

// *** 1. 新增：状态映射配置对象 ***
// 将后端返回的状态字符串，映射到前端显示的文本和CSS类名
const statusMap = {
    'test invitation sent': { text: '测试已邀请', className: 'status-blue' },
    'test finished':        { text: '测试已完成', className: 'status-green' },
    'waiting for interview':{ text: '等待面试',  className: 'status-orange' },
    'reject':               { text: '拒绝',      className: 'status-red' },
    'sending offer':        { text: '正在发 Offer', className: 'status-purple' },
    'done':                 { text: '结束',      className: 'status-dark-green' },
    // 添加一个默认/备用状态
    'default':              { text: '未知状态',  className: 'status-grey' }
};

// 辅助函数，根据后端状态获取对应的显示信息
const getStatusDisplayInfo = (status) => {
    return statusMap[status] || statusMap['default'];
};


const CandidatesPage = () => {
    const [students, setStudents] = useState([]);
    const [pageInfo, setPageInfo] = useState({ number: 0, totalPages: 1, first: true, last: true });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadStudents = useCallback(async (page) => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchStudents(page, 10);
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
        loadStudents(0);
    }, [loadStudents]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < pageInfo.totalPages) {
            loadStudents(newPage);
        }
    };
    
    const formatDateTime = (isoString) => new Date(isoString).toLocaleString();

    if (loading) return <div className="loading">正在加载候选人列表...</div>;
    if (error) return <div className="error">加载失败: {error}</div>;

    return (
        <div className="page-container">
            <h2>候选人管理</h2>
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
                        {students.length > 0 ? students.map(student => {
                            // *** 2. 在渲染前获取状态信息 ***
                            const statusInfo = getStatusDisplayInfo(student.hiringStatus);
                            return (
                                <tr key={student.id}>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>{student.mobile}</td>
                                    <td>
                                        {/* *** 3. 应用状态文本和CSS类 *** */}
                                        <span className={`status-badge ${statusInfo.className}`}>
                                            {statusInfo.text}
                                        </span>
                                    </td>
                                    <td>{student.vendorCompany}</td>
                                    <td>{formatDateTime(student.createdTime)}</td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan="6">没有找到候选人信息。</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination-controls">
                <button onClick={() => handlePageChange(pageInfo.number - 1)} disabled={pageInfo.first}>
                    &larr; 上一页
                </button>
                <span>
                    第 {pageInfo.number + 1} 页 / 共 {pageInfo.totalPages} 页
                </span>
                <button onClick={() => handlePageChange(pageInfo.number + 1)} disabled={pageInfo.last}>
                    下一页 &rarr;
                </button>
            </div>
        </div>
    );
};

export default CandidatesPage;