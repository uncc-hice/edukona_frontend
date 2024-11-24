import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';

interface EditRecordingTitleDialogProps {
  open: boolean;
  onClose: () => void;
  onRename: (newTitle: string) => void;
  currentTitle: string;
}

const EditRecordingTitleDialog: React.FC<EditRecordingTitleDialogProps> = ({
  open,
  onClose,
  onRename,
  currentTitle,
}) => {
  const [newTitle, setNewTitle] = useState(currentTitle);

  const handleRename = () => {
    onRename(newTitle);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
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
        <Button onClick={onClose} color="primary">
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
