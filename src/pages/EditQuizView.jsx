import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Main from '../layouts/Main';
import { CircularProgress, Container, Typography } from '@mui/material';
import EditableQuestion from '../blocks/EditableQuestion';
import { useParams } from 'react-router-dom';
import { getQuiz, getAllQuestions } from '../services/apiService';

function EditQuizView() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState(null);

  const token = localStorage.getItem('token');

  const onUpdate = () =>
    getAllQuestions(quizId)
      .then((res) => setQuestions(res.data.questions))
      .catch((error) => console.error('Error fetching questions:', error));

  useEffect(() => {
    getAllQuestions(quizId)
      .then((res) => setQuestions(res.data.questions))
      .catch((error) => console.error('Error fetching questions:', error));

    getQuiz(quizId)
      .then((res) => setQuiz(res.data.quiz))
      .catch((error) => console.error('Error fetching quiz:', error));
  }, [quizId, token]);

  return (
    <Main>
      <Container>
        {questions === null || quiz === null ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant={'h4'}>{quiz.title}</Typography>
            {questions.map((question, idx) => (
              <EditableQuestion question={question} token={token} onUpdate={onUpdate} key={idx} />
            ))}
          </>
        )}
      </Container>
    </Main>
  );
}

export default EditQuizView;
