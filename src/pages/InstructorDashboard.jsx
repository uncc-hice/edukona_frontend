import React from 'react';
import Navbar from '../blocks/Navbar';
import QuizList from "../blocks/QuizList";
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import QuizIcon from '@mui/icons-material/Quiz';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';

const InstructorDashBoard = () => {

  let navigate = useNavigate();

  const handleCreateQuiz = () => {
    navigate('/create-quiz')
  };

  const handleNavigateToRecordings = () => {
    navigate('/recordings')
  };

  return (<div>
    <Navbar/>
    <h1 style={{ textAlign: 'Left', margin: '20px' }}>Your Quizzes</h1>
    <QuizList/>
    <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', marginTop: '20px' }}>
      <Link to="/your-sessions">
        <Button startIcon={<MeetingRoomIcon />} variant="outlined" color="primary" size="large" style={{ marginBottom: '10px' }}>
          Your Sessions
        </Button>
      </Link>
      <Button startIcon={<QuizIcon />} variant="outlined" color="primary" size="large" style={{ marginBottom: '10px' }}
              onClick={handleCreateQuiz}>
        Create New Quiz
      </Button>
      <Button startIcon={<RecordVoiceOverIcon />} variant="outlined" color="primary" size="large"
              onClick={handleNavigateToRecordings}>
        Go to Recordings
      </Button>
    </Box>
  </div>);
};

export default InstructorDashBoard;