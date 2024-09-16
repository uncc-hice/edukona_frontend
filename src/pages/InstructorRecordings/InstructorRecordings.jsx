import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
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
    Snackbar,
    Alert
} from '@mui/material';
import axios from "axios";
import Navbar from "../../blocks/Navbar";
import RecordButton from '../../blocks/RecordButton';
import useWebSocket from "react-use-websocket";

const InstructorRecordings = () => {
    const [recordings, setRecordings] = useState([]);
    const [open, setOpen] = useState(false);

    // Get the token from localStorage
    const token = localStorage.getItem('token');

    const handleIncomingMessage = (event) => {
        const receivedData = JSON.parse(event.data);
        console.log('Received data:', receivedData);

        if (receivedData.type === 'transcript_completed') {
            // Update the specific recording by mapping over the recordings
            setRecordings((prevRecordings) =>
                prevRecordings.map((recording) =>
                    recording.id === receivedData.recording_id
                        ? { ...recording, transcript: receivedData.transcript_status, transcript_url: receivedData.transcript_url }
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
        console.error("WebSocket error", event);
        setOpen(true);
    };

    // Establish WebSocket connection with the token
    const { lastMessage, readyState } = useWebSocket(`wss://api.edukona.com/ws/recordings/?token=${token}`, {
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
        const fetchRecordings = async () => {
            try {
                const response = await axios.get(`https://api.edukona.com/instructor-recordings/`, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                });
                setRecordings(response.data.recordings);
            } catch (error) {
                console.error('Failed to fetch recordings:', error);
            }
        };

        fetchRecordings();
    }, [token]);

    return (
        <div>
            <Navbar />
            <Container sx={{ padding: '40px' }}>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        Unable to establish WebSocket connection
                    </Alert>
                </Snackbar>
                <RecordButton onUpdate={onUpdate} />
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
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
                            {recordings.map((recording) => (
                                <TableRow key={recording.id}>
                                    <TableCell align="center">
                                        {new Date(recording.uploaded_at).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric',
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
                                                bgcolor:
                                                    recording.transcript === 'completed' ? 'green' : 'red',
                                                marginRight: 1,
                                            }}
                                        />

                                        {recording.transcript.charAt(0).toUpperCase() + recording.transcript.slice(1)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </div>
    );
};

export default InstructorRecordings;
