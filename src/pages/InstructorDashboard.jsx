// InstructorDashBoard.js
import React from 'react';
import QuizList from '../blocks/QuizList';
import Box from '@mui/material/Box';
import { Main } from '../layouts';

const InstructorDashBoard = () => {
  return (
    <Main>
      <Box sx={{ flexGrow: 1, padding: '25px' }}>
        <QuizList />
      </Box>
    </Main>
  );
};

export default InstructorDashBoard;
