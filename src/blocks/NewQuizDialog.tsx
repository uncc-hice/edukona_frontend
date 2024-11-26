import { Button, Dialog, DialogActions, DialogContent, FormControl, Grid, Slider, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { startQuizSession } from '../services/apiService';
import { createQuiz } from '../services/lambdaService';

interface NewQuizDialogProps {
  open: boolean;
  setOpen(open: boolean): void;
  recordingId: string;
}

interface QuizSettings {
  num_of_questions: number;
  question_duration: number;
}

const NewQuizDialog = (props: NewQuizDialogProps) => {
  const [quizSettings, setQuizSettings] = useState<QuizSettings>({ num_of_questions: 5, question_duration: 30 });
  const handleChange = (e: Event) =>
    setQuizSettings((prev) => ({
      ...prev,
      [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value,
    }));
  const navigate = useNavigate();

  const startQuiz = async (quizId: number) =>
    toast.promise(
      startQuizSession(quizId).then((res) => navigate(`/session/${res.data.code}`)),
      { error: 'Failed to start quiz' }
    );

  const handleCreateQuiz = () =>
    toast
      .promise(createQuiz(quizSettings, props.recordingId), {
        pending: 'Creating quiz',
        success: 'Successfully created quiz!',
        error: 'Failed to create quiz!',
      })
      .then((res) => {
        console.log(res.data);
        startQuiz(res.data.quiz_id);
      })
      .catch((error) => console.error(error));

  return (
    <Dialog
      open={props.open}
      onClose={() => props.setOpen(false)}
      aria-labelledby="new-recording-dialogue"
      aria-describedby="new-recording-dialogue"
      PaperProps={{
        component: 'form',
        onSubmit: (event: Event) => {
          event.preventDefault();
          handleCreateQuiz();
          props.setOpen(false);
        },
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogContent
        style={{
          paddingTop: '20px',
          display: 'flex',
          gap: '8px',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '25px',
        }}
      >
        <FormControl fullWidth style={{ marginBottom: '10px' }}>
          <Typography id="num_of_questions_label" gutterBottom>
            Number of Questions
          </Typography>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs>
              <Slider
                name="num_of_questions"
                id="num_of_questions"
                value={quizSettings.num_of_questions}
                onChange={handleChange}
                aria-labelledby="num_of_questions_label"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={3}
                max={10}
              />
            </Grid>
            <Grid item>
              <Typography>{quizSettings.num_of_questions}</Typography>
            </Grid>
          </Grid>
        </FormControl>
        <FormControl fullWidth>
          <Typography id="question_duration_label" gutterBottom>
            Question Duration (seconds)
          </Typography>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs>
              <Slider
                name="question_duration"
                id="question_duration"
                value={quizSettings.question_duration}
                onChange={handleChange}
                aria-labelledby="question_duration_label"
                valueLabelDisplay="auto"
                step={15}
                marks
                min={15}
                max={60}
              />
            </Grid>
            <Grid item>
              <Typography>{quizSettings.question_duration}</Typography>
            </Grid>
          </Grid>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.setOpen(false)} color="primary">
          Cancel
        </Button>
        <Button type="submit" color="primary" autoFocus>
          Create Quiz
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewQuizDialog;
