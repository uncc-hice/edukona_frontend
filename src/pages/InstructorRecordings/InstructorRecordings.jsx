import React, {useEffect, useState} from 'react';
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
    Box
} from '@mui/material';
import axios from "axios";
import Navbar from "../../blocks/Navbar";
import RecordButton from '../../blocks/RecordButton';

const InstructorRecordings = () => {
    const [recordings, setRecordings] = useState([]);

	const onUpdate = (newRecording) => {
		setRecordings([newRecording, ...recordings]);
	}

    const token = localStorage.getItem('token');
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
    }, []);


    return (
        <div>
            <Navbar/>
            <Container sx={{ padding: '40px' }}>
				<RecordButton onUpdate={onUpdate} />
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="h6" align={"center"}>
                                        Uploaded At
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="h6" align={"center"}>
                                        Transcript Status
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {recordings.map((recording) => (
                                <TableRow key={recording.id}>
                                    <TableCell align={"center"}>
                                        {new Date(recording.uploaded_at)
                                            .toLocaleDateString(
                                                undefined,
                                                { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'}
                                            )}
                                    </TableCell>
                                    <TableCell align={"center"}>
                                        <Box component="span" sx={{ width: 16, height: 16, display: 'inline-block', borderRadius: '50%', bgcolor: recording.transcript === 'completed' ? 'green' : 'red', marginRight: 1 }} />
                                        {recording.transcript}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </div>
    );
}

export default InstructorRecordings;
