import axios from 'axios';
import useWebSocketWithTokenRefresh from '../hooks/useWebSocketWithTokenRefresh';
import useWebSocket from 'react-use-websocket';

const base = 'https://api.edukona.com/';
let isRefreshing = false;
let failedQueue = [];

// Global error handler.
const handleAuthError = (error = 'Unknown error') => {
  console.error(`Authentication error: ${error}. Invalid or expired token, or refresh failed. Redirecting to login.`);
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  failedQueue = [];
  isRefreshing = false;
  window.location.href = '/login';
};

export const api = axios.create({
  baseURL: base,
  timeout: 1500,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && ![null, ''].includes(config.headers.Authorization)) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    const status = err.response?.status;
    const isTokenRefreshUrl = originalRequest.url.includes('jwt-token/refresh');

    if (status !== 401) return Promise.reject(err);

    // Case 1: Refresh endpoint itself returned 401 - we need to log out
    if (isTokenRefreshUrl) {
      !isRefreshing && handleAuthError('Refresh token endpoint returned 401');
      return Promise.reject(err);
    }

    // Case 2: Request already retried after refresh - don't retry again
    if (originalRequest._retry) {
      console.error(`Request failed after refresh: ${originalRequest.url}`);
      return Promise.reject(err);
    }

    // Case 3: Initial 401 - needs token refresh
    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((error) => Promise.reject(error));
    }

    try {
      isRefreshing = true;
      const token = await refreshTokenFlow();

      originalRequest.headers['Authorization'] = `Bearer ${token}`;
      failedQueue.forEach((promise) => promise.resolve(token));
      failedQueue = [];

      return api(originalRequest);
    } catch (error) {
      failedQueue.forEach((promise) => promise.reject(error));
      failedQueue = [];

      // Only logout on 401 refresh errors
      if (error.response?.status === 401) {
        handleAuthError('Token refresh failed');
      }

      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

// Centralized token refresh function to reduce duplication
const refreshTokenFlow = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await axios.post(
    `${base}jwt-token/refresh/`,
    { refresh: refreshToken },
    { headers: { Authorization: '' } }
  );

  const { access, refresh } = response.data;
  localStorage.setItem('accessToken', access);
  if (refresh) localStorage.setItem('refreshToken', refresh);

  api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
  return access;
};

export const forceTokenRefresh = async () => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  try {
    isRefreshing = true;
    console.log('Attempting token refresh...');

    const newToken = await refreshTokenFlow();

    failedQueue.forEach((promise) => promise.resolve(newToken));
    failedQueue = [];

    return newToken;
  } catch (error) {
    console.error('Token refresh failed:', error.message);
    failedQueue.forEach((promise) => promise.reject(error));
    failedQueue = [];

    handleAuthError('Token refresh failed');
    throw error;
  } finally {
    isRefreshing = false;
  }
};

export const callWithFreshToken = async (apiCallFunction) => {
  try {
    await forceTokenRefresh();
    return await apiCallFunction();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export const login = (email, password) =>
  api.post('jwt-login/', { email, password }, { headers: { Authorization: '' } });
export const JWTSignUpInstructor = (formData) =>
  api.post('jwt-sign-up-instructor/', formData, { headers: { Authorization: '' } });
export const googleAuth = (token, role) =>
  api.post('auth/', role !== null ? { token, role } : { token }, { headers: { Authorization: '' } });
export const logout = (refreshToken) => api.post('jwt-logout/', { refresh: refreshToken });

export const createRecording = (formData) => api.post('recordings/create-recording/', formData);
export const generateTemporaryCredentials = () => api.post('generate-temporary-credentials/');
export const getQuizSessionResponsesCount = (code) => api.get(`quiz-session-responses-count/${code}/`);
export const getStudentsForQuizSession = (code) => api.get(`quiz-session-student-instructor/${code}/`);
export const getQuiz = (quizId) => api.get(`quiz/${quizId}`);
export const getAllQuestions = (quizId) => api.get(`all-questions/${quizId}/`);
export const getQuizSessions = (quizId) => api.get(`quiz/${quizId}/sessions`);
export const deleteQuizSession = (sessionCode) => api.delete(`quiz-session-delete/${sessionCode}`);
export const deleteQuiz = (quizId) => api.delete(`quiz/${quizId}`);
export const deleteQuestion = (questionId) => api.delete(`question/${questionId}`);
export const editQuestion = (questionId, data) => api.put(`question/${questionId}/`, data);
export const requestScoring = (student_id, session_id) => api.post(`score/`, { student_id, session_id });
export const getScore = (student_id, session_id) => api.get(`get-score/${student_id}/${session_id}/`);
export const verifyToken = (token) => api.post('jwt-token/verify/', { token });

export const getWebSocketUrl = (path) => {
  const baseUrl = 'wss://api.edukona.com/ws/';
  return baseUrl + path;
};

export const useRecordingWebSocket = (websocketError, handleIncomingMessage) => {
  useWebSocketWithTokenRefresh(getWebSocketUrl('recordings/'), {
    onMessage: handleIncomingMessage,
    shouldReconnect: () => true,
  });
};

export const fetchQuizzes = () => api.get('instructor/quizzes/');

export const updateQuizTitle = (quizId, title) => api.patch(`quiz/${quizId}/update-title/`, { title: title });

export const getSummary = (summaryId) => api.get(`summary/${summaryId}/get-summary`);

export const startQuizSession = (quizId) => api.post('quiz-session/', { quiz_id: quizId });

export const deleteRecording = (recording) => api.delete(`recordings/${recording}/delete-recording`);

export const updateRecordingTitle = (recordingId, title) =>
  api.patch(`recordings/${recordingId}/update-title/`, { title: title });

export const fetchRecordings = () => api.get(`recordings/`);

export const fetchResults = (code) => api.get(`/quiz-session-results/${code}`);

export const fetchQuizzesByRecording = (recordingId) => api.get(`recordings/${recordingId}/quizzes`);

export const signUpInstructor = (formData) =>
  api.post('sign-up-instructor/', formData, {
    headers: {
      Authorization: null,
      'Content-Type': 'application/json',
    },
  });

export const deleteUser = () => api.delete('delete-user');

export const fetchProfile = () => api.get('profile');

export const fetchQuiz = (id) => api.get(`quiz/${id}`);

export const updateQuiz = (id, data) => api.put(`quiz/${id}`, data);

export const createQuiz = (quizData) => api.post('quiz/create/', quizData);

export const submitContactForm = (formData) => api.post('contact-us/', formData, { headers: { Authorization: '' } });

export const fetchInstructorCourses = () => api.get(`instructor/get-courses/`);

export const fetchRecordingsByCourse = (course_id) => api.get(`course/${course_id}/get-recordings/`);

export const createCourse = (courseData) => api.post(`instructor/create-course/`, courseData);

export const getTranscript = (recordingId) => api.get(`recordings/${recordingId}/get-transcript/`);

export const moveRecordingToCourse = (recording_id, course_id) =>
  api.patch(`recordings/${recording_id}/move-recording-to-course/`, { course_id: course_id });

export const downloadRecording = (recordingId) =>
  api.get(`recordings/${recordingId}/download-recording/`, { responseType: 'blob', timeout: 0 });
