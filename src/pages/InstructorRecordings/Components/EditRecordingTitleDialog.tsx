import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import { updateRecordingTitle } from '../../../services/apiService';
import { toast } from 'react-toastify';

interface EditRecordingTitleDialogProps {
  open: boolean;
  setOpen(open: boolean): void;
  recordingId: string;
  currentTitle: string;
  onUpdate(): void;
}

const EditRecordingTitleDialog: React.FC<EditRecordingTitleDialogProps> = ({
  open,
  setOpen,
  currentTitle,
  recordingId,
  onUpdate,
}) => {
  const [newTitle, setNewTitle] = useState(currentTitle);

  const handleRename = () =>
    toast.promise(
      updateRecordingTitle(recordingId, newTitle)
        .then(() => {
          setOpen(false);
          onUpdate();
        })
        .catch((err) => console.error(err)),
      {
        pending: 'Updating recording title...',
        success: 'Successfully updated recording title',
        error: 'Failed to update recording title',
      }
    );

  return (
    <Dialog open={open}>
      <DialogTitle>Rename Recording</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="New Title"
          type="text"
          fullWidth
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={handleRename} color="primary">
          Rename
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRecordingTitleDialog;
