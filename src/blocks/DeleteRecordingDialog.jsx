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
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{'Confirm Deletion'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
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
