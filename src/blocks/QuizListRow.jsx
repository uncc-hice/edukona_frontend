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
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import QuizListRowMenu from './QuizListRowMenu';

const QuizListRow = ({ quiz, onUpdate }) => {
  const token = useRef(localStorage.getItem('token'));
  const theme = localStorage.getItem('themeMode');
  const [sessionsOpen, setSessionsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const sessionsCache = useRef(null);
  const [sessions, setSessions] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [error, setError] = useState(null);
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
          theme,
        }
      )
      .then(() => {
        onUpdate();
        fetchSessions();
      });
    setSessionModalOpen(false);
  };

  const deleteQuiz = async () => {
    setOpen(false);
    toast.promise(
      axios
        .delete(`https://api.edukona.com/quiz/${quiz.id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token.current}`,
          },
        })
        .then(() => onUpdate()),
      { pending: 'Deleting quiz...', success: 'Quiz successfully deleted!', error: 'Failed to delete quiz' }
    );
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
          <QuizListRowMenu
            title={'Actions'}
            quizId={quiz.id}
            numQuestions={quiz.num_questions}
            deleteQuiz={deleteQuiz}
            token={token}
          />
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
