import axios from 'axios';

const token = localStorage.getItem('token');
const base = 'https://api.edukona.com/';

const api = axios.create({
  baseURL: base,
  timeout: 1500,
  headers: { Authorization: `Token ${token}` },
});

// unauthenticated api
export const defaultApi = axios.create({
  baseURL: base,
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

// jwt-related api calls
export const login = (email, password) => defaultApi.post('jwt-login/', { email, password });
export const googleAuth = (token) => defaultApi.post('auth/jwt-google/', { token });
export const logout = () => api.post('jwt-logout/');

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

export const deleteRecording = (recording) => api.delete(`recordings/${recording}/delete-recording`);

export const updateRecordingTitle = (recordingId, title) =>
  api.patch(`recordings/${recordingId}/update-title/`, { title: title });

export const fetchRecordings = () => api.get(`recordings/`);

export const fetchResults = (code) => api.get(`/quiz-session-results/${code}`);

export const signUpInstructor = (formData) =>
  api.post('sign-up-instructor/', formData, {
    headers: {
      Authorization: null,
      'Content-Type': 'application/json',
    },
  });

export const deleteUser = () => api.delete('delete-user');

export const fetchProfile = () =>
  api.get('profile', {
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const fetchQuiz = (id) => api.get(`quiz/${id}`);

export const updateQuiz = (id, data) => api.put(`quiz/${id}`, data);

export const createQuiz = (quizData) => api.post('quiz/create/', quizData);

export const submitContactForm = (formData) => defaultApi.post('https://api.edukona.com/contact-us/', formData);
