import axios from 'axios';
import useWebSocketWithTokenRefresh from '../hooks/useWebSocketWithTokenRefresh';
const token = localStorage.getItem('token');
let jwtAccessToken = localStorage.getItem('accessToken');
const base = 'https://api.edukona.com/';

const verifyAccessToken = async () => {
  if (jwtAccessToken !== null) {
    try {
      await api.post('jwt-token/verify/', { token: jwtAccessToken });
      return true;
    } catch (error) {
      return false;
    }
  } else {
    return false;
  }
};

/**
 * This helper function enables us to use the JWT if available or fallback on the session token otherwise.
 * This function should be removed once we have finished migrating to JWT authentication.
 * @returns {Promise<string>} The value to use for the Authorization header.
 */
const getAuthHeader = async () => {
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
  headers: { Authorization: await getAuthHeader() },
});

export const refreshAccessToken = (refreshToken) =>
  api.post('jwt-token/refresh/', { refresh: refreshToken }, { headers: { Authorization: '' } }).then((res) => {
    localStorage.setItem('accessToken', res.data.access);
    localStorage.setItem('refreshToken', res.data.refresh);
  });

// Ensures the latest access token is used for all requests.
api.interceptors.request.use(
  async (config) => {
    const latestAccessToken = localStorage.getItem('accessToken');
    if (latestAccessToken) {
      config.headers['Authorization'] = `Bearer ${latestAccessToken}`;
    } else if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Global error handler.
// Can be used for sending data to our logging system in the future
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      if (jwtAccessToken !== null || localStorage.getItem('refreshToken') !== null) {
        return refreshAccessToken(localStorage.getItem('refreshToken'))
          .then(() => {
            jwtAccessToken = localStorage.getItem('accessToken');
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
export const requestScoring = (student_id, session_id) => api.post(`score/`, { student_id, session_id });
export const getScore = (student_id, session_id) => api.get(`get-score/${student_id}/${session_id}/`);
export const verifyToken = (token) => api.post('jwt-token/verify/', { token });

const getWebSocketUrl = (path) => {
  const baseUrl = 'wss://api.edukona.com/ws/';
  return baseUrl + path;
};

export const useRecordingWebSocket = (websocketError, handleIncomingMessage) => {
  useWebSocketWithTokenRefresh(getWebSocketUrl('recordings/'), {
    onMessage: handleIncomingMessage,
    shouldReconnect: () => true,
  });
};

export const useStudentAnswerWebSocket = (code, handleIncomingMessage) => {
  return useWebSocketWithTokenRefresh(getWebSocketUrl(`student/join/${code}/`), {
    onMessage: handleIncomingMessage,
    onOpen: () => console.log('WebSocket connected'),
    onClose: () => console.log('WebSocket disconnected'),
    onError: (event) => console.error('WebSocket error', event),
    shouldReconnect: (event) => true,
  });
};

export const useQuizSessionWebSocket = (code, handleIncomingMessage) => {
  return useWebSocketWithTokenRefresh(getWebSocketUrl(`quiz-session-instructor/${code}/`), {
    onMessage: handleIncomingMessage,
    shouldReconnect: () => true,
  });
};

export const useJoinQuizWebSocket = (code, handleIncomingMessage) => {
  return useWebSocketWithTokenRefresh(getWebSocketUrl(`student/join/${code}/`), {
    onMessage: handleIncomingMessage,
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

export const fetchInstructorCourses = () => api.get(`instructor/get-courses/`);

export const fetchRecordingsByCourse = (course_id) => api.get(`course/${course_id}/get-recordings/`);

export const createCourse = (courseData) => api.post(`instructor/create-course/`, courseData);

export const getTranscript = (recordingId) => api.get(`recordings/${recordingId}/get-transcript`);
