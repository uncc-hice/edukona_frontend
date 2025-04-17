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
  const shouldAttemptReconnect = useRef(false);

  const student_id = localStorage.getItem('student_id');

  useEffect(() => {
    shouldAttemptReconnect.current = !!student_id;
  }, [student_id]);

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

        // Temporary measure: if there is no order, use an ordering created here
        if (!receivedData.order) {
          const answers = [...receivedData.question['incorrect_answer_list'], receivedData.question['correct_answer']];
          const shuffled = answers.sort(() => 0.5 - Math.random());
          setAnswers(shuffled);
        } else {
          setAnswers(receivedData.order);
        }
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
      } else if (receivedData.type === 'reconnect_success') {
        setLoading(true);
      } else if (receivedData.type === 'reconnect_failed') {
        toast.error('Could not reconnect, please try again.', { theme });
        console.error('Reconnect Failure:', receivedData.message);
      } else if (receivedData.type === 'no_active_question') {
        toast.error('No more questions remaining.');
        console.error('Reconnect Failure: No more questions remaining.');
      }
    };

    const onReconnect = () => {
      webSocketRef.current.send({
        type: 'reconnect',
        student_id: student_id,
      });
    };

    const onInitialOpen = () => {
      if (shouldAttemptReconnect.current) {
        console.log('Attempting to recover session on initial connection');
        webSocketRef.current.send({
          type: 'reconnect',
          student_id: student_id,
        });
        shouldAttemptReconnect.current = false;
      }
    };

    // Use code from URL params or fallback to localStorage
    const quizCode = code || localStorage.getItem('quiz_code');

    if (!quizCode) {
      console.error('No quiz code available from URL or localStorage');
      return;
    }

    const options = {
      reconnect: true,
      debug: true,
      onOpenCallbacks: [onInitialOpen],
      onReconnectCallbacks: [onReconnect],
    };
    webSocketRef.current = new WebSocketClient(`student/join/${quizCode}/`, handleIncomingMessage, options);

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
