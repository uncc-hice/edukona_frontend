import axios from 'axios';

const token = localStorage.getItem('token');

const api = axios.create({
  baseURL: 'https://api.edukona.com/',
  timeout: 1500,
  headers: { Authorization: `Token ${token}` },
});

// Global error handler.
// Can be used for sending data to our logging system in the future
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const fetchQuizzes = () =>
  api.get('instructor/quizzes/', {
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const updateQuizTitle = (quizId, title) =>
  api.patch(
    `quiz/${quizId}/update-title/`,
    { title: title },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

export const getSummary = (summaryId) => api.get(`summary/${summaryId}/get-summary`);

export const startQuizSession = (quizId) =>
  api.post(
    'quiz-session/',
    {
      quiz_id: quizId,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );


export const fetchResults = (code) => api.get(`/quiz-session-results/${code}`);

export const signUpInstructor = (formData) =>
  api
    .post('sign-up-instructor/', formData, {
      headers: {
        Authorization: null,
        'Content-Type': 'application/json',
      },
    })
    .then((res) => localStorage.setItem('token', res.data.token))
    .catch((err) => {
      console.error(`Failed to create account: ${err}`);
      return Promise.reject(err);
    });

export const fetchResults = (code) =>
  api.get(`/quiz-session-results/${code}`).catch((error) => {
    toast.error('An error occured while fetching results');
    console.error('Failed to fetch quiz results: ', error);
  });