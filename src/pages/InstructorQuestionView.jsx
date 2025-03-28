import { Box, Button, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import QuizComponent from '../blocks/QuizComponent';
import Container from '../components/Container';
import { Topbar } from '../layouts/Main/components';
import { useQuizSessionWebSocket } from '../services/apiService';
import Leaderboard from './Leaderboard/Leaderboard';

const InstructorQuestionView = () => {
  const [currentQuestion, setCurrentQuestion] = useState(undefined);
  const [quizEnded, setQuizEnded] = useState(false);
  const { code } = useParams();
  const [resetTimer, setResetTimer] = useState(false);
  const [responseData, setResponseData] = useState({});
  const [quiz, setQuiz] = useState({});
  const [userCount, setUserCount] = useState(0);
  const [grades, setGrades] = useState({});
  const [highlight, setHighlight] = useState(false);

  const handleIncomingMessage = useCallback(
    (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'next_question' || data.type === 'current_question') {
        setHighlight(false);
        setCurrentQuestion(data.question);
        setResetTimer((prev) => !prev); // Toggle to reset the timer
      } else if (data.type === 'quiz_ended') {
        setGrades(data.grades);
        setQuizEnded(true);
        setCurrentQuestion(null);
      } else if (data.type === 'update_answers') {
        setResponseData(data.data);
      } else if (data.type === 'quiz_details') {
        setQuiz(data.quiz);
        setUserCount(data.user_count);
      }
    },
    [setCurrentQuestion, setResetTimer, setResponseData, setQuiz, setUserCount]
  );

  const { sendMessage } = useQuizSessionWebSocket(code, handleIncomingMessage);

  const handleNextQuestion = useCallback(() => {
    setResponseData({});
    sendMessage(JSON.stringify({ type: 'next_question' }));
  }, [sendMessage]);

  // New function to handle skipping the question
  const handleSkipQuestion = useCallback(() => {
    setResponseData({});
    if (currentQuestion && currentQuestion.id) {
      sendMessage(
        JSON.stringify({
          type: 'skip_question',
          question_id: currentQuestion.id,
        })
      );
    }
  }, [sendMessage, currentQuestion]);

  const onTimerEnd = useCallback(() => {
    setTimeout(() => {
      setHighlight(true);
    }, 500);
  }, [setHighlight]);

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
          <Leaderboard grades={grades} />
        ) : currentQuestion ? (
          <QuizComponent
            userCount={userCount}
            liveBarChart={quiz.live_bar_chart}
            question={currentQuestion}
            code={code}
            responseData={responseData}
            sendMessage={sendMessage}
            quizEnded={quizEnded}
            timerEnabled={quiz.timer}
            timerDuration={currentQuestion.duration}
            resetTimer={resetTimer}
            onTimerEnd={onTimerEnd}
            toggleHighlight={highlight}
          />
        ) : (
          <Typography>Loading question...</Typography>
        )}
      </Box>
      {!quizEnded && currentQuestion && (
        <Box textAlign="right" p={2}>
          <Button variant="outlined" color="primary" onClick={handleSkipQuestion} style={{ marginRight: '8px' }}>
            Skip Question
          </Button>
          <Button variant="contained" color="primary" onClick={handleNextQuestion}>
            Next Question
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default InstructorQuestionView;
