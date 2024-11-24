import { Delete, Undo } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const DeleteQuestionDialog = ({ question, token, open, setOpen, onUpdate }) => {
  const handleDelete = () =>
    toast.promise(
      axios
        .delete(`https://api.edukona.com/question/${question.id}/`, { headers: { Authorization: `Token ${token}` } })
        .then(() => {
          setOpen(false);
          onUpdate();
        }),
      {
        pending: 'Deleting question...',
        success: 'Successfully deleted question.',
        error: 'Failed to delete question.',
      }
    );
  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Confirm Question Deletion</DialogTitle>
      <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="p">Are you sure you want to delete the question &quot;{question.question_text}&quot;</Typography>
        <Typography variant="subtitle1" fontWeight={'bold'}>
          This cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>
          <Undo />
          Cancel
        </Button>
        <Button color="error" onClick={handleDelete}>
          <Delete />
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteQuestionDialog;
