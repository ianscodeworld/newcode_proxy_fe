// src/components/StudentForm.js

import React, { useState } from 'react';
import { sendExam } from '../services/api';

const StudentForm = ({ paper, onBack }) => {
    const [students, setStudents] = useState([
        { id: 1, name: '', email: '', phone: '' }
    ]);
    const [statuses, setStatuses] = useState({}); // 用于存储每个学生的发送状态
    const [isSending, setIsSending] = useState(false);

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

    const handleSubmit = async () => {
        setIsSending(true);
        setStatuses({}); // 清空旧的状态

        // 简单的表单验证
        for (const student of students) {
            if (!student.name.trim()) {
                alert(`请填写ID为 ${student.id} 的考生姓名`);
                setIsSending(false);
                return;
            }
            if (!validateEmail(student.email)) {
                alert(`ID为 ${student.id} 的考生邮箱格式不正确`);
                setIsSending(false);
                return;
            }
        }
        
        // 依次为每个学生发送请求
        for (const student of students) {
            setStatuses(prev => ({ ...prev, [student.id]: '发送中...' }));
            const studentData = { name: student.name, email: student.email, phone: student.phone };
            const result = await sendExam(paper.id, studentData);

            if (result.success) {
                setStatuses(prev => ({ ...prev, [student.id]: '✅ 发送成功' }));
            } else {
                setStatuses(prev => ({ ...prev, [student.id]: `❌ 发送失败: ${result.message}` }));
            }
        }
        
        setIsSending(false);
    };

    return (
        <div className="student-form-container">
            <button onClick={onBack} className="back-button">&larr; 返回选择试卷</button>
            <h2>为试卷: "{paper.paperName}" 添加考生</h2>
            
            {students.map((student, index) => (
                <div key={student.id} className="student-input-row">
                    <span>考生 {index + 1}</span>
                    <input
                        type="text"
                        placeholder="姓名 (必填)"
                        value={student.name}
                        onChange={(e) => handleInputChange(student.id, 'name', e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="邮箱 (必填)"
                        value={student.email}
                        onChange={(e) => handleInputChange(student.id, 'email', e.target.value)}
                    />
                    <input
                        type="tel"
                        placeholder="电话 (选填)"
                        value={student.phone}
                        onChange={(e) => handleInputChange(student.id, 'phone', e.target.value)}
                    />
                    {students.length > 1 && (
                        <button onClick={() => handleRemoveStudent(student.id)} className="remove-button">
                            移除
                        </button>
                    )}
                    {statuses[student.id] && <span className="status-message">{statuses[student.id]}</span>}
                </div>
            ))}

            <div className="form-actions">
                <button onClick={handleAddStudent} className="add-button">
                    + 添加另一位考生
                </button>
                <button onClick={handleSubmit} className="send-all-button" disabled={isSending}>
                    {isSending ? '正在发送...' : '全部发送'}
                </button>
            </div>
        </div>
    );
};

export default StudentForm;