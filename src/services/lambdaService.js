import { api, callWithFreshToken } from './apiService';

const LAMBDA_TIMEOUT = 30_000;

export const createQuiz = (quizSettings, recordingId) =>
  callWithFreshToken(() =>
    api.post(
      'https://jtsw0t0x32.execute-api.us-west-2.amazonaws.com/Prod/create_quiz_from_transcript',
      { ...quizSettings, recording_id: recordingId },
      { timeout: LAMBDA_TIMEOUT }
    )
  );

export const generateSummary = (recordingId) =>
  callWithFreshToken(() =>
    api.post(
      'https://6y2dyfv9k1.execute-api.us-west-2.amazonaws.com/Prod/create_summary_from_transcript',
      { recording_id: recordingId },
      { timeout: LAMBDA_TIMEOUT }
    )
  );
