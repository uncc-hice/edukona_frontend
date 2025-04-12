import { Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import StudentAnswersGrid from '../blocks/StudentAnswersGrid';
import { Topbar } from '../layouts/Main/components';
import { WebSocketClient } from '../WebSocketClient';
import QuizEndView from './QuizEndView';

const StudentAnswerView = () => {
  const [question, setQuestion] = useState(null);
  const { code } = useParams();
  const [quizSession, setQuizSession] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [gradingStatus, setGradingStatus] = useState('not started');
  const [gradingResponse, setGradingResponse] = useState({});
  const webSocketRef = useRef(null);

  const student_id = localStorage.getItem('student_id');

  useEffect(() => {
    const requestGrades = () => {
      webSocketRef.current.send({
        type: 'request_grade',
        id: student_id,
      });
    };

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
        setLoading(true);
      } else if (receivedData.type === 'quiz_started') {
        setLoading(true);
      } else if (receivedData.type === 'question_locked') {
        toast.error('Could not submit answer: Question locked.', { theme });
      } else if (receivedData.message === 'User response created successfully') {
        setIsSubmitted(true);
        setSelectedAnswer(receivedData.selected_answer);
      } else if (receivedData.type === 'grading_started') {
        setGradingStatus('started');
        setLoading(false);
      } else if (receivedData.type === 'grading_completed') {
        setGradingStatus('completed');
        requestGrades();
      } else if (receivedData.type === 'grade') {
        setGradingResponse(receivedData);
      }
    };

    const options = {
      reconnect: true,
      debug: true,
    };
    webSocketRef.current = new WebSocketClient(`student/join/${code}/`, handleIncomingMessage, options);

    // Close connection on unmount
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
  }, [code, student_id]);

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
        <QuizEndView gradingStatus={gradingStatus} gradingResponse={gradingResponse} />
      ) : question && quizSession ? (
        <>
          <StudentAnswersGrid
            question={question}
            sendMessage={webSocketRef.current.send}
            answers={answers}
            code={code}
            isSubmitted={isSubmitted}
            setIsSubmitted={setIsSubmitted}
            quizSession={quizSession}
            selectedAnswer={selectedAnswer}
            setSelectedAnswer={setSelectedAnswer}
          />
        </>
      ) : (
        <>
          <Typography>Unable to load question. Please try again.</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => webSocketRef.current.send({ type: 'next_question' })}
          >
            Refresh
          </Button>
        </>
      )}
    </Box>
  );
};

export default StudentAnswerView;
