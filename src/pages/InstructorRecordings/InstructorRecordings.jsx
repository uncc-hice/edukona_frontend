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
} from '@mui/material';
import RecordButton from '../../blocks/RecordButton';
import useWebSocket from 'react-use-websocket';
import { toast } from 'react-toastify';
import { Main } from '../../layouts';
import { useNavigate } from 'react-router-dom';
import { fetchRecordings, startQuizSession } from '../../services/apiService';
import RecordingListRowMenu from '../../blocks/RecordingListRowMenu';

// Import our new component
import AccordionQuizzes from './Components/AccordionQuizzes.tsx';

const InstructorRecordings = () => {
  const [recordings, setRecordings] = useState([]);
  const token = useRef(localStorage.getItem('token') || '');
  const theme = localStorage.getItem('themeMode');
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  // Fetch recordings
  const handleFetchRecordings = () => {
    fetchRecordings().then((res) => setRecordings(res.data.recordings));
  };

  // WebSocket events
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
    } else if (receivedData.type === 'quiz_creation_completed') {
      toast.dismiss('generatingQuiz');
      toast.promise(
        startQuizSession(receivedData.quiz_id).then((res) => navigate(`/session/${res.data.code}`)),
        { error: 'Failed to start quiz' }
      );
    }
  };

  const websocketError = (event) => {
    console.error('WebSocket error', event);
    toast.error('Failed to establish WebSocket Connection');
  };

  // Initialize WebSocket
  useWebSocket(`wss://api.edukona.com/ws/recordings/?token=${token.current}`, {
    onOpen: () => console.log('WebSocket connected'),
    onClose: () => console.log('WebSocket disconnected'),
    onError: websocketError,
    onMessage: handleIncomingMessage,
    shouldReconnect: () => true,
  });

  // On mount, fetch the recordings
  useEffect(() => {
    handleFetchRecordings();
  }, [token]);

  /**
   * Toggles the accordion for a given recording ID.
   * If it's already expanded, collapse it; otherwise expand it.
   */
  const handleAccordionChange = (recordingId) => (event, isExpanded) => {
    setExpanded(isExpanded ? recordingId : null);
  };

  const handleTitleClick = (recordingId, recordingTitle) => {
    // If the recording has no title, copy the ID to clipboard
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
    }
    // Toggle the accordion
    setExpanded(expanded === recordingId ? null : recordingId);
  };

  return (
    <Main>
      <Container sx={{ padding: '40px' }}>
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
                    {/* --- Row 1: Recording Info --- */}
                    <TableRow sx={{ cursor: 'default' }}>
                      <TableCell align="center" sx={{ width: '25%' }}>
                        <Box textAlign="center">
                          <Button
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTitleClick(recording.id, recording.title);
                            }}
                          >
                            {recording.title === '' ? recording.id.substr(0, 7) + '...' : recording.title}
                          </Button>
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
                      <TableCell align="center" sx={{ width: '25%' }}>
                        <Box textAlign="center">
                          <RecordingListRowMenu recording={recording} onUpdate={handleFetchRecordings} />
                        </Box>
                      </TableCell>
                    </TableRow>

                    {/* --- Row 2: Accordion for Quizzes (only if expanded) --- */}
                    {expanded === recording.id && (
                      <TableRow>
                        <TableCell colSpan={4} style={{ paddingBottom: 0, paddingTop: 0 }}>
                          <AccordionQuizzes
                            recordingId={recording.id}
                            token={token.current}
                            expanded={expanded === recording.id}
                            onChange={handleAccordionChange(recording.id)}
                          />
                        </TableCell>
                      </TableRow>
                    )}
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
