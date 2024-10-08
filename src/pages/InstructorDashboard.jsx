// InstructorDashBoard.js
import React from 'react';
import QuizList from '../blocks/QuizList';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import QuizIcon from '@mui/icons-material/Quiz';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import { Typography, useTheme } from '@mui/material';
import Dashboard from '../layouts/Dashboard/Dashboard';
import Container from '../components/Container';

const InstructorDashBoard = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleCreateQuiz = () => {
    navigate('/create-quiz');
  };

  const handleNavigateToRecordings = () => {
    navigate('/recordings');
  };

  return (
    <Dashboard>
      <Box sx={{ flexGrow: 1, padding: '25px' }}>
        <QuizList />
      </Box>
    </Dashboard>
  );
};

export default InstructorDashBoard;
