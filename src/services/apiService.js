import axios from 'axios';
import { toast } from 'react-toastify';

const token = localStorage.getItem('token');
const theme = localStorage.getItem('themeMode');

const api = axios.create({
  baseURL: 'https://api.edukona.com/',
  timeout: 1500,
  headers: { Authorization: `Token ${token}` },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(err);
    }
  }
);

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

export const getSummary = (summaryId) =>
  api.get(`summary/${summaryId}/get-summary`).catch((e) => {
    toast.error('An error occured while fetching the summary');
    console.error(`Error fetching summary: ${e}`);
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

export const fetchRecordings = () =>
  api
    .get(`https://api.edukona.com/recordings/`)
    .then((res) => res.data.recordings)
    .catch((error) => {
      console.error(error);
      return [];
    });

export const deleteRecording = (recording) => {
  api
    .delete(`https://api.edukona.com/recordings/${recording}/delete-recording`)
    .then((res) =>
      res.status === 200
        ? toast.success('Recording successfully deleted!', { icon: '🗑️', theme })
        : toast.error('Could not delete recording.', { theme })
    )
    .catch((error) => console.error(error));
};
