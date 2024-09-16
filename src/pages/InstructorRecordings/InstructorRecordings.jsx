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
    Alert
} from '@mui/material';
import axios from "axios";
import RecordButton from '../../blocks/RecordButton';
import useWebSocket from "react-use-websocket";
import { toast } from 'react-toastify';
import Navbar from '../../blocks/Navbar';
import { Delete } from '@mui/icons-material';

const InstructorRecordings = () => {
  const [recordings, setRecordings] = useState([]);
  const [open, setOpen] = useState(false);
	const [selectedRecording, setSelectedRecording] = useState(null);
	const [openDialogue, setOpenDialogue] = useState(false);
	const token = useRef(localStorage.getItem('token'));

	const fetchRecordings = () => axios.get(`https://api.edukona.com/instructor-recordings/`, {
		headers: {
			Authorization: `Token ${token.current}`
		}
	})
	.then(res => setRecordings(res.data.recordings))
	.catch(error => console.error(error));

	const handleOpenDialogue = (recordingId) => {
		setSelectedRecording(recordingId);
		setOpenDialogue(true);
	}

	const handleDeleteRecording = () => {
		axios.delete(`https://api.edukona.com/instructor-recordings/${selectedRecording}/delete-recording`, {
			headers: { 
				Authorization: `Token ${token.current}`,
			}
			})
			.then(res => res.status === 200 ? toast.success('Quiz successfully deleted!', {icon: '🗑️',}) : toast.error('Could not delete quiz.', {}))
			.then(() => fetchRecordings())
			.catch(error => console.error(error));
		setOpenDialogue(false);
	}

  const handleIncomingMessage = (event) => {
    const receivedData = JSON.parse(event.data);
    console.log('Received data:', receivedData);

    if (receivedData.type === 'transcript_completed') {
      // Update the specific recording by mapping over the recordings
      setRecordings((prevRecordings) => prevRecordings.map((recording) => recording.id === receivedData.recording_id ? {
        ...recording, transcript: receivedData.transcript_status, transcript_url: receivedData.transcript_url
      } : recording));
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const websocketError = (event) => {
    console.error("WebSocket error", event);
    setOpen(true);
  };

  // Establish WebSocket connection with the token
  const {} = useWebSocket(`wss://api.edukona.com/ws/recordings/?token=${token.current}`, {
    onOpen: () => console.log("WebSocket connected"),
    onClose: () => console.log("WebSocket disconnected"),
    onError: websocketError,
    onMessage: handleIncomingMessage,
    shouldReconnect: (closeEvent) => true, // Automatically reconnect
  });

  const onUpdate = (newRecording) => {
    setRecordings((prevRecordings) => [newRecording, ...prevRecordings]);
  };

  useEffect(() => {
    fetchRecordings();
  }, [token]);

  return (<div>
    <Navbar/>
    <Container sx={{ padding: '40px' }}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          Unable to establish WebSocket connection
        </Alert>
      </Snackbar>
      <RecordButton onUpdate={onUpdate}/>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6" align="center">
                  Recording ID
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" align="center">
                  Uploaded At
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" align="center">
                  Transcript Status
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recordings.map((recording) => (<TableRow key={recording.id}>
              <TableCell align="center">
                {recording.id}
              </TableCell>
              <TableCell align="center">
                {new Date(recording.uploaded_at).toLocaleDateString(undefined, {
                  year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric',
                })}
              </TableCell>
              <TableCell align="center">
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

									<TableCell>
										<Button onClick={() => handleOpenDialogue(recording.id)}><Delete color='action' /></Button>
									</TableCell>
            </TableRow>))}
          </TableBody>
        </Table>
      </TableContainer>
			<Dialog
				open={openDialogue}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				>
				<DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
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
  </div>);
};

export default InstructorRecordings;
