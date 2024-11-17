import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Input } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ChangeQuizTitleDialog = ({ open, setOpen, currentTitle, quizId, token, onUpdate }) => {
  const [title, setTitle] = useState(currentTitle);

  console.log(token);
  const updateTitle = () =>
    toast.promise(
      axios
        .patch(
          `https://api.edukona.com/quiz/${quizId}/update-title/`,
          { title: title },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        )
        .then(() => {
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
