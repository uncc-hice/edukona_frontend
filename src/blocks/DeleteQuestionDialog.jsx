import { Delete, Undo } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { deleteQuestion } from '../services/apiService';

const DeleteQuestionDialog = ({ question, open, setOpen, onUpdate }) => {
  const handleDelete = () =>
    toast.promise(
      deleteQuestion(question.id).then(() => {
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
        <Typography variant="p">
          Are you sure you want to delete the question &quot;{question.question_text}&quot;
        </Typography>
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
