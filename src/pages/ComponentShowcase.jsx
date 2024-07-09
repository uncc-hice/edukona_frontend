import React from 'react';
import Navbar from "../Navbar";
import SmallButton from "../SmallButton";
import QuizList from "../QuizList";

const ComponentShowcase = () => {
    const handleButtonClick = () => {
    console.log('Button clicked!');
  };
    const quizzes = [
    { name: 'Quiz 1', id: 1 },
    { name: 'Quiz 2', id: 2 },
    { name: 'Quiz 3', id: 3 },
  ];

  return (
    <div>
      <Navbar />
        <SmallButton label="Click me" onClick={handleButtonClick} />
        <QuizList quizzes={quizzes} />
    </div>
  );
};

export default ComponentShowcase;