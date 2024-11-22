import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import StudentAnswersGrid from '../blocks/StudentAnswersGrid';
import QuizEndView from './QuizEndView';
import useWebSocket from 'react-use-websocket'; // Adjust the import path as needed
import { Store } from 'react-notifications-component';
import { Topbar } from '../layouts/Main/components';
import { toast } from 'react-toastify';

const StudentAnswerView = () => {
  const [question, setQuestion] = useState(null);
  const { code } = useParams();
  const [quizSession, setQuizSession] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [skipPowerUp, setSkipPowerUp] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [skipped, setSkipped] = useState([]);

  let url = `wss://api.edukona.com/ws/student/join/${code}/`;
  const sid = localStorage.getItem('sid');

  const handleIncomingMessage = (event) => {
    const theme = localStorage.getItem('themeMode');
    const receivedData = JSON.parse(event.data);
    if (receivedData.type === 'next_question') {
      setIsSubmitted(false);
      setQuestion(receivedData.question);
      setAnswers(receivedData.order);
      setQuizSession(receivedData.quiz_session);
      setLoading(false); // Stop loading when the question is received
      setSelectedAnswer('');
    } else if (receivedData.type === 'quiz_ended') {
      setQuizEnded(true);
      setLoading(false);
    } else if (receivedData.type === 'quiz_started') {
      setLoading(true);
    } else if (receivedData.type === 'skip_power_up_granted') {
      setSkipPowerUp(true);
      Store.addNotification({
        title: 'Power Up Granted',
        message: "You've been granted the SKIP power up.",
        type: 'success',
        insert: 'top',
        container: 'top-right',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
    } else if (receivedData.type === 'skip_power_up_used') {
      setSkipped([...skipped, question.id]);
      setSkipPowerUp(false);
      setIsSubmitted(true);
      Store.addNotification({
        title: 'Question Skipped',
        message: 'You have skipped the current question.',
        type: 'success',
        insert: 'top',
        container: 'top-right',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
    } else if (receivedData.type === 'question_locked') {
      toast.error('Could not submit answer: Question locked.', { theme });
    } else if (receivedData.message === 'User response created successfully') {
      setIsSubmitted(true);
      setSelectedAnswer(receivedData.selected_answer);
    }
  };

  const { sendMessage } = useWebSocket(url, {
    onMessage: handleIncomingMessage,
    onOpen: () => console.log('WebSocket connected'),
    onClose: () => console.log('WebSocket disconnected'),
    onError: (event) => console.error('WebSocket error', event),
  });

  const handleSkipQuestion = () => {
    console.log('Skipping question:', question.id);
    console.log('Data Sent', {
      type: 'skip_question',
      data: {
        student: { id: sid },
        quiz_session_code: code,
        question_id: question.id,
      },
    });

    sendMessage(
      JSON.stringify({
        type: 'skip_question',
        data: {
          student: { id: sid },
          quiz_session_code: code,
          question_id: question.id,
        },
      })
    );
  };

  return (
    <Box marginX={'5px'}>
      <Container maxWidth={1} paddingY={{ xs: 1, sm: 1.5 }}>
        <Topbar />
      </Container>
      {loading ? (
        <Box display="flex" flexDirection={'column'} justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
          <Typography variant="h6">Waiting for instructor to start the quiz.</Typography>
        </Box>
      ) : quizEnded ? (
        <QuizEndView />
      ) : question && quizSession ? (
        <>
          <StudentAnswersGrid
            question={question}
            sendMessage={sendMessage}
            answers={answers}
            code={code}
            isSubmitted={isSubmitted}
            setIsSubmitted={setIsSubmitted}
            quizSession={quizSession}
            selectedAnswer={selectedAnswer}
            setSelectedAnswer={setSelectedAnswer}
          />
          <Box textAlign="right" p={2}>
            {skipPowerUp && !isSubmitted && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSkipQuestion}
                style={{ marginRight: '10px' }}
              >
                Skip Question
              </Button>
            )}
          </Box>
        </>
      ) : (
        <>
          <Typography>Unable to load question. Please try again.</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => sendMessage(JSON.stringify({ type: 'next_question' }))}
          >
            Refresh
          </Button>
        </>
      )}
    </Box>
  );
};

export default StudentAnswerView;
