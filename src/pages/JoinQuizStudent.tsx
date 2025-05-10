import { Button, Container, Grid, TextField } from '@mui/material';
import { useEffect, useState, FormEvent, ChangeEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConnectionState, Message, WebSocketClient } from '../WebSocketClient';

const JoinQuiz = () => {
  const [quizCode, setQuizCode] = useState<string>('');
  const navigate = useNavigate();
  const clientRef = useRef<WebSocketClient | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) setQuizCode(code);

    const handleIncomingMessage = (data: Message): void => {
      if (data.type === 'success') {
        console.log('Quiz joined successfully', data);
        if (data.student_id) {
          localStorage.setItem('student_id', data.student_id);
          navigate(`/student/${quizCode}`);
        }
      } else {
        alert('Failed to join quiz: ' + (data.message || 'Unknown error'));
      }
    };

    const options = {
      reconnect: true,
    };
    clientRef.current = new WebSocketClient(`student/join/${code}/`, handleIncomingMessage, options);

    return () => {
      if (clientRef.current) clientRef.current.close();
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!quizCode) {
      alert('Please enter a quiz code.');
      return;
    }
    if (clientRef.current?.getState() === ConnectionState.OPEN) {
      clientRef.current.send({ type: 'join_as_user' });
    } else {
      console.log('WebSocket is not open. ReadyState:', clientRef.current?.getState());
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
              InputLabelProps={{ shrink: !!quizCode }}
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
