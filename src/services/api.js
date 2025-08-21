// src/services/api.js

const BASE_URL = 'http://localhost:8080';

/**
 * 获取试卷列表
 * @returns {Promise<Array>} 试卷对象数组
 */
export const fetchPapers = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/papers`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
            return result.data || [];
        } else {
            throw new Error(result.message || 'Failed to fetch papers from API');
        }
    } catch (error) {
        console.error("Error fetching papers:", error);
        throw error; // Re-throw the error to be caught by the component
    }
};

/**
 * 发送考试邀请给单个考生
 * @param {number} paperId 试卷ID
 * @param {object} studentData 考生信息 { name, email, phone }
 * @returns {Promise<object>} API响应结果
 */
export const sendExam = async (paperId, studentData) => {
    try {
        const response = await fetch(`${BASE_URL}/api/send-exam/${paperId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentData),
        });
        
        // 不需要检查 response.ok，因为API无论成功失败都返回200和JSON结构
        return await response.json(); 
        
    } catch (error) {
        console.error("Error sending exam:", error);
        // 返回一个符合预期的失败结构
        return {
            success: false,
            message: error.message || 'A network error occurred.'
        };
    }
};