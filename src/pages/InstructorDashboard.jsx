import React from 'react';
import Navbar from '../blocks/Navbar';
import QuizList from "../blocks/QuizList";
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const InstructorDashBoard = () => {

  let navigate = useNavigate();

  const handleCreateQuiz = () => {
    navigate('/create-quiz')
  };
  return (<div>
    <Navbar/>
    <h1 style={{ textAlign: 'Left', margin: '20px' }}>Your Quizzes</h1>
    <QuizList/>
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <Link to="/your-sessions">
        <Button variant="contained" color="primary" size="large" style={{ width: '80%', maxWidth: '1000px', marginBottom: '10px' }}>
          Your Sessions
        </Button>
      </Link>
      <Button variant="contained" color="primary" size="large" style={{ width: '80%', maxWidth: '1000px' }}
              onClick={handleCreateQuiz}>
        Create New Quiz
      </Button>
    </div>
  </div>);
};

export default InstructorDashBoard;
