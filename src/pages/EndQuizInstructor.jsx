// EndQuizInstructor.jsx
import React from 'react';
import QuizResults from '../QuizResults';

// Arbitrary data for demonstration (replace or fetch from an API in real use)
const mockResults = [
  { studentName: 'Alice Johnson', correct: 8, total: 10 },
  { studentName: 'Bob Smith', correct: 6, total: 10 },
  { studentName: 'Charlie Davis', correct: 9, total: 10 },
  { studentName: 'Dana Lee', correct: 7, total: 10 },
];

const EndQuizInstructor = () => {
  return (
    <div>
      <h2>Quiz Results Overview</h2>
      <QuizResults results={mockResults} />
    </div>
  );
};

export default EndQuizInstructor;
