import axios from 'axios';
import { toast } from 'react-toastify';

const token = localStorage.getItem('token');

const api = axios.create({
  baseURL: 'https://api.edukona.com/',
  timeout: 1500,
  headers: { Authorization: `Token ${token}` },
});

export const fetchQuizzes = () =>
  api
    .get('instructor/quizzes/', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch((e) => {
      toast.error('An error occurred while fetching your quizzes');
      console.error(`Error fetching quizzes: ${e}`);
    });

export const updateQuizTitle = (quizId, title) =>
  api
    .patch(
      `quiz/${quizId}/update-title/`,
      { title: title },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    )
    .catch((e) => {
      toast.error('An error occurred while updating the title');
      console.error(`Error updating title: ${e}`);
    });

export const startQuizSession = (quizId) =>
  api
    .post(
      'quiz-session/',
      {
        quiz_id: quizId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    .catch((e) => {
      toast.error('An error occurred while starting the quiz');
      console.error(`Error starting quiz: ${e}`);
    });
