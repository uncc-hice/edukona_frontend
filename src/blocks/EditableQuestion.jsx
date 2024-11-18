import { FormControl } from '@mui/base';
import { EditNote, Save, Undo } from '@mui/icons-material';
import { Box, Button, Grid, Paper, TextField } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

const EditableQuestion = ({ question, token, onUpdate }) => {
  const [questionData, setQuestionData] = useState(question);
  const [disabled, setDisabled] = useState(true);

  const handleChangeQuestion = (e) => setQuestionData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleChangeIncorrectAnswer = (e, idx) => {
    const incorrectAnswers = questionData.incorrect_answer_list;
    const name = e.target.name.split('-')[0];
    incorrectAnswers[idx] = { ...incorrectAnswers[idx], [name]: e.target.value };
    setQuestionData((prev) => ({ ...prev, incorrect_answer_list: incorrectAnswers }));
  };

  const handleCancel = () => {
    setQuestionData(question);
    setDisabled(true);
  };

  const handleSave = () =>
    toast.promise(
      axios
        .put(`https://api.edukona.com/question/${question.id}/`, questionData, {
          headers: { Authorization: `Token ${token}` },
        })
        .then(() => {
          setDisabled(true);
          onUpdate();
        }),
      { pending: 'Saving changes...', success: 'Successfully saved changes', error: 'Failed to save changes' }
    );

  return (
    <Paper style={{ padding: '20px', margin: '15px' }}>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <FormControl>
            <TextField
              id={'question_text'}
              name={'question_text'}
              label={'Question Text'}
              onChange={(e) => handleChangeQuestion(e)}
              value={questionData.question_text}
              disabled={disabled}
              fullWidth
            />
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControl>
            <TextField
              id={'points'}
              name={'points'}
              label={'Points'}
              onChange={(e) => handleChangeQuestion(e)}
              type={'number'}
              value={questionData.points}
              disabled={disabled}
              fullWidth
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl>
            <TextField
              id={'correct_answer'}
              name={'correct_answer'}
              label={'Correct Answer'}
              onChange={(e) => handleChangeQuestion(e)}
              value={questionData.correct_answer}
              disabled={disabled}
              fullWidth
            />
          </FormControl>
        </Grid>
        {questionData.incorrect_answer_list.map((incorrectAnswer, idx) => (
          <Grid item container key={idx} xs={12} spacing={2}>
            <Grid item xs={6}>
              <FormControl>
                <TextField
                  key={`answer-${idx}`}
                  id={`answer-${idx}`}
                  label={'Answer'}
                  name={`answer-${idx}`}
                  value={incorrectAnswer.answer}
                  onChange={(e) => handleChangeIncorrectAnswer(e, idx)}
                  disabled={disabled}
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl>
                <TextField
                  key={`feedback-${idx}`}
                  id={`feedback-${idx}`}
                  label={'Feedback'}
                  name={`feedback-${idx}`}
                  value={incorrectAnswer.feedback}
                  onChange={(e) => handleChangeIncorrectAnswer(e, idx)}
                  disabled={disabled}
                  fullWidth
                />
              </FormControl>
            </Grid>
          </Grid>
        ))}
      </Grid>
      {disabled ? (
        <Box textAlign={'right'} marginTop={'5px'}>
          <Button onClick={() => setDisabled(false)} size={'large'}>
            <EditNote />
            Edit
          </Button>
        </Box>
      ) : (
        <Box textAlign={'right'} marginTop={'5px'}>
          <Button onClick={handleCancel} size={'large'} color={'error'}>
            <Undo />
            Cancel
          </Button>
          <Button onClick={handleSave} size={'large'}>
            <Save />
            Save Changes
          </Button>
        </Box>
      )}
    </Paper>
  );
};
export default EditableQuestion;
