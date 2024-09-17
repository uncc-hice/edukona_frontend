import { Button } from "@mui/material";
import axios from "axios";
import { useRef, useState } from "react"
import {toast} from "react-toastify";

const mimetype = "audio/webm";
const uploadEndPoint = "https://api.edukona.com/upload-audio/";

// Creates the filename for new audio files
const createFileName = () => {
	const padNumber = (number) => number <= 10 ? '0' + number: number;
	const date = new Date();
	const dateString = `${date.getFullYear()}${padNumber(date.getMonth() + 1)}${padNumber(date.getDate())}`;
	const timeString = `${padNumber(date.getHours())}-${padNumber(date.getMinutes())}-${padNumber(date.getSeconds())}`;
	return `${dateString}-${timeString}.webm`;
}

const RecordButton = ({onUpdate}) => {
	const [isRecording, setIsRecording] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [buttonText, setButtonText] = useState("Start Recording");
	const audioBlob = useRef(null);
	const stream = useRef(null);
	const recorder = useRef(null);
	const chunks = useRef([]);
	const handleUpload = () => {
		setIsUploading(true);
		setButtonText("Uploading Audio")
		const formData = new FormData();
		formData.append('file', audioBlob.current, createFileName());
		formData.append('type', mimetype);
		axios.post(uploadEndPoint, formData, {
			headers: {
				'Content-Type': 'multipart/form',
				'Authorization': `Token ${localStorage.getItem('token')}`,
			}}
			)
			.then(res => {
				setIsUploading(false);
				setButtonText("Start Recording");
				if (res.status === 201) {
					toast.success('Recording successfully uploaded!', {
						icon: '🎉',
					});
					onUpdate();
				}
			})
			.catch(error => console.log(error));
	}

	const startRecording = async () => {
		try {
			const micStream = await navigator.mediaDevices.getUserMedia({audio: true});
			stream.current = micStream;
			recorder.current = new MediaRecorder(stream.current);
			recorder.current.ondataavailable = (e) => {
				if (e.data.size > 0) {
					chunks.current.push(e.data);
				}
			};
			recorder.current.onstop = () => {
				const blob = new Blob(
					chunks.current, {type: mimetype}
				);
				audioBlob.current = blob;
				chunks.current = [];
				handleUpload();
			};
			recorder.current.start();
		} catch(error) {
			console.log("Could not access microphone: " + error);
		}
	}

	const stopRecording = () => {
		if (recorder.current && recorder.current.state === 'recording') {
			recorder.current.stop();
		}
		if (stream.current) {
			stream.current.getTracks().forEach((t) => {
				t.stop();
			});
		}
	}

	const handleClick = async () => {
		if (isRecording) {
			setIsRecording(false);
			stopRecording()
		} else {
			setIsRecording(true);
			setButtonText("Stop Recording");
			startRecording();
		}
	}

	return (
		<Button 
			onClick={handleClick}
			variant={isRecording ? 'contained' : 'outlined'}
			color="primary"
			disabled={isUploading}
			>
			{buttonText}
		</Button>
	);
}

export default RecordButton;
