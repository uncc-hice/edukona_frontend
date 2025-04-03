import { Button, Container, Grid, TextField } from '@mui/material';
import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJoinQuizWebSocket } from '../services/apiService';

// Define interfaces for our data types
interface WebSocketMessage {
  type: string;
  message?: string;
  student_id?: string;
}

interface WebSocketHookReturn {
  sendMessage: (message: string) => void;
  readyState: number;
}

const JoinQuiz = (): JSX.Element => {
  const [quizCode, setQuizCode] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) setQuizCode(code);
  }, []);

  const handleIncomingMessage = (event: MessageEvent): void => {
    const data: WebSocketMessage = JSON.parse(event.data);
    if (data.type === 'success') {
      console.log('Quiz joined successfully', data);
      if (data.student_id) {
        localStorage.setItem('sid', data.student_id);
        navigate(`/student/${quizCode}`);
      }
    } else {
      alert('Failed to join quiz: ' + (data.message || 'Unknown error'));
    }
  };

  // Setup WebSocket connection
  const { sendMessage, readyState }: WebSocketHookReturn = useJoinQuizWebSocket(quizCode, handleIncomingMessage);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!quizCode) {
      alert('Please enter a quiz code.');
      return;
    }
    if (readyState === WebSocket.OPEN) {
      sendMessage(JSON.stringify({ type: 'join_as_user' }));
    } else {
      console.log('WebSocket is not open. ReadyState:', readyState);
      alert('Connection problem: Unable to join quiz.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Grid
        container
        spacing={2}
        alignItems="center"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid item xs={12}>
          <form onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Quiz Code"
              variant="outlined"
              value={quizCode}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setQuizCode(e.target.value)}
              margin="normal"
            />
            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
              Join Quiz
            </Button>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
};

export default JoinQuiz;
