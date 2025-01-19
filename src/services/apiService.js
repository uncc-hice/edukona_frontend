import axios from 'axios';
import useWebSocket from 'react-use-websocket';

const token = localStorage.getItem('token');
const jwtAccessToken = localStorage.getItem('accessToken');
const base = 'https://api.edukona.com/';

/**
 * This helper function enables us to use the JWT if available or fallback on the session token otherwise.
 * This function should be removed once we have finished migrating to JWT authentication.
 * @returns {string} The value to use for the Authorization header.
 */
const getAuthHeader = () => {
  if (jwtAccessToken !== null) {
    return `Bearer ${jwtAccessToken}`;
  } else if (token !== null) {
    return `Token ${token}`;
  } else {
    return '';
  }
};

const api = axios.create({
  baseURL: base,
  timeout: 1500,
  headers: { Authorization: getAuthHeader() },
});

const refreshAccessToken = (refreshToken) =>
  api.post('jwt-token/refresh/', { refresh: refreshToken }, { headers: { Authorization: '' } }).then((res) => {
    localStorage.setItem('accessToken', res.data.access);
    localStorage.setItem('refreshToken', res.data.refresh);
  });

// Global error handler.
// Can be used for sending data to our logging system in the future
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      if (jwtAccessToken !== null || localStorage.getItem('refreshToken') !== null) {
        return refreshAccessToken(localStorage.getItem('refreshToken'))
          .then(() => {
            const request = err.config;
            request.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
            return api(request);
          })
          .catch((err) => {
            console.error(`Could not refresh token: ${err}`);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/jwt-login';
            return;
          });
      } else {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
    }
    return Promise.reject(err);
  }
);

export const login = (email, password) =>
  api.post('jwt-login/', { email, password }, { headers: { Authorization: '' } });
export const JWTSignUpInstructor = (formData) => api.post('jwt-sign-up-instructor/', formData);
export const googleAuth = (token) => api.post('auth/jwt-google/', { token });
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

const getWebSocketAuth = () => {
  if (jwtAccessToken !== null) {
    return `?jwt=${jwtAccessToken}`;
  } else if (token !== null) {
    return `?token=${token}`;
  } else {
    return '';
  }
};

export const useRecordingWebSocket = (websocketError, handleIncomingMessage) => {
  useWebSocket(`wss://api.edukona.com/ws/recordings/` + getWebSocketAuth(), {
    onOpen: () => console.log('WebSocket connected'),
    onClose: () => console.log('WebSocket disconnected'),
    onError: websocketError,
    onMessage: handleIncomingMessage,
    shouldReconnect: () => true,
  });
};

export const useStudentAnswerWebSocket = (code, handleIncomingMessage) => {
  return useWebSocket(`wss://api.edukona.com/ws/student/join/${code}/`, {
    onMessage: handleIncomingMessage,
    onOpen: () => console.log('WebSocket connected'),
    onClose: () => console.log('WebSocket disconnected'),
    onError: (event) => console.error('WebSocket error', event),
  });
};

export const useQuizSessionWebSocket = (code, handleIncomingMessage) => {
  return useWebSocket(`wss://api.edukona.com/ws/quiz-session-instructor/${code}/`, {
    onOpen: () => console.log('WebSocket connected'),
    onClose: () => console.log('WebSocket disconnected'),
    onError: (event) => console.error('WebSocket error', event),
    onMessage: handleIncomingMessage,
    shouldReconnect: () => true,
  });
};

export const useJoinQuizWebSocket = (code, handleIncomingMessage) => {
  return useWebSocket(`wss://api.edukona.com/ws/student/join/${code}/`, {
    onMessage: handleIncomingMessage,
    onClose: () => console.log('WebSocket Disconnected'),
    onOpen: () => console.log('WebSocket Connected'),
    shouldReconnect: () => true,
  });
};

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

export const fetchQuizzesByRecording = (recordingId) => api.get(`recordings/${recordingId}/quizzes`);

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

export const submitContactForm = (formData) => api.post('contact-us/', formData);
