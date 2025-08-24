# Recruitment Management Portal - Frontend (招聘管理系统 - 前端)

这是一个基于 React 构建的现代化招聘管理系统前端界面。该系统为不同角色的用户（如PMO、Vendor）提供了一个管理候选人招聘流程的门户，核心功能包括候选人信息管理、在线考试邀请发送等。此代码库为项目的第一阶段最小可行产品（MVP1）。

---

## ✨ 主要功能 (Features)

- **🔐 安全认证**: 基于JWT (JSON Web Token) 的安全登录认证流程。
- **🎭 角色访问控制 (RBAC)**:
  - 为 **VENDOR** 和 **PMO** 两种角色提供完全隔离的工作区和导航。
  - 使用前端路由守卫保护页面，防止越权访问。
- **📊 仪表盘 (Dashboard)**:
  - **VENDOR Dashboard**: 概览关键统计数据（牛客网余额、待测/进程中人数）、个人账户信息以及候选人列表概览。
  - **PMO Dashboard**: 空白仪表盘，为未来扩展PMO专属统计功能预留空间。
- **👥 候选人管理**:
  - **概览模式 (Dashboard)**: 简洁的候选人列表，包含核心信息（姓名、状态、成绩等），并提供“查看详情”入口。
  - **详情模式 (独立页面)**: 为 VENDOR 和 PMO 提供各自定制化的详细候选人信息表格，支持分页浏览。
- **📝 考试题发送**:
  - 以网格卡片形式展示所有可用的在线试卷。
  - 支持向一个或多个考生批量发送考试邀请。
  - 提供实时的、针对每个考生的发送状态反馈（成功、失败、已存在等）。
- **👤 用户管理 (PMO专属)**:
  - 提供一个独立的注册页面，用于创建拥有不同角色的新用户账号。

---

## 🏗️ 项目架构 (Architecture)

本前端项目采用现代React实践构建，核心架构思想是组件化和关注点分离。

- **组件化 (Component-Based)**: 应用被拆分为一系列独立的、可复用的功能组件（位于 `src/components`）和页面级组件（位于 `src/pages`）。
- **路由 (Routing)**: 使用 `react-router-dom v6` 进行客户端路由管理。通过创建 `RoleBasedGuard` 组件，实现了灵活的路由保护和角色权限校验。
- **状态管理 (State Management)**:
  - **全局状态**: 使用React Context (`AuthContext`) 统一管理用户的认证信息，如Token和角色，贯穿整个应用。
  - **本地状态**: 页面和组件的UI状态及业务数据由 `useState` 和 `useEffect` 进行管理。
- **API层 (Service Layer)**: 所有的后端API请求都被封装在 `src/services/api.js` 中。这一层负责处理HTTP请求、添加认证头、以及统一处理不同格式的API响应和错误，使得业务组件无需关心底层的请求细节。
- **样式 (Styling)**: 使用原生CSS，并通过CSS变量 (`:root`) 定义了一套统一的设计规范（颜色、阴影、圆角），确保了整体视觉风格的一致性和可维护性。布局主要基于 Flexbox 和 Grid。

---

## 🛠️ 技术栈 (Tech Stack)

- **核心框架**: [React 18](https://reactjs.org/)
- **路由**: [React Router DOM v6](https://reactrouter.com/)
- **状态管理**: React Hooks (useState, useEffect, useContext, useCallback)
- **API请求**: Fetch API
- **JWT解析**: [jwt-decode](https://github.com/auth0/jwt-decode)
- **样式**: CSS3 (Flexbox, Grid, CSS Variables)
- **构建工具**: Create React App

---

## 🚀 运行项目 (Getting Started)

### 先决条件

- [Node.js](https://nodejs.org/) (推荐 v16 或更高版本)
- [npm](https://www.npmjs.com/) 或 [yarn](https://yarnpkg.com/)

### 安装与运行

1.  **克隆代码库**
    ```bash
    git clone [your-repository-url]
    cd [your-project-directory]
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **配置后端地址**
    本项目的前端代码期望后端API服务运行在 `http://localhost:8080`。所有API请求都配置在 `src/services/api.js` 文件中的 `BASE_URL` 变量。请确保您的后端服务已在该地址启动并可访问。

4.  **启动开发服务器**
    ```bash
    npm start
    ```
    应用将在 `http://localhost:3000` 启动，并自动在浏览器中打开。

### 测试账号

- **Vendor**: 使用Vendor角色的账号登录，可以看到专属Dashboard和考试发送功能。
- **PMO**: 使用PMO角色的账号登录，可以看到PMO的专属Dashboard、学生详情和用户注册功能。

---

## 📝 API 依赖

本前端项目依赖于后端提供的一系列RESTful API，主要包括：

- `POST /api/auth/login`: 用户登录
- `POST /api/auth/register`: 注册新用户
- `GET /api/account/balance`: 查询账户余额
- `GET /api/account/userInfo`: 查询当前用户信息
- `GET /api/papers`: 获取试卷列表
- `POST /api/send-exam/{paperId}`: 发送考试邀请
- `GET /api/student/info/all`: 获取候选人列表（分页）
- `GET /student/count/testing`: 获取未测试人数
- `GET /student/count/progressing`: 获取进程中人数

---

## 截图 (Screenshots)

*(建议您在此处替换为项目的最终截图)*

| 登录页 | Vendor Dashboard | PMO 详情页 |
| :---: | :---: | :---: |
| ![Login Page](image_62769b.png) | ![Vendor Dashboard](image_4d75b4.png) | *(在此处添加PMO详情页截图)* |