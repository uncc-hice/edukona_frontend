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
import { fetchRecordings, startQuizSession } from '../../services/apiService';
import DeleteRecordingDialog from '../../blocks/DeleteRecordingDialog';
import NewQuizDialog from '../../blocks/NewQuizDialog';

const InstructorRecordings = () => {
  const [openNewQuiz, setOpenNewQuiz] = useState(false);
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

  const handleNewRecordingDetails = (e) =>
    setNewRecordingDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFetchRecordings = () => {
    fetchRecordings().then((res) => setRecordings(res.data.recordings));
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
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography variant={'h4'} textAlign={'center'}>
                      No Recordings
                    </Typography>
                  </TableCell>
                </TableRow>
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
                            setOpenNewRecording={setOpenNewQuiz}
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
                    {/* Dialog for delete confirmation */}
                    <DeleteRecordingDialog
                      open={openDialogue}
                      setOpen={setOpenDialogue}
                      onUpdate={handleFetchRecordings}
                      recordingId={recording.id}
                    />
                    {/* Dialog for creating a new quiz */}
                    <NewQuizDialog open={openNewQuiz} setOpen={setOpenNewQuiz} recordingId={recording.id} />
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Main>
  );
};

export default InstructorRecordings;
