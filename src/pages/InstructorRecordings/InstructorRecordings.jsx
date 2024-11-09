import React, { useEffect, useRef, useState } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import RecordButton from '../../blocks/RecordButton';
import QuizListRow from '../../blocks/QuizListRow';
import useWebSocket from 'react-use-websocket';
import { toast } from 'react-toastify';
import { Delete } from '@mui/icons-material';
import { Main } from '../../layouts';
import { useNavigate } from 'react-router-dom';

const InstructorRecordings = () => {
  const [recordings, setRecordings] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [openDialogue, setOpenDialogue] = useState(false);
  const token = useRef(localStorage.getItem('token'));
  const theme = localStorage.getItem('themeMode');
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    console.log(recordings);
  }, [recordings]);

  const fetchRecordings = () =>
    axios
      .get(`https://api.edukona.com/instructor-recordings/`, {
        headers: {
          Authorization: `Token ${token.current}`,
        },
      })
      .then((res) => setRecordings(res.data.recordings))
      .catch((error) => console.error(error));

  const handleOpenDialogue = (recordingId) => {
    setSelectedRecording(recordingId);
    setOpenDialogue(true);
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

  const handleDeleteRecording = () => {
    axios
      .delete(`https://api.edukona.com/instructor-recordings/${selectedRecording}/delete-recording`, {
        headers: {
          Authorization: `Token ${token.current}`,
        },
      })
      .then((res) =>
        res.status === 200
          ? toast.success('Recording successfully deleted!', { icon: '🗑️', theme })
          : toast.error('Could not delete recording.', { theme })
      )
      .then(() => fetchRecordings())
      .catch((error) => console.error(error));
    setOpenDialogue(false);
  };

  const handleCreateQuiz = (recordingId) => {
    toast
      .promise(
        axios.post(
          'https://jtsw0t0x32.execute-api.us-west-2.amazonaws.com/Prod/create_quiz_from_transcript',
          JSON.stringify({ recording_id: recordingId }),
          {
            headers: {
              Authorization: `Token ${token.current}`,
              'Content-Type': 'application/json',
            },
          }
        ),
        {
          pending: 'Creating quiz',
          success: 'Succesfully created quiz!',
          error: 'Failed to create quiz!',
          theme,
        }
      )
      .then((res) => {
        console.log(res.data);
        startQuiz(res.data.quiz_id);
      })
      .catch((error) => console.error(error));
  };

  const handleIncomingMessage = (event) => {
    const receivedData = JSON.parse(event.data);
    if (receivedData.type === 'transcript_completed') {
      // Update the specific recording by mapping over the recordings
      setRecordings((prevRecordings) =>
        prevRecordings.map((recording) =>
          recording.id === receivedData.recording_id
            ? {
                ...recording,
                transcript: receivedData.transcript_status,
                transcript_url: receivedData.transcript_url,
              }
            : recording
        )
      );
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const websocketError = (event) => {
    console.error('WebSocket error', event);
    setOpen(true);
  };

  // Establish WebSocket connection with the token
  useWebSocket(`wss://api.edukona.com/ws/recordings/?token=${token.current}`, {
    onOpen: () => console.log('WebSocket connected'),
    onClose: () => console.log('WebSocket disconnected'),
    onError: websocketError,
    onMessage: handleIncomingMessage,
    shouldReconnect: (closeEvent) => true, // Automatically reconnect
  });

  useEffect(() => {
    fetchRecordings();
  }, [token]);

  const fetchQuizzes = async (id) => {
    const config = {
      headers: {
        Authorization: `Token ${token.current}`,
      },
    };

    setLoadingQuizzes(true);
    try {
      const response = await axios.get(`https://api.edukona.com/recordings/${id}/quizzes`, config);
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      console.log(quizzes);
      setLoadingQuizzes(false);
    }
  };

  const handleAccordionChange = (recordingId) => (event, isExpanded) => {
    setExpanded(isExpanded ? recordingId : null);
    if (isExpanded) {
      fetchQuizzes(recordingId);
    }
  };

  return (
    <Main>
      <Container sx={{ padding: '40px' }}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            Unable to establish WebSocket connection
          </Alert>
        </Snackbar>
        <RecordButton onUpdate={fetchRecordings} />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '25%' }}>
                  <Typography variant="h6" align="center">
                    Title
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: '25%' }}>
                  <Typography variant="h6" align="center">
                    Uploaded At
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: '25%' }}>
                  <Typography variant="h6" align="center">
                    Transcript Status
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: '25%' }}>
                  <Typography variant="h6" align="center">
                    Actions
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recordings.map((recording) => (
                <TableRow key={recording.id}>
                  <TableCell colSpan={4}>
                    <Accordion expanded={expanded === recording.id} onChange={handleAccordionChange(recording.id)}>
                      <AccordionSummary>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell sx={{ width: '25%' }}>
                                <Button color="primary" onClick={() => fetchQuizzes(recording.id)}>
                                  {recording.title === '' ? recording.id.substr(0, 7) : recording.title}
                                </Button>
                              </TableCell>
                              <TableCell align="center" sx={{ width: '25%' }}>
                                {new Date(recording.uploaded_at).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute: 'numeric',
                                })}
                              </TableCell>
                              <TableCell align="center" sx={{ width: '25%' }}>
                                <Box
                                  component="span"
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    display: 'inline-block',
                                    borderRadius: '50%',
                                    bgcolor: recording.transcript.toLowerCase() === 'completed' ? 'green' : 'red',
                                    marginRight: 1,
                                  }}
                                />
                                {recording.transcript.charAt(0).toUpperCase() + recording.transcript.slice(1)}
                              </TableCell>
                              <TableCell sx={{ width: '25%' }}>
                                <Button onClick={() => handleOpenDialogue(recording.id)}>
                                  <Delete color="action" />
                                </Button>
                                <Button onClick={() => handleCreateQuiz(recording.id)}>Create and Start Quiz</Button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </AccordionSummary>
                      <AccordionDetails>
                        {loadingQuizzes ? (
                          <CircularProgress />
                        ) : quizzes.length === 0 ? (
                          <Typography>No quizzes available</Typography>
                        ) : (
                          <Table>
                            <TableBody>
                              {quizzes.map((quiz) => (
                                <QuizListRow key={quiz.id} quiz={quiz} />
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog
          open={openDialogue}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{'Confirm Deletion'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this recording?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialogue(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteRecording} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Main>
  );
};

export default InstructorRecordings;
