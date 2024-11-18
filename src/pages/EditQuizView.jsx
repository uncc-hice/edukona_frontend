import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Main from '../layouts/Main';
import { CircularProgress, Container, Typography } from '@mui/material';
import EditableQuestion from '../blocks/EditableQuestion';
import { useParams } from 'react-router-dom';

function EditQuizView() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState(null);

  const token = localStorage.getItem('token');

  const onUpdate = () =>
    axios
      .get(`https://api.edukona.com/all-questions/${quizId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => setQuestions(res.data.questions))
      .catch((error) => console.error('Error fetching questions:', error));

  useEffect(() => {
    axios
      .get(`https://api.edukona.com/all-questions/${quizId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => setQuestions(res.data.questions))
      .catch((error) => console.error('Error fetching questions:', error));

    axios
      .get(`https://api.edukona.com/quiz/${quizId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
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
