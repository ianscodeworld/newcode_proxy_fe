// src/services/api.js

const BASE_URL = 'http://localhost:8080/api';

const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    window.location.reload();
};

/**
 * 通用的 fetch 函数，用于处理我们自己后端定义的两种主要响应格式：
 * 1. { code, msg, data } (来自 R<T>)
 * 2. { success, message, data }
 * 失败时，它总会抛出一个包含 .status 和 .message 的 Error 对象。
 */
const enhancedFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('jwt_token');
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
        const result = await response.json();

        if (!response.ok || result.success === false || (result.code && result.code !== 200)) {
            const errorMessage = result.message || result.msg || 'An unknown error occurred.';
            const error = new Error(errorMessage);
            error.status = response.status;
            error.data = result.data;
            throw error;
        }
        
        // 成功时返回 data payload
        return result.data;

    } catch (error) {
        if (error.status) { throw error; }
        console.error(`Network or parsing error for ${endpoint}:`, error);
        throw new Error('Network request failed. Please check your connection.');
    }
};


export const loginUser = async (credentials) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    const result = await response.json();
    if (!response.ok || (result.code && result.code !== 200)) {
        throw new Error(result.message || result.msg || 'Login failed');
    }
    return result.data;
};

export const fetchPapers = async () => {
    const paginationObject = await enhancedFetch('/papers');
    return paginationObject?.datas || [];
};

export const sendExam = async (paperId, studentData) => {
     const fullResponse = await fetch(`${BASE_URL}/send-exam/${paperId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify(studentData),
    });
    const result = await fullResponse.json();
     if (!fullResponse.ok || result.success === false) {
        const error = new Error(result.message);
        error.status = fullResponse.status;
        error.data = result.data;
        throw error;
     }
     return result;
};


// ===================================================================
//  !!! 修正：为 fetchStudents 恢复独立的、正确的处理逻辑 !!!
// ===================================================================
export const fetchStudents = async (page = 0, size = 10) => {
    const token = localStorage.getItem('jwt_token');
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${BASE_URL}/student/info/all?page=${page}&size=${size}`, { headers });

        if (!response.ok) {
            const result = await response.json().catch(() => null);
            const error = new Error(result?.message || `HTTP error ${response.status}`);
            error.status = response.status;
            error.data = result?.data;
            throw error;
        }

        // 成功时，直接返回API响应的整个分页对象
        return await response.json(); 

    } catch (error) {
        console.error(`API call to /student/info/all failed:`, error);
        throw error;
    }
};


export const fetchAccountBalance = () => {
    // enhancedFetch 会自动处理认证，并在成功时返回响应中的 'data' 字段
    return enhancedFetch('/account/balance');
};

/**
 * 获取尚未完成测试的人数
 */
export const fetchUntestedCount = () => {
    return enhancedFetch('/student/count/testing');
};

/**
 * 获取流程中（未结束）的总人数
 */
export const fetchProgressingCount = () => {
    return enhancedFetch('/student/count/progressing');
};

/**
 * 获取当前已认证用户的信息
 */
export const fetchUserInfo = () => {
    return enhancedFetch('/account/userInfo'); 
};

/**
 * 注册一个新用户
 * @param {object} userData - 包含 username, password, apiKey, token, company, role 的对象
 * @returns {Promise<object>} 成功或失败的响应
 */
export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const result = await response.json();

        if (!response.ok) {
            // 后端会在 400/409 等情况下返回包含 message 的 JSON
            throw new Error(result.message || `HTTP error ${response.status}`);
        }

        return result; // 返回成功信息，例如 { success: true, message: "..." }
    } catch (error) {
        console.error("Error during registration:", error);
        throw error; // 将错误抛出给组件处理
    }
};