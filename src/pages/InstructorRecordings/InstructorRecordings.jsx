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
  Slider,
  Grid,
  FormControl,
} from '@mui/material';
import axios from 'axios';
import RecordButton from '../../blocks/RecordButton';
import QuizListRow from '../../blocks/QuizListRow';
import useWebSocket from 'react-use-websocket';
import { toast } from 'react-toastify';
import { Main } from '../../layouts';
import { useNavigate } from 'react-router-dom';
import CustomizedMenus from '../../blocks/CustomizedMenus';
import { fetchRecordings, deleteRecording } from '../../services/apiService';

const InstructorRecordings = () => {
  const [openNewRecording, setOpenNewRecording] = useState(false);
  const [newRecordingDetails, setNewRecordingDetails] = useState({
    recording_id: '',
    num_of_questions: 5,
    question_duration: 30,
  });
  const [recordings, setRecordings] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [openDialogue, setOpenDialogue] = useState(false);
  const [setOpenEditTitleDialog] = useState(false);
  const [setNewTitle] = useState('');
  const token = useRef(localStorage.getItem('token'));
  const theme = localStorage.getItem('themeMode');
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [expanded, setExpanded] = useState(null);

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

      const sessionCode = response.data.code;

      if (response.status !== 400) {
        navigate(`/session/${sessionCode}`);
      }
    } catch (error) {
      console.error('Error starting the quiz:', error);
    }
  };

  const handleNewRecordingDetails = (e) =>
    setNewRecordingDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFetchRecordings = () => {
    fetchRecordings().then((res) => setRecordings(res.data.recordings));
  };

  const handleDeleteRecording = () => {
    deleteRecording(selectedRecording).then((res) =>
      res.status === 200
        ? toast.success('Recording successfully deleted!', { icon: '🗑️', theme })
        : toast.error('Could not delete recording.', { theme })
    );
    handleFetchRecordings();
    setOpenDialogue(false);
  };

  const handleGenerateSummary = (recordingId) => {
    toast
      .promise(
        axios.post(
          'https://6y2dyfv9k1.execute-api.us-west-2.amazonaws.com/Prod/create_summary_from_transcript',
          { recording_id: recordingId },
          {
            headers: {
              Authorization: `Token ${token.current}`,
              'Content-Type': 'application/json',
            },
          }
        ),
        {
          pending: 'Generating summary...',
          success: 'Summary generated successfully!',
          error: 'Failed to generate summary.',
          theme,
        }
      )
      .then((res) => {
        console.log('Summary generated:', res.data);
        // Optionally, handle the response, e.g., display the summary or update state
      })
      .catch((error) => {
        console.error('Error generating summary:', error);
      });
  };

  const handleCreateQuiz = () => {
    toast
      .promise(
        axios.post(
          'https://jtsw0t0x32.execute-api.us-west-2.amazonaws.com/Prod/create_quiz_from_transcript',
          { ...newRecordingDetails, recording_id: selectedRecording },
          {
            headers: {
              Authorization: `Token ${token.current}`,
              'Content-Type': 'application/json',
            },
          }
        ),
        {
          pending: 'Creating quiz',
          success: 'Successfully created quiz!',
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

  useWebSocket(`wss://api.edukona.com/ws/recordings/?token=${token.current}`, {
    onOpen: () => console.log('WebSocket connected'),
    onClose: () => console.log('WebSocket disconnected'),
    onError: websocketError,
    onMessage: handleIncomingMessage,
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    handleFetchRecordings();
  }, [token]);

  const fetchQuizzes = (id) => {
    if (quizzes == null) {
      setLoadingQuizzes(true);
    }
    axios
      .get(`https://api.edukona.com/recordings/${id}/quizzes`, { headers: { Authorization: `Token ${token.current}` } })
      .then((res) => setQuizzes(res.data))
      .catch((error) => console.error('Error fetching quizzes:', error))
      .finally(() => setLoadingQuizzes(false));
  };

  const handleAccordionChange = (recordingId) => (event, isExpanded) => {
    setExpanded(isExpanded ? recordingId : null);
    if (isExpanded) {
      fetchQuizzes(recordingId);
    }
  };

  const handleTitleClick = (recordingId, recordingTitle) => {
    if (recordingTitle === '') {
      navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
        if (result.state === 'granted' || result.state === 'prompt') {
          toast.promise(navigator.clipboard.writeText(recordingId), {
            success: 'Copied recording id to clipboard',
            pending: 'Copying recording id to clipboard',
            error: "Couldn't copy recording id to clipboard",
            theme,
          });
        }
      });
    } else {
      fetchQuizzes(recordingId);
    }
    setExpanded(expanded === recordingId ? null : recordingId);
  };

  return (
    <Main>
      <Container sx={{ padding: '40px' }}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            Unable to establish WebSocket connection
          </Alert>
        </Snackbar>
        <RecordButton onUpdate={handleFetchRecordings} />
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
              {recordings.length === 0 ? (
                <h1 style={{ textAlign: 'center' }}>No Recordings</h1>
              ) : (
                recordings.map((recording) => (
                  <React.Fragment key={recording.id}>
                    {/* First Row: Recording Details */}
                    <TableRow sx={{ cursor: 'default' }}>
                      {/* Adjusted alignment to center */}
                      <TableCell align="center" sx={{ width: '25%' }}>
                        {/* Center the content inside */}
                        <Box textAlign="center">
                          {/* Accordion Summary */}
                          <Accordion
                            expanded={expanded === recording.id}
                            onChange={handleAccordionChange(recording.id)}
                            sx={{ boxShadow: 'none' }}
                          >
                            <AccordionSummary
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAccordionChange(recording.id)(e, expanded !== recording.id);
                              }}
                              aria-controls={`panel-${recording.id}-content`}
                              id={`panel-${recording.id}-header`}
                              sx={{ padding: 0 }}
                            >
                              <Button
                                color="primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTitleClick(recording.id, recording.title);
                                }}
                              >
                                {recording.title === '' ? recording.id.substr(0, 7) + '...' : recording.title}
                              </Button>
                            </AccordionSummary>
                          </Accordion>
                        </Box>
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
                      {/* Adjusted alignment to center */}
                      <TableCell align="center" sx={{ width: '25%' }}>
                        {/* Center the CustomizedMenus component */}
                        <Box textAlign="center">
                          <CustomizedMenus
                            recording={recording}
                            handleOpenDialogue={handleOpenDialogue}
                            setSelectedRecording={setSelectedRecording}
                            setOpenNewRecording={setOpenNewRecording}
                            setOpenEditTitleDialog={setOpenEditTitleDialog}
                            handleGenerateSummary={handleGenerateSummary}
                            setNewTitle={setNewTitle}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                    {/* Second Row: Accordion Details */}
                    {expanded === recording.id && (
                      <TableRow>
                        <TableCell colSpan={4} style={{ paddingBottom: 0, paddingTop: 0 }}>
                          <Accordion expanded={expanded === recording.id} sx={{ boxShadow: 'none' }}>
                            <AccordionDetails>
                              {loadingQuizzes ? (
                                <CircularProgress />
                              ) : quizzes.length === 0 ? (
                                <Typography>No quizzes available</Typography>
                              ) : (
                                <Table>
                                  <TableBody>
                                    {quizzes.map((quiz) => (
                                      <QuizListRow
                                        key={quiz.id}
                                        quiz={quiz}
                                        onUpdate={() => fetchQuizzes(recording.id)}
                                      />
                                    ))}
                                  </TableBody>
                                </Table>
                              )}
                            </AccordionDetails>
                          </Accordion>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Dialog for delete confirmation */}
        <Dialog
          open={openDialogue}
          onClose={() => setOpenDialogue(false)}
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
        {/* Dialog for creating a new quiz */}
        <Dialog
          open={openNewRecording}
          onClose={() => setOpenNewRecording(false)}
          aria-labelledby="new-recording-dialogue"
          aria-describedby="new-recording-dialogue"
          PaperProps={{
            component: 'form',
            onSubmit: (event) => {
              event.preventDefault();
              handleCreateQuiz();
              setOpenNewRecording(false);
            },
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogContent
            style={{
              paddingTop: '20px',
              display: 'flex',
              gap: '8px',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '25px',
            }}
          >
            <FormControl fullWidth style={{ marginBottom: '10px' }}>
              <Typography id="num_of_questions_label" gutterBottom>
                Number of Questions
              </Typography>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs>
                  <Slider
                    name="num_of_questions"
                    id="num_of_questions"
                    value={newRecordingDetails.num_of_questions}
                    onChange={handleNewRecordingDetails}
                    aria-labelledby="num_of_questions_label"
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={3}
                    max={10}
                  />
                </Grid>
                <Grid item>
                  <Typography>{newRecordingDetails.num_of_questions}</Typography>
                </Grid>
              </Grid>
            </FormControl>
            <FormControl fullWidth>
              <Typography id="question_duration_label" gutterBottom>
                Question Duration (seconds)
              </Typography>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs>
                  <Slider
                    name="question_duration"
                    id="question_duration"
                    value={newRecordingDetails.question_duration}
                    onChange={handleNewRecordingDetails}
                    aria-labelledby="question_duration_label"
                    valueLabelDisplay="auto"
                    step={15}
                    marks
                    min={15}
                    max={60}
                  />
                </Grid>
                <Grid item>
                  <Typography>{newRecordingDetails.question_duration}</Typography>
                </Grid>
              </Grid>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenNewRecording(false)} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary" autoFocus>
              Create Quiz
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Main>
  );
};

export default InstructorRecordings;
