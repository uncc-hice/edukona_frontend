import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Input } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { updateQuizTitle } from '../services/apiService';

const ChangeQuizTitleDialog = ({ open, setOpen, currentTitle, quizId, onUpdate }) => {
  const [title, setTitle] = useState(currentTitle);

  const updateTitle = () =>
    toast.promise(
      updateQuizTitle(quizId, title).then(() => {
        setOpen(false);
        onUpdate();
      }),
      {
        pending: 'Updating title...',
        success: 'Successfully updated title.',
        error: 'Failed to update title.',
      }
    );

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Update Title</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button onClick={updateTitle}>Update Title</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeQuizTitleDialog;
