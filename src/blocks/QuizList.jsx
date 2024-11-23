import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableContainer, Paper, CircularProgress } from '@mui/material';
import QuizListRow from './QuizListRow';
import { fetchQuizzes } from '../services/apiService';
import { toast } from 'react-toastify';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState(null);

  const onUpdate = () => {
    fetchQuizzes()
      .then((res) => setQuizzes(res.data.quizzes))
      .catch(() => toast.error('Failed to fetch quizzes.'));
  };

  useEffect(() => {
    fetchQuizzes().then((res) => setQuizzes(res.data.quizzes));
  }, []);

  if (quizzes === null) {
    return <CircularProgress />;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {quizzes.length === 0 ? (
            <h1 style={{ textAlign: 'center' }}>No Quizzes</h1>
          ) : (
            quizzes.map((quiz) => <QuizListRow key={quiz.id} quiz={quiz} onUpdate={onUpdate} />)
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default QuizList;
