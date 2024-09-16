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
    DialogActions
} from '@mui/material';
import axios from "axios";
import RecordButton from '../../blocks/RecordButton';
import Navbar from '../../blocks/Navbar';
import { toast } from 'react-toastify';
import { Delete } from '@mui/icons-material';

const InstructorRecordings = () => {
	const [recordings, setRecordings] = useState([]);
	const [selectedRecording, setSelectedRecording] = useState(null);
	const [open, setOpen] = useState(false);
	const token = useRef(localStorage.getItem('token'));
	const fetchRecordings = () => axios.get(`https://api.edukona.com/instructor-recordings/`, {
		headers: {
			Authorization: `Token ${token.current}`
		}
	})
	.then(res => setRecordings(res.data.recordings))
	.catch(error => console.error(error));

	const onUpdate = (newRecording) => {
		setRecordings([newRecording, ...recordings]);
	};

	const handleOpen = (recordingId) => {
		setSelectedRecording(recordingId);
		setOpen(true);
	}

	const handleClose = () => setOpen(false);

	const handleDelete = () => {
		axios.delete(`https://api.edukona.com/instructor-recordings/${selectedRecording}/delete-recording`, {
			headers: { 
				Authorization: `Token ${token.current}`,
			}
			})
			.then(res => res.status === 200 ? toast.success('Quiz successfully deleted!', {icon: '🗑️',}) : toast.error('Could not delete quiz.', {}))
			.then(() => fetchRecordings())
			.catch(error => console.error(error));
		handleClose();
	}


	useEffect(() => {
		fetchRecordings();
		}, [token.current]);

	return (
		<div>
		<Navbar />
			<Container sx={{ padding: '40px' }}>
				<RecordButton onUpdate={onUpdate} />
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								{/* Add new column for Recording ID */}
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
								<TableCell colSpan={2}>
									<Typography variant="h6" align="center">
										Transcript Status
									</Typography>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{recordings.map((recording) => (
								<TableRow key={recording.id}>
								{/* Display Recording ID */}
									<TableCell align="center">
										{recording.id}
									</TableCell>
									<TableCell align="center">
										{new Date(recording.uploaded_at).toLocaleDateString(
											undefined,
											{ year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }
										)}
									</TableCell>
									<TableCell align="center">
										<Box component="span" sx={{ width: 16, height: 16, display: 'inline-block', borderRadius: '50%', bgcolor: recording.transcript === 'completed' ? 'green' : 'red', marginRight: 1 }} />
										{recording.transcript}
									</TableCell>
									<TableCell>
										<Button onClick={() => handleOpen(recording.id)}><Delete color='action' /></Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Container>
			<Dialog
				open={open}
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
						<Button onClick={handleClose} color="primary">
						Cancel
						</Button>
						<Button onClick={handleDelete} color="primary" autoFocus>
						Confirm
						</Button>
					</DialogActions>
			</Dialog>
		</div>
	);
};

export default InstructorRecordings;
