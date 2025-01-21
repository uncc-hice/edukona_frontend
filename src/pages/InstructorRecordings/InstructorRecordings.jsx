import { useEffect, useState } from 'react';
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
} from '@mui/material';
import RecordButton from '../../blocks/RecordButton';
import { toast } from 'react-toastify';
import { Main } from '../../layouts';
import { useNavigate } from 'react-router-dom';
import { fetchRecordings, startQuizSession } from '../../services/apiService';
import { useRecordingWebSocket } from '../../services/apiService';
import RecordingListRow from './Components/RecordingListRow';

const InstructorRecordings = () => {
  const [recordings, setRecordings] = useState([]);
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
  useRecordingWebSocket(websocketError, handleIncomingMessage);

  // On mount, fetch the recordings
  useEffect(() => {
    handleFetchRecordings();
  }, []);

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
                  <RecordingListRow key={recording.id} recording={recording} onUpdate={handleFetchRecordings} />
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
