import { Button, Container, Grid, TextField } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConnectionState, WebSocketClient } from '../WebSocketClient';

const JoinQuiz = () => {
  const [quizCode, setQuizCode] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const clientRef = useRef(null);

  const handleIncomingMessage = (data) => {
    console.log(data);
    if (data.type === 'success') {
      console.log('Quiz joined successfully', data);
      localStorage.setItem('student_id', data.student_id);
      localStorage.setItem('username', username);
      navigate(`/student/${quizCode}`);
    } else {
      alert('Failed to join quiz: ' + (data.message || 'Unknown error'));
    }
  };

  const establishConnection = (code) => {
    if (clientRef.current) {
      clientRef.current.close();
    }

    const options = {
      reconnect: true,
      debug: true,
    };
    const newClient = new WebSocketClient(`student/join/${code}/`, handleIncomingMessage, options);

    clientRef.current = newClient;

    return newClient;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      setQuizCode(code);
      establishConnection(code);
    }

    return () => {
      if (clientRef.current) clientRef.current.close();
    };
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!quizCode || !username) {
      alert('Please enter both a quiz code and a name.');
      return;
    }

    try {
      if (!clientRef.current || clientRef.current.getState() !== ConnectionState.OPEN) {
        const client = establishConnection(quizCode);
        setTimeout(() => {
          if (client.getState() === ConnectionState.OPEN) {
            client.send({ type: 'join', username });
          } else {
            alert('Connection failed. Please try again.');
          }
        }, 500);
      } else {
        clientRef.current.send({ type: 'join', username });
      }
    } catch (error) {
      alert('Failed to connect. Check your quiz code.');
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
              onChange={(e) => setQuizCode(e.target.value)}
              margin="normal"
              InputLabelProps={{ shrink: !!quizCode }}
            />
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
