import React, { useEffect, useState, useCallback } from 'react';
import { Typography, Button, Box } from '@mui/material';
import Navbar from '../blocks/Navbar';
import QuizComponent from '../blocks/QuizComponent';
import { useParams } from 'react-router-dom';
import QuizEndView from './QuizEndView';
import useWebSocket from 'react-use-websocket';
import { Topbar } from '../layouts/Main/components';
import Container from '../components/Container';

const InstructorQuestionView = () => {
  const [currentQuestion, setCurrentQuestion] = useState(undefined);
  const [quizEnded, setQuizEnded] = useState(false);
  const { code } = useParams();
  const [resetTimer, setResetTimer] = useState(false);
  const [responseData, setResponseData] = useState({});
  const [settings, setSettings] = useState({});
  const [userCount, setUserCount] = useState(0);

  const handleIncomingMessage = useCallback(
    (event) => {
      const data = JSON.parse(event.data);
      console.log('Received data:', data);

      if (data.type === 'next_question' || data.type === 'current_question') {
        setCurrentQuestion(data.question);
        setResetTimer((prev) => !prev); // Toggle to reset the timer
      } else if (data.type === 'quiz_ended') {
        setQuizEnded(true);
        setCurrentQuestion(null);
      } else if (data.type === 'update_answers') {
        console.log('Response data:', data.data);
        setResponseData(data.data);
      } else if (data.type === 'settings') {
        setSettings(data.settings);
        setUserCount(data.user_count);
      }
    },
    [setCurrentQuestion, setResetTimer, setResponseData, setSettings, setUserCount]
  );

  const { sendMessage } = useWebSocket(`wss://api.edukona.com/ws/quiz-session-instructor/${code}/`, {
    onMessage: handleIncomingMessage,
    onOpen: () => console.log('WebSocket connected'),
    onClose: () => console.log('WebSocket disconnected'),
    onError: (event) => console.error('WebSocket error', event),
  });

  const handleNextQuestion = useCallback(() => {
    setResponseData({});
    sendMessage(JSON.stringify({ type: 'next_question' }));
  }, [sendMessage]);

  const onTimerEnd = useCallback(() => {
    // Handle what happens when the timer ends
  }, []);

  useEffect(() => {
    handleNextQuestion();
  }, [handleNextQuestion]);

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Container maxWidth={1} paddingY={{ xs: 1, sm: 1.5 }}>
        <Topbar />
      </Container>
      <Box flexGrow={1} width="100%">
        {quizEnded ? (
          <QuizEndView />
        ) : currentQuestion ? (
          <QuizComponent
            userCount={userCount}
            liveBarChart={settings['live_bar_chart']}
            question={currentQuestion}
            code={code}
            responseData={responseData}
            sendMessage={sendMessage}
            quizEnded={quizEnded}
            timerEnabled={settings['timer']}
            timerDuration={currentQuestion.duration}
            resetTimer={resetTimer}
            onTimerEnd={onTimerEnd}
          />
        ) : (
          <Typography>Loading question...</Typography>
        )}
      </Box>
      {!quizEnded && currentQuestion && (
        <Box textAlign="right" p={2}>
          <Button variant="contained" color="primary" onClick={handleNextQuestion}>
            Next Question
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default InstructorQuestionView;
