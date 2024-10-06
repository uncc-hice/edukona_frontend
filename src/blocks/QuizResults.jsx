import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const QuizResults = ({ results }) => {
  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" component="div" style={{ padding: '20px' }}>
        Quiz Results
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Student Username</TableCell>

            <TableCell align="right">Correct Answers</TableCell>
            <TableCell align="right">Total Questions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((result, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {result.student_username}
              </TableCell>
              <TableCell align="right">{result.correct_answers}</TableCell>
              <TableCell align="right">{result.total_questions}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default QuizResults;
