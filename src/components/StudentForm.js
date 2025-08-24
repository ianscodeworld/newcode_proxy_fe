// src/components/StudentForm.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendExam } from '../services/api';

// 辅助函数 (保持不变)
const formatTimestamp = (isoString) => {
    if (!isoString) return '未知时间';
    return new Date(isoString).toLocaleString();
};
const getStatusClass = (message) => {
    if (!message) return '';
    if (message.startsWith('✅')) return 'status-success';
    if (message.startsWith('❌')) return 'status-error';
    if (message.startsWith('⚠️')) return 'status-warning';
    if (message.startsWith('发送中')) return 'status-info';
    return '';
};


const StudentForm = ({ paper, onBack }) => {
    const [students, setStudents] = useState([ { id: 1, name: '', email: '', phone: '' } ]);
    const [statuses, setStatuses] = useState({});
    const [isSending, setIsSending] = useState(false);
    
    const navigate = useNavigate();
    const [permissionError, setPermissionError] = useState(null);

    // (handleAddStudent, handleRemoveStudent等函数保持不变...)
    const handleAddStudent = () => {
        const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
        setStudents([...students, { id: newId, name: '', email: '', phone: '' }]);
    };
    const handleRemoveStudent = (id) => {
        setStudents(students.filter(student => student.id !== id));
    };
    const handleInputChange = (id, field, value) => {
        const updatedStudents = students.map(student =>
            student.id === id ? { ...student, [field]: value } : student
        );
        setStudents(updatedStudents);
    };
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };
    
    const handlePermissionModalClose = () => {
        setPermissionError(null);
        navigate('/dashboard');
    };


    const handleSubmit = async () => {
        setIsSending(true);
        setStatuses({});

        for (const student of students) {
            if (!student.name.trim() || !validateEmail(student.email)) {
                alert(`请检查考生 "${student.name || '未命名'}" 的信息是否完整且格式正确。`);
                setIsSending(false);
                return;
            }
            try {
                setStatuses(prev => ({ ...prev, [student.id]: '发送中...' }));
                const studentData = { name: student.name, email: student.email, phone: student.phone, key: student.email };
                await sendExam(paper.id, studentData);
                setStatuses(prev => ({ ...prev, [student.id]: `✅ 已成功发送邀请给 ${student.name}` }));

            } catch (error) {
                // ===================================================
                //  !!! 核心修改：更新这里的判断条件 !!!
                // ===================================================

                // 检查 status 是否为 500 并且 message 中是否包含 [401]
                if (error.status === 500 && error.message?.includes('[401]')) {
                    setPermissionError("你没有发送考试题权限");
                    break; 

                } else if (error.status === 409 && error.message === "Student already exists.") {
                    const creationTime = error.data?.creationTime;
                    const formattedTime = formatTimestamp(creationTime);
                    const alertMessage = `学生 "${student.name}" 已存在。\n创建时间为: ${formattedTime}`;
                    alert(alertMessage);
                    setStatuses(prev => ({ ...prev, [student.id]: `⚠️ 学生已存在` }));
                
                } else {
                    setStatuses(prev => ({ ...prev, [student.id]: `❌ 发送失败: ${error.message}` }));
                }
            }
        }
        
        setIsSending(false);
    };

    return (
        <>
            <div className="student-form-container">
                {/* ... (表单的JSX结构保持不变) ... */}
                <button onClick={onBack} className="back-button">&larr; 返回选择试卷</button>
                <h2>为试卷: "{paper.paperName}" 添加考生</h2>
                {students.map((student, index) => (
                    <div key={student.id} className="student-input-row">
                        <span>考生 {index + 1}</span>
                        <input type="text" placeholder="姓名 (必填)" value={student.name} onChange={(e) => handleInputChange(student.id, 'name', e.target.value)} />
                        <input type="email" placeholder="邮箱 (必填)" value={student.email} onChange={(e) => handleInputChange(student.id, 'email', e.target.value)} />
                        <input type="tel" placeholder="电话 (选填)" value={student.phone} onChange={(e) => handleInputChange(student.id, 'phone', e.target.value)} />
                        {students.length > 1 && ( <button onClick={() => handleRemoveStudent(student.id)} className="remove-button"> 移除 </button> )}
                        {statuses[student.id] && (
                            <span className={`status-message ${getStatusClass(statuses[student.id])}`} title={statuses[student.id]}>
                                {statuses[student.id]}
                            </span>
                        )}
                    </div>
                ))}
                <div className="form-actions">
                    <button onClick={handleAddStudent} className="add-button">+ 添加另一位考生</button>
                    <button onClick={handleSubmit} className="send-all-button" disabled={isSending}>
                        {isSending ? '正在发送...' : '全部发送'}
                    </button>
                </div>
            </div>

            {permissionError && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>{permissionError}</p>
                        <button className="modal-close-button" onClick={handlePermissionModalClose}>
                            OK
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudentForm;