import axios from 'axios';

const token = localStorage.getItem('token');

export const createQuiz = (quizSettings, recordingId) =>
  axios.post(
    'https://jtsw0t0x32.execute-api.us-west-2.amazonaws.com/Prod/create_quiz_from_transcript',
    { ...quizSettings, recording_id: recordingId },
    {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

export const generateSummary = (recordingId) =>
  axios.post(
    'https://6y2dyfv9k1.execute-api.us-west-2.amazonaws.com/Prod/create_summary_from_transcript',
    { recording_id: recordingId },
    {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
