import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import LocalizedDatePicker from '../../LocalizedDatePicker';

interface CourseForm {
  title: string;
  description: string;
  allow_joining_until: Date | null;
  start_date: Date | null;
  end_date: Date | null;
}

const CreateCourseDialog = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
  const [formData, setFormData] = useState<CourseForm>({
    title: '',
    description: '',
    allow_joining_until: null,
    start_date: null,
    end_date: null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth
      aria-labelledby="delete-recording-title"
      aria-describedby="delete-recording-description"
    >
      <DialogTitle id="delete-recording-title">Enter New Course Details</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="normal"
          name="title"
          label="Title"
          type="text"
          fullWidth
          value={formData.title}
          onChange={handleChange}
          required
        />
        <TextField
          autoFocus
          margin="normal"
          name="description"
          label="Description"
          type="text"
          fullWidth
          value={formData.description}
          onChange={handleChange}
          required
        />
        <LocalizedDatePicker
          name="startDate"
          label="Start Date"
          margin="normal"
          value={formData.start_date}
          onChange={(date: Date | null) => setFormData({ ...formData, start_date: date })}
        />
        <LocalizedDatePicker
          name="endDate"
          label="End Date"
          margin="normal"
          value={formData.end_date}
          onChange={(date: Date | null) => setFormData({ ...formData, end_date: date })}
        />
        <LocalizedDatePicker
          name="allowJoiningUntil"
          label="Enrollment Closes on"
          margin="normal"
          value={formData.allow_joining_until}
          onChange={(date: Date | null) => setFormData({ ...formData, allow_joining_until: date })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={() => {}} color="primary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default CreateCourseDialog;
