import { Button, Container, Grid, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { QRCode } from 'react-qr-code';
import { useNavigate, useParams } from 'react-router-dom';
import StudentGrid from '../blocks/StudentGrid.jsx';
import Main from '../layouts/Main';
import { getStudentsForQuizSession, useQuizSessionWebSocket } from '../services/apiService.js';

const fetchStudents = async (code, token) => {
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
    if (receivedData.type === 'student_joined') {
      setStudents((prevStudents) => [...prevStudents, { username: receivedData.username }]);
    } else if (receivedData.type === 'student_deleted') {
      setStudents((prevStudents) => prevStudents.filter((student) => student.username !== receivedData.username));
      console.log(`Deleted student (here): ${receivedData.username}`);
    }
  };

  const { sendMessage } = useQuizSessionWebSocket(code, handleIncomingMessage);

  const onDelete = (username) => {
    console.log(`Sending delete for username: ${username}`);
    sendMessage(JSON.stringify({ type: 'delete_student', username: username }));
  };

  const startQuiz = () => {
    sendMessage(JSON.stringify({ type: 'start' }));
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
