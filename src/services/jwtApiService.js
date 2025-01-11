import axios from 'axios';

const accessToken = localStorage.getItem('accessToken');
const base = 'https://api.edukona.com/';

const api = axios.create({
  baseURL: base,
  timeout: 1500,
  headers: { Authorization: `Bearer ${accessToken}` },
});

// Global error handler.
// Can be used for sending data to our logging system in the future
api.interceptors.response.use(
  async (res) => res,
  async (err) => {
    if (err.response && err.response.status === 401) {
      return refreshAccessToken(localStorage.getItem('refreshToken'))
        .then((res) => {
          const request = err.config;
          localStorage.setItem('accessToken', res.data.access);
          localStorage.setItem('refreshToken', res.data.refresh);
          api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
          return api(request);
        })
        .catch((refreshErr) => {
          console.error(refreshErr);
          window.location.href = '/jwt-login';
        });
    }
    return Promise.reject(err);
  }
);

// jwt-related api calls
export const login = (email, password) =>
  api.post('jwt-login/', { email, password }).then((res) => {
    // This is just a little bit of middleware to make sure the tokens get saved to local storage.
    // The logic contained here can be moved later if we feel it's necessary.
    // Save access and refresh tokens to localStorage
    localStorage.setItem('accessToken', res.data.access);
    localStorage.setItem('refreshToken', res.data.refresh);
    localStorage.setItem('user', res.data.user);
    // return the response
    return res;
  });

export const googleAuth = (token) => api.post('auth/jwt-google/', { token });

export const logout = (refreshToken) =>
  api
    .post('jwt-logout/', { refresh: refreshToken })
    .then((res) => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return res;
    })
    .catch((err) => {
      console.error(err);
      return err;
    });

export const refreshAccessToken = (refreshToken) => api.post('jwt-token/refresh/', { refresh: refreshToken });

export const fetchQuizzes = () =>
  api.get('instructor/quizzes/', {
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const updateQuizTitle = (quizId, title) => api.patch(`quiz/${quizId}/update-title/`, { title: title });

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
