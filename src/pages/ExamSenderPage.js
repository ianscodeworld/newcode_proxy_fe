// src/pages/ExamSenderPage.js
import React, { useState } from 'react';
import PaperList from '../components/PaperList';
import StudentForm from '../components/StudentForm';

const ExamSenderPage = () => {
    const [selectedPaper, setSelectedPaper] = useState(null);

    const handleSelectPaper = (paper) => {
        setSelectedPaper(paper);
    };

    const handleBackToSelection = () => {
        setSelectedPaper(null);
    };

    return (
        <div className="page-container">
            {!selectedPaper ? (
                <PaperList onSelectPaper={handleSelectPaper} />
            ) : (
                <StudentForm paper={selectedPaper} onBack={handleBackToSelection} />
            )}
        </div>
    );
};

export default ExamSenderPage;