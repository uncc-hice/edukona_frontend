import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Grid, TextField } from '@mui/material';
import useWebSocket from 'react-use-websocket';

const JoinQuiz = () => {
  const [quizCode, setQuizCode] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuizCode(params.get('code'));
  }, []);

  const handleIncomingMessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'success') {
      console.log('Quiz joined successfully', data);
      localStorage.setItem('sid', data.student_id);
      localStorage.setItem('username', username);
      navigate(`/student/${quizCode}`);
    } else {
      alert('Failed to join quiz: ' + data.message);
    }
  };

  // Setup WebSocket connection
  const { sendMessage, readyState } = useWebSocket(`wss://api.edukona.com/ws/student/join/${quizCode}/`, {
    onMessage: handleIncomingMessage,
    shouldReconnect: (closeEvent) => true,
    onOpen: () => console.log('WebSocket Connected'),
    onClose: () => console.log('WebSocket Disconnected'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!quizCode || !username) {
      alert('Please enter both a quiz code and a name.');
      return;
    }
    if (readyState === WebSocket.OPEN) {
      sendMessage(JSON.stringify({ type: 'join', username: username }));
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
              onChange={(e) => setQuizCode(e.target.value)}
              margin="normal"
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
