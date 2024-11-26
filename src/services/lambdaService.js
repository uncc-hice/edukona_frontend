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
