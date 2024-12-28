import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { toast } from 'react-toastify';
import { deleteRecording } from '../services/apiService';

const DeleteRecordingDialog = ({ open, setOpen, onUpdate, recordingId }) => {
  const handleDeleteRecording = () => {
    deleteRecording(recordingId)
      .then(() => {
        toast.success('Recording successfully deleted!');
        onUpdate();
        setOpen(false);
      })
      .catch(() => toast.error('Failed to delete recording.'));
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth
      aria-labelledby="delete-recording-title"
      aria-describedby="delete-recording-description"
    >
      <DialogTitle id="delete-recording-title">{'Confirm Deletion'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-recording-description">
          Are you sure you want to delete this recording?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDeleteRecording} color="primary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default DeleteRecordingDialog;
