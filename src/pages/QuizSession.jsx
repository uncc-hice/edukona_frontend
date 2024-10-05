import React, { useEffect, useState } from 'react';
import { Typography, Container, Button, Paper } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import StudentGrid from '../blocks/StudentGrid.jsx';
import Navbar from '../blocks/Navbar.jsx';
import useWebSocket from 'react-use-websocket';

const fetchStudents = async (code, token) => {
  console.log('token', token);
  const response = await fetch('https://api.edukona.com/quiz-session-student-instructor/' + code + '/', {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  return response.json();
};

const QuizSession = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      try {
        const data = await fetchStudents(code, token);
        setStudents(data['students']);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [code]);

  const handleIncomingMessage = (event) => {
    const receivedData = JSON.parse(event.data);
    console.log('Received data:', receivedData);
    if (receivedData.type === 'student_joined') {
      setStudents((prevStudents) => [...prevStudents, { username: receivedData.username }]);
    } else if (receivedData.type === 'student_deleted') {
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.username !== receivedData.username)
      );
      console.log(`Deleted student (here): ${receivedData.username}`);
    }
  };

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `wss://api.edukona.com/ws/quiz-session-instructor/${code}/`,
    {
      onOpen: () => console.log('WebSocket connected'),
      onClose: () => console.log('WebSocket disconnected'),
      onError: (event) => console.error('WebSocket error', event),
      onMessage: handleIncomingMessage,
      shouldReconnect: (closeEvent) => true, // Automatically reconnect
    }
  );

  const onDelete = (username) => {
    console.log(`Sending delete for username: ${username}`);
    sendMessage(JSON.stringify({ type: 'delete_student', username: username }));
  };

  const startQuiz = () => {
    sendMessage(JSON.stringify({ type: 'start' }));
    navigate(`/quiz/${code}`);
  };

  return (
    <>
      <Navbar />
      <Container>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '20px',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Code: {code}
          </Typography>
          <Typography variant="h6" style={{ marginLeft: 'auto' }}>
            Students: {students.length}
          </Typography>
        </div>
        <Paper style={{ padding: '20px', marginTop: '20px' }}>
          <StudentGrid students={students} onDelete={onDelete} />
          <Button variant="contained" color="primary" style={{ marginTop: '20px' }} onClick={startQuiz}>
            Start Quiz
          </Button>
        </Paper>
      </Container>
    </>
  );
};

export default QuizSession;
