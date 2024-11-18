import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  Typography,
  LinearProgress,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import RecordingTimer from './RecordingTimer';
import AWS from 'aws-sdk';

const mimetype = 'audio/webm';

// Creates the filename for new audio files
const createFileName = () => {
  const padNumber = (number) => (number <= 9 ? '0' + number : number);
  const date = new Date();
  const dateString = `${date.getFullYear()}${padNumber(date.getMonth() + 1)}${padNumber(date.getDate())}`;
  const timeString = `${padNumber(date.getHours())}-${padNumber(date.getMinutes())}-${padNumber(date.getSeconds())}`;
  return `${dateString}-${timeString}.webm`;
};

const RecordButton = ({ onUpdate }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [buttonText, setButtonText] = useState('Start Recording');
  const [titleOpen, setTitleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [title, setTitle] = useState('Untitled Recording');
  const audioBlob = useRef(null);
  const stream = useRef(null);
  const recorder = useRef(null);
  const chunks = useRef([]);
  const theme = localStorage.getItem('themeMode');

  const handleUpload = useCallback(async () => {
    setTitleOpen(false);
    setIsUploading(true);
    setButtonText('Uploading Audio');

    const fileName = createFileName();
    const file = new File([audioBlob.current], fileName, {
      type: mimetype,
    });

    try {
      // Fetch temporary credentials
      const response = await axios.post(
        'https://api.edukona.com/generate-temporary-credentials/',
        {},
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        }
      );

      const { AccessKeyId, SecretAccessKey, SessionToken, Region, BucketName, Folder } = response.data;

      // Configure AWS SDK
      AWS.config.update({
        accessKeyId: AccessKeyId,
        secretAccessKey: SecretAccessKey,
        sessionToken: SessionToken,
        region: Region,
      });

      const s3 = new AWS.S3();

      // Upload file to S3
      const s3Key = `${Folder}/${fileName}`; // Store the S3 key for later use

      const params = {
        Bucket: BucketName,
        Key: s3Key,
        Body: file,
        ContentType: mimetype,
        ACL: 'private',
      };

      const options = {
        partSize: 5 * 1024 * 1024, // 5 MB
        queueSize: 1, // Concurrent upload threads
      };

      const upload = s3.upload(params, options);

      upload.on('httpUploadProgress', (event) => {
        const percentCompleted = Math.round((event.loaded * 100) / event.total);
        setUploadProgress(percentCompleted);
      });

      upload.send(async (err, data) => {
        setIsUploading(false);
        setButtonText('Start Recording');
        setUploadProgress(0);
        if (err) {
          console.error('Upload Error:', err);
          toast.error('Upload failed');
        } else {
          console.log('Upload Success:', data);
          toast.success('Recording successfully uploaded!', {
            icon: '🎉',
            theme,
          });
          // Notify backend about the new recording
          try {
            const backendResponse = await axios.post(
              'https://api.edukona.com/recordings/create-recording/',
              {
                s3_path: s3Key,
                title: title,
              },
              {
                headers: {
                  Authorization: `Token ${localStorage.getItem('token')}`,
                },
              }
            );
            console.log('Backend recording creation success:', backendResponse.data);
            onUpdate(); // Refresh recordings if necessary
          } catch (backendError) {
            console.error('Error creating recording in backend:', backendError);
            toast.error('Failed to save recording metadata');
          }
        }
      });
    } catch (error) {
      console.error('Error during upload:', error);
      setIsUploading(false);
      setButtonText('Start Recording');
      toast.error('Upload failed');
    }

    setTitle(null);
  }, [title, onUpdate, theme]);

  const handleCancelUpload = () => {
    setButtonText('Start Recording');
    setTitleOpen(false);
    setCancelOpen(false);
    setTitle(null);
  };

  useEffect(() => {
    const getDevices = async () => {
      try {
        // Request permission to access the microphone to get device labels
        await navigator.mediaDevices.getUserMedia({ audio: true });

        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter((device) => device.kind === 'audioinput');
        setDevices(audioDevices);
      } catch (error) {
        console.error('Error fetching devices: ', error);
      }
    };

    getDevices();
  }, []);

  useEffect(() => {
    if (devices.length > 0 && !selectedDeviceId) {
      setSelectedDeviceId(devices[0].deviceId);
    }
  }, [devices, selectedDeviceId]);

  const startRecording = async () => {
    try {
      const constraints = {
        audio: {
          deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
        },
      };
      const micStream = await navigator.mediaDevices.getUserMedia(constraints);

      stream.current = micStream;
      recorder.current = new MediaRecorder(stream.current);
      recorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };
      recorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: mimetype });
        audioBlob.current = blob;
        chunks.current = [];
      };
      recorder.current.start();
    } catch (error) {
      console.log('Could not access microphone: ' + error);
    }
  };

  const stopRecording = () => {
    if (recorder.current && recorder.current.state === 'recording') {
      recorder.current.stop();
    }
    if (stream.current) {
      stream.current.getTracks().forEach((t) => {
        t.stop();
      });
    }
  };

  const handleClick = async () => {
    if (isRecording) {
      setIsRecording(false);
      stopRecording();
      setTitleOpen(true);
    } else {
      setIsRecording(true);
      setButtonText('Stop Recording');
      startRecording();
    }
  };

  useEffect(() => {
    if (titleOpen) {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const default_text = `${now.toISOString().split('T')[0]} ${timeString} Recording`;
      setTitle(default_text);
      console.log('Title set to:', default_text);
    }
  }, [titleOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && titleOpen && title) {
        event.preventDefault();
        event.stopPropagation();
        handleUpload();
      }
    };

    if (titleOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [titleOpen, title, handleUpload]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
      <FormControl variant="outlined" style={{ minWidth: 200, marginRight: '1rem' }}>
        <InputLabel id="microphone-select-label">Microphone</InputLabel>
        <Select
          labelId="microphone-select-label"
          id="microphone-select"
          value={selectedDeviceId}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
          label="Microphone"
          disabled={isRecording || isUploading}
        >
          {devices.map((device, idx) => (
            <MenuItem key={device.deviceId} value={device.deviceId}>
              {device.label || `Microphone ${idx + 1}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* Conditionally render the Start/Stop Recording button */}
      {!isUploading && (
        <Button
          onClick={handleClick}
          variant={isRecording ? 'contained' : 'outlined'}
          color={isRecording ? 'error' : 'primary'}
          disabled={isUploading}
          // style={{ marginRight: '1rem\m', marginTop: '1rem' }}
        >
          {buttonText}
        </Button>
      )}
      <RecordingTimer active={isRecording} />
      {/* Show the upload progress indicator when uploading */}
      {isUploading && (
        <div style={{ width: '100%', marginTop: '1rem' }}>
          <Typography variant="body1">Uploading: {uploadProgress}%</Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </div>
      )}
      <Dialog open={titleOpen}>
        <DialogTitle>Enter a title for the new recording</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="recordingTitle"
            label="Recording Title"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <Button onClick={() => setCancelOpen(true)}>Cancel</Button>
          <Button disabled={!title} onClick={handleUpload} autoFocus>
            Upload Recording
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog open={cancelOpen}>
        <DialogTitle>Cancel Upload</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Are you sure you want to cancel? Your recording will be lost.</Typography>
          <Button onClick={handleCancelUpload}>Cancel Audio Upload</Button>
          <Button onClick={() => setCancelOpen(false)}>Back to Title Creation</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecordButton;
