// src/App.js

import React, { useState } from 'react';
import PaperList from './components/PaperList';
import StudentForm from './components/StudentForm';
import './App.css';

function App() {
  const [selectedPaper, setSelectedPaper] = useState(null);

  const handleSelectPaper = (paper) => {
    setSelectedPaper(paper);
  };

  const handleBackToSelection = () => {
    setSelectedPaper(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>考试题发送系统</h1>
      </header>
      <main>
        {!selectedPaper ? (
          <PaperList onSelectPaper={handleSelectPaper} />
        ) : (
          <StudentForm paper={selectedPaper} onBack={handleBackToSelection} />
        )}
      </main>
    </div>
  );
}

export default App;