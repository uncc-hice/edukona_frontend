import axios from 'axios';
import { refreshAccessToken } from './apiService';

const token = localStorage.getItem('token');
const jwtAccessToken = localStorage.getItem('accessToken');

const getAuthHeader = () => {
  if (jwtAccessToken !== null) {
    return `Bearer ${jwtAccessToken}`;
  } else if (token !== null) {
    return `Token ${token}`;
  } else {
    return '';
  }
};

const topupTokenAndRun = (promise) => {
  const refreshToken = localStorage.getItem('refreshToken');
  return refreshAccessToken(refreshToken)
    .then(() => {
      console.log('Token refreshed');
      return promise;
    })
    .catch((err) => {
      console.error(`Could not refresh token: ${err}`);
      return;
    });
};

const createQuizPromise = (quizSettings, recordingId) =>
  axios.post(
    'https://jtsw0t0x32.execute-api.us-west-2.amazonaws.com/Prod/create_quiz_from_transcript',
    { ...quizSettings, recording_id: recordingId },
    {
      headers: {
        Authorization: getAuthHeader(),
        'Content-Type': 'application/json',
      },
    }
  );

export const createQuiz = (quizSettings, recordingId) => topupTokenAndRun(createQuizPromise(quizSettings, recordingId));

export const generateSummaryPromise = (recordingId) =>
  axios.post(
    'https://6y2dyfv9k1.execute-api.us-west-2.amazonaws.com/Prod/create_summary_from_transcript',
    { recording_id: recordingId },
    {
      headers: {
        Authorization: getAuthHeader(),
        'Content-Type': 'application/json',
      },
    }
  );

export const generateSummary = (recordingId) => topupTokenAndRun(generateSummaryPromise(recordingId));
