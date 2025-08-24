// src/pages/CandidatesPage.js
import React from 'react';
import CandidatesTable from '../components/CandidatesTable'; // 我们将复用包含完整逻辑的表格组件

const CandidatesPage = () => {
    return (
        <div className="page-container">
            {/* 这里的 isDetailsPage prop 是关键，它会告诉组件显示所有列 */}
            <CandidatesTable isDetailsPage={true} />
        </div>
    );
};

export default CandidatesPage;