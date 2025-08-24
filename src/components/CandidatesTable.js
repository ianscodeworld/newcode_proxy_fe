// src/components/CandidatesTable.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchStudents } from '../services/api';
import StatusBadge from './StatusBadge';

const CandidatesTable = ({ isDetailsPage = false }) => {
    const [students, setStudents] = useState([]);
    const [pageInfo, setPageInfo] = useState({ number: 0, totalPages: 1, first: true, last: true });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadStudents = useCallback(async (page) => {
        setLoading(true);
        setError(null);
        try {
            // 在详情页加载更多条目，在概览页加载较少条目
            const pageSize = isDetailsPage ? 10 : 5;
            const data = await fetchStudents(page, pageSize);
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
    }, [isDetailsPage]); // 添加 isDetailsPage 作为依赖

    useEffect(() => { loadStudents(0); }, [loadStudents]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < pageInfo.totalPages) {
            loadStudents(newPage);
        }
    };

    const formatDateTime = (isoString) => new Date(isoString).toLocaleString();

    // 根据模式决定表格的总列数
    const totalColumns = isDetailsPage ? 8 : 6;

    return (
        <div className="candidate-section-card"> 
            <div className="section-header">
                <h2>{isDetailsPage ? "候选人管理" : "候选人概览"}</h2>
                {!isDetailsPage && (
                    <Link to="/candidates" className="details-link">
                        查看全部详情 &rarr;
                    </Link>
                )}
            </div>
            
            {error && <div className="error" style={{textAlign: 'center', padding: '1rem'}}>{`加载失败: ${error}`}</div>}

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>考试头像</th>
                            <th>姓名</th>
                            {isDetailsPage && <>
                                <th>邮箱</th>
                                <th>手机号</th>
                            </>}
                            <th>招聘状态</th>
                            <th>成绩</th>
                            <th>考卷名称</th>
                            <th>作弊风险提示</th>
                            {isDetailsPage && <th>供应商</th>}
                            <th>创建时间</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                             <tr><td colSpan={totalColumns} style={{textAlign: 'center', padding: '2rem'}}>正在加载候选人...</td></tr>
                        ) : students.length > 0 ? students.map(student => (
                            <tr key={student.id}>
                                <td>
                                    {student.headUrl && <img src={student.headUrl} alt={student.name} className="table-avatar" />}
                                </td>
                                <td>{student.name}</td>
                                {isDetailsPage && <>
                                    <td>{student.email}</td>
                                    <td>{student.mobile}</td>
                                </>}
                                <td><StatusBadge status={student.hiringStatus} /></td>
                                <td>
                                    {student.userScore != null ? `${student.userScore} / ${student.paperScore}` : '--'}
                                </td>
                                <td>{student.paperName || '--'}</td>
                                <td>
                                    {student.cheatInfoDesc 
                                        ? `存在作弊风险: ${student.cheatInfoDesc}` 
                                        : '无作弊风险'}
                                </td>
                                {isDetailsPage && <td>{student.vendorCompany}</td>}
                                <td>{formatDateTime(student.createdTime)}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan={totalColumns} style={{textAlign: 'center', padding: '2rem'}}>没有找到候选人信息。</td></tr>
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