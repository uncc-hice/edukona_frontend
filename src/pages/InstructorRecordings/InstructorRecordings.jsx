import { useContext, useEffect, useState } from 'react';
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
  CircularProgress,
} from '@mui/material';
import RecordButton from '../../blocks/RecordButton';
import { toast } from 'react-toastify';
import { Main } from '../../layouts';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchRecordings, fetchRecordingsByCourse, startQuizSession } from '../../services/apiService';
import { useRecordingWebSocket } from '../../services/apiService';
import RecordingListRow from './Components/RecordingListRow';
import { InstructorContext } from '../../InstructorContext';

const InstructorRecordings = () => {
  const [recordings, setRecordings] = useState(null);
  const { courses, activeCourse, setActiveCourse, isLoadingCourses } = useContext(InstructorContext);
  const navigate = useNavigate();
  const { courseId } = useParams();

  useEffect(() => {
    if (isLoadingCourses || !courses) return;

    const foundCourse = courseId ? courses.find((c) => c.id === courseId) || null : null;

    if (activeCourse?.id !== foundCourse?.id) {
      setActiveCourse(foundCourse);
    }
  }, [courseId, courses, activeCourse, setActiveCourse, isLoadingCourses]);

  // Fetch recordings
  const handleFetchRecordings = () => {
    setRecordings(null);
    if (activeCourse === null) {
      fetchRecordings()
        .then((res) => setRecordings(res.data.recordings))
        .catch((err) => console.error(err));
    } else {
      fetchRecordingsByCourse(activeCourse.id)
        .then((res) => setRecordings(res.data))
        .catch((err) => console.error(err));
    }
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
    if (isLoadingCourses) return;

    handleFetchRecordings();
  }, [activeCourse, isLoadingCourses]);

  return (
    <Main>
      <Container sx={{ padding: '40px' }}>
        <RecordButton onUpdate={handleFetchRecordings} />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '30%' }}>
                  <Typography variant="h6" align="center">
                    Title
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: '20%' }}>
                  <Typography variant="h6" align="center">
                    Uploaded At
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: '15%' }}>
                  <Typography variant="h6" align="center">
                    Duration
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: '15%' }}>
                  <Typography variant="h6" align="center">
                    Transcript Status
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: '10%' }}>
                  <Typography variant="h6" align="center">
                    Actions
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recordings === null ? (
                <TableRow>
                  <TableCell colSpan={4} align={'center'}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : recordings.length === 0 ? (
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
