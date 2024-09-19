import { Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify";

const mimetype = "audio/webm";
const uploadEndPoint = "https://api.edukona.com/upload-audio/";

// Creates the filename for new audio files
const createFileName = () => {
  const padNumber = (number) => number <= 10 ? '0' + number : number;
  const date = new Date();
  const dateString = `${date.getFullYear()}${padNumber(date.getMonth() + 1)}${padNumber(date.getDate())}`;
  const timeString = `${padNumber(date.getHours())}-${padNumber(date.getMinutes())}-${padNumber(date.getSeconds())}`;
  return `${dateString}-${timeString}.webm`;
}

const RecordButton = ({ onUpdate }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
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
        'Content-Type': 'multipart/form', 'Authorization': `Token ${localStorage.getItem('token')}`,
      }
    })
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

  useEffect(() => {
    const getDevices = async () => {
      try {
        // Request permission to access the microphone to get device labels
        await navigator.mediaDevices.getUserMedia({ audio: true });

        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter((device) => device.kind === "audioinput");
        setDevices(audioDevices);
        if (audioDevices.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(audioDevices[0].deviceId);
        }
      } catch (error) {
        console.error("Error fetching devices: ", error);
      }
    };

    getDevices();
  }, []);


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
        handleUpload();
      };
      recorder.current.start();
    } catch (error) {
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

  return (<div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
    <FormControl variant="outlined" style={{ minWidth: 200, marginRight: "1rem" }}>
      <InputLabel id="microphone-select-label">Microphone</InputLabel>
      <Select
        labelId="microphone-select-label"
        id="microphone-select"
        value={selectedDeviceId}
        onChange={(e) => setSelectedDeviceId(e.target.value)}
        label="Microphone"
        disabled={isRecording || isUploading}
      >
        {devices.map((device, idx) => (<MenuItem key={device.deviceId} value={device.deviceId}>
          {device.label || `Microphone ${idx + 1}`}
        </MenuItem>))}
      </Select>
    </FormControl>
    <Button
      onClick={handleClick}
      variant={isRecording ? "contained" : "outlined"}
      color="primary"
      disabled={isUploading}
    >
      {buttonText}
    </Button>
  </div>);
}

export default RecordButton;
