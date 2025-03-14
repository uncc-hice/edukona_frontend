import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Select,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
  FormHelperText,
  Typography,
  CircularProgress,
} from '@mui/material';
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import { InstructorContext } from '../../../InstructorContext';
import { moveRecordingToCourse } from '../../../services/apiService';

interface ChangeRecordingCourseDialogProps {
  open: boolean;
  setOpen(open: boolean): void;
  recording_id: string;
  course_id: string;
  onUpdate(): void;
}

const ChangeRecordingCourseDialog: React.FC<ChangeRecordingCourseDialogProps> = ({
  open,
  setOpen,
  recording_id,
  course_id,
  onUpdate,
}) => {
  const { courses } = useContext(InstructorContext);
  const course_titles = useMemo(() => {
    return courses
      ? courses.filter((course) => course.id !== course_id).map((course) => ({ id: course.id, title: course.title }))
      : [];
  }, [courses, course_id]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const hasAvailableCourses = course_titles.length > 0;

  // Reset selected course when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedCourseId(course_titles[0]?.id || '');
    }
  }, [open, course_titles]);

  const handleCancel = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    if (!selectedCourseId) return;

    setIsLoading(true);
    moveRecordingToCourse(recording_id, selectedCourseId)
      .then(() => {
        toast.success('Course changed successfully');
        onUpdate(); // Only update after successful API call
        setOpen(false);
      })
      .catch((err) => {
        console.error('Error changing course:', err);
        toast.error('Failed to change course');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Dialog open={open} fullWidth aria-labelledby="change-recording-course-dialog-title" onClose={handleCancel}>
      <DialogTitle id="change-recording-course-dialog-title">
        Change Recording Course
        <IconButton
          aria-label="close"
          onClick={handleCancel}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {!hasAvailableCourses ? (
          <Typography color="error">No other courses available to move this recording to.</Typography>
        ) : (
          <FormControl fullWidth margin="normal">
            <InputLabel id="select-course-label">Target Course</InputLabel>
            <Select
              labelId="select-course-label"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value as string)}
              label="Target Course"
              disabled={isLoading}
            >
              {course_titles.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.title}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select the course you want to move this recording to</FormHelperText>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary" disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          color="primary"
          disabled={!selectedCourseId || isLoading || !hasAvailableCourses}
          variant="contained"
        >
          {isLoading ? <CircularProgress size={24} /> : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeRecordingCourseDialog;
