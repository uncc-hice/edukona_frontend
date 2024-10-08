import { Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const QuizListRow = ({ quiz, onUpdate }) => {
  const token = useRef(localStorage.getItem('token'));
  const [sessionsOpen, setSessionsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const sessionsCache = useRef(null);
  const [sessions, setSessions] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionModalOpen, setSessionModalOpen] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const createdAt = useRef(
    new Date(quiz.created_at).toLocaleString('en-us', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })
  );

  const fetchSessions = () =>
    axios
      .get(`https://api.edukona.com/quiz/${quiz.id}/sessions`, {
        headers: {
          Authorization: `Token ${token.current}`,
        },
      })
      .then((res) => {
        sessionsCache.current = res.data.quiz_sessions;
        setSessions(res.data.quiz_sessions);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));

  const handleViewSessions = () => {
    if (sessionsOpen === true) {
      setSessionsOpen(false);
      return;
    }

    setSessionsOpen(true);
    if (!sessionsCache.current) {
      setLoading(true);
      fetchSessions();
    } else {
      setSessions(sessionsCache.current);
    }
  };

  const handleSessionModalOpen = (sessionCode) => {
    setSelectedSession(sessionCode);
    setSessionModalOpen(true);
  };

  const deleteSession = (sessionCode) => {
    toast
      .promise(
        axios.delete(`https://api.edukona.com/quiz-session-delete/${sessionCode}`, {
          headers: {
            Authorization: `Token ${token.current}`,
          },
        }),
        {
          pending: 'Deleting session',
          success: 'Succesfully deleted session',
          error: 'Failed to delete session',
        }
      )
      .then(() => fetchSessions());
    setSessionModalOpen(false);
  };

  const startQuiz = async (quizId) => {
    if (!token) {
      console.log('No token found');
      return;
    }
    try {
      const response = await axios.post(
        'https://api.edukona.com/quiz-session/',
        {
          quiz_id: quizId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token.current}`,
          },
        }
      );

      // Assuming the response contains a session code in the format: { code: 'someCode' }
      const sessionCode = response.data.code;

      if (!(response.status === 400)) {
        navigate(`/session/${sessionCode}`);
      }

      // Example of using URL parameters
    } catch (error) {
      console.error('Error starting the quiz:', error);
      // Handle error (e.g., showing an error message to the user)
    }
  };

  const viewQuestions = (quizId) => {
    navigate(`/quiz/${quizId}/edit`);
  };

  const settings = (quizId) => {
    navigate(`/quiz/${quizId}/settings`);
  };

  const deleteQuiz = async () => {
    setOpen(false);
    try {
      const response = await axios.delete(`https://api.edukona.com/quiz/${quiz.id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token.current}`,
        },
      });

      if (response.status === 200) {
        toast.success('Quiz successfully deleted!', {
          icon: '🗑️',
        });
        onUpdate();
      }
    } catch (error) {
      console.error('An error occurred while deleting the quiz:', error.message);
    }
  };

  console.log(quiz);
  return (
    <React.Fragment>
      <TableRow key={quiz.id}>
        <TableCell>{quiz.title}</TableCell>
        <TableCell>{createdAt.current}</TableCell>
        <TableCell>
          <Button variant="contained" color="primary" onClick={handleViewSessions}>
            {sessionsOpen ? `Close Sessions (${quiz.num_sessions})` : `View Sessions (${quiz.num_sessions})`}
          </Button>
        </TableCell>
        <TableCell>
          <Button variant="contained" color="primary" onClick={() => viewQuestions(quiz.id)}>
            View Questions ({quiz.num_questions})
          </Button>
        </TableCell>
        <TableCell>
          <Button variant="contained" color="primary" onClick={() => settings(quiz.id)}>
            Edit Settings
          </Button>
        </TableCell>
        <TableCell>
          <Button
            variant="contained"
            color="primary"
            onClick={() => startQuiz(quiz.id)} // Add onClick event handler to call startQuiz
          >
            Start Quiz
          </Button>
        </TableCell>
        <TableCell>
          <Button variant="Text" onClick={() => setOpen(true)}>
            <Delete color={'action'} />
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingTop: 0, paddingBottom: 0 }} colSpan={6}>
          <Collapse in={sessionsOpen} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Typography variant="h6" color={'error'} textAlign="center">
                  `{error.toString()}`
                </Typography>
              ) : !sessions || sessions.length <= 0 ? (
                <Typography variant="h6" textAlign="center">
                  No Sessions for {quiz.title}
                </Typography>
              ) : (
                <React.Fragment>
                  <Table size={'small'} aria-label={'sessions'}>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ textAlign: 'center' }}>Start Time</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>End Time</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    {sessions &&
                      sessions.map((session) => (
                        <TableRow>
                          <TableCell style={{ textAlign: 'center' }}>
                            {new Date(session.start_time).toLocaleString()}
                          </TableCell>
                          <TableCell style={{ textAlign: 'center' }}>
                            {new Date(session.end_time).toLocaleString()}
                          </TableCell>
                          <TableCell style={{ textAlign: 'center' }}>
                            <Box flex flexDirection={'row'}>
                              <Link to={`/results/${session.code}`}>
                                <Button variant="contained" color="primary">
                                  View Results
                                </Button>
                              </Link>
                              <Button variant="text" sx={{ marginLeft: '5px' }}>
                                <Delete color="action" onClick={() => handleSessionModalOpen(session.code)} />
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                  </Table>
                </React.Fragment>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Confirm Quiz Deletion'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Are you sure you want to delete ${quiz.title}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteQuiz} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={sessionModalOpen}
        onClose={() => setSessionModalOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Confirm Session Deletion'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Are you sure you want the session? This will also delete all associated student submissions.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSessionModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => deleteSession(selectedSession)} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default QuizListRow;
