import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableContainer, Paper } from '@mui/material';
import axios from 'axios';
import QuizListRow from './QuizListRow';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const token = localStorage.getItem('token');

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('https://api.edukona.com/quiz/', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });

      const data = response.data;
      setQuizzes(data['quizzes']);
    } catch (error) {
      console.error('An error occurred while fetching the quizzes:', error.message);
    }
  };

  const onUpdate = () => {
    fetchQuizzes();
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {quizzes.map((quiz) => (
            <QuizListRow key={quiz.id} quiz={quiz} onUpdate={onUpdate} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default QuizList;
