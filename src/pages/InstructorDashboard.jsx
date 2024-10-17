// InstructorDashBoard.js
import React from 'react';
import QuizList from '../blocks/QuizList';
import Box from '@mui/material/Box';
import Dashboard from '../layouts/Dashboard/Dashboard';

const InstructorDashBoard = () => {
  return (
    <Dashboard>
      <Box sx={{ flexGrow: 1, padding: '25px' }}>
        <QuizList />
      </Box>
    </Dashboard>
  );
};

export default InstructorDashBoard;
