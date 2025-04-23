import { Button, Container, Grid, Paper, Typography } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { QRCode } from 'react-qr-code';
import { useNavigate, useParams } from 'react-router-dom';
import StudentGrid from '../blocks/StudentGrid.jsx';
import Main from '../layouts/Main';
import { getStudentsForQuizSession, useQuizSessionWebSocket } from '../services/apiService.js';
import { WebSocketClient } from '../WebSocketClient';

const fetchStudents = async (code) => {
  const response = await getStudentsForQuizSession(code);
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  return response.json();
};

const QuizSession = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const clientRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStudents(code);
        setStudents(data['students'] || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [code]);

  const handleIncomingMessage = (event) => {
    const { type, student_id, username } = JSON.parse(event.data);

    if (type === 'student_joined' && student_id) {
      setStudents((prev) => (prev.some((s) => s.id === student_id) ? prev : [...prev, { id: student_id, username }]));
    } else if (type === 'student_deleted') {
      setStudents((prev) => prev.filter((s) => s.id !== student_id));
    }
  };

  useEffect(() => {
    const options = { reconnect: true, debug: true };
    clientRef.current = new WebSocketClient(`quiz-session-instructor/${code}/`, handleIncomingMessage, options);

    return () => {
      if (clientRef.current) {
        clientRef.current.close();
      }
    };
  }, [code]);

  const onDelete = (studentId) => {
    console.log(`Sending delete for student ID: ${studentId}`);
    if (clientRef.current) {
      clientRef.current.send({ type: 'delete_student', student_id: studentId });
    }
  };

  const startQuiz = () => {
    if (clientRef.current) {
      clientRef.current.send({ type: 'start' });
    }
    navigate(`/quiz/${code}`);
  };

  return (
    <Main>
      <Container>
        <Grid container width={'100%'} columnSpacing={5} rowSpacing={1} marginBottom={'20px'}>
          <Grid container item xs={10}>
            <Grid item xs={6} textAlign={'left'}>
              <Typography variant="h4">Code: {code}</Typography>
            </Grid>
            <Grid item xs={6} textAlign={'right'}>
              <Typography variant="h6" style={{ marginLeft: 'auto' }}>
                Students: {students.length}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={10}>
            <Paper style={{ padding: '40px' }}>
              <StudentGrid students={students} onDelete={onDelete} />
              <Button variant="contained" color="primary" style={{ marginTop: '20px' }} onClick={startQuiz}>
                Start Quiz
              </Button>
            </Paper>
          </Grid>
          <Grid container item xs={2}>
            <Grid item xs={12} textAlign={'center'}>
              <QRCode value={`https://edukona.com/join?code=${code}`} size={150} />
              <Typography variant="h6" fontWeight={'bold'}>
                Scan to Join
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Main>
  );
};

export default QuizSession;
