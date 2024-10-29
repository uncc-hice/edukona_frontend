import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { toast } from 'react-toastify';
import Main from '../layouts/Main';

function EditQuizView() {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questionText, setQuestionText] = useState('');
  const [answers, setAnswers] = useState(['', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [points, setPoints] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  const token = localStorage.getItem('token');
  const theme = localStorage.getItem('themeMode');

  const fetchQuestions = useCallback(async () => {
    try {
      const response = await axios.get(`https://api.edukona.com/all-questions/${quizId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setQuestions(response.data.questions || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }, [quizId, token]);

  useEffect(() => {
    if (quizId) {
      fetchQuestions();
    } else {
      console.error('quizId is undefined');
    }
  }, [quizId, fetchQuestions]);

  useEffect(() => {
    if (selectedQuestion) {
      setAnswers(selectedQuestion.incorrect_answer_list);
      setCorrectAnswer(selectedQuestion.correct_answer);
      setQuestionText(selectedQuestion.question_text);
      setPoints(selectedQuestion.points);
    }
  }, [selectedQuestion]);

  if (!token) {
    console.log('No token found');
    return null;
  }

  const saveQuestion = async (questionData) => {
    const endpoint = selectedQuestion?.id
      ? `https://api.edukona.com/question/${selectedQuestion.id}/`
      : `https://api.edukona.com/question/`;
    const method = selectedQuestion?.id ? 'put' : 'post';

    try {
      await axios[method](endpoint, [questionData], {
        // Wrap questionData in an array
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });
      await fetchQuestions();
      resetForm();
    } catch (error) {
      console.error('Error saving the question:', error);
    }
  };

  const handleOpen = (questionId) => {
    setSelectedQuestionId(questionId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteQuestion = async () => {
    handleClose();
    try {
      await axios.delete(`https://api.edukona.com/question/${selectedQuestionId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      toast.success('Question successfully deleted!', {
        icon: '🗑️',
        theme,
      });
      await fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = answers.map((answer, i) => (i === index ? value : answer));
    setAnswers(updatedAnswers);
  };

  const handleEditQuestion = (question) => {
    setSelectedQuestion(question);
    setQuestionText(question.question_text);
    setPoints(question.points);
    setAnswers(question.incorrect_answer_list);
    setCorrectAnswer(question.correct_answer);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (correctAnswer === '') {
      alert('Please enter the correct answer.');
      return;
    }

    const questionData = {
      question_text: questionText,
      incorrect_answer_list: answers,
      correct_answer: correctAnswer,
      points: parseInt(points, 10),
      quiz_id: quizId,
    };
    saveQuestion(questionData);
  };

  const resetForm = () => {
    setQuestionText('');
    setAnswers(['', '', '', '']);
    setCorrectAnswer('');
    setPoints(0);
    setSelectedQuestion(null);
  };

  const containerStyle = {
    padding: '20px',
    fontFamily: 'Roboto, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const formContainerStyle = {
    marginBottom: '20px',
    border: '1px solid #ddd',
    padding: '20px',
    borderRadius: '8px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '10px',
    fontSize: '20px', // Increase font size
    marginLeft: '20px',
  };

  const inputStyle = {
    marginBottom: '15px',
    width: '100%',
  };

  const questionsContainerStyle = {
    marginTop: '20px',
  };

  const questionItemStyle = {
    marginBottom: '20px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
  };

  const newButtonStyle = {
    margin: '10px',
  };

  return (
    <Main>
      <Box style={containerStyle}>
        <Typography
          style={{
            marginBottom: '20px',
            marginLeft: '20px',
            fontFamily: 'Roboto, sans-serif',
            fontSize: '30px',
          }}
          variant={'h4'}
        >
          Quiz Dashboard
        </Typography>
        <form onSubmit={handleSubmit} style={formContainerStyle}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <label>
                Question Text:
                <TextField
                  variant="outlined"
                  type="text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required
                  fullWidth
                  InputProps={{
                    style: { fontSize: '16px' },
                  }}
                  style={inputStyle}
                />
              </label>
            </Grid>
            <Grid item xs={12} sm={6}>
              <label>
                Points:
                <TextField
                  variant="outlined"
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(Number(e.target.value))}
                  required
                  fullWidth
                  InputProps={{
                    style: { fontSize: '16px' },
                  }}
                  style={inputStyle}
                />
              </label>
            </Grid>
            <Grid item xs={12} sm={6}>
              <label>
                Correct Answer:
                <TextField
                  variant="outlined"
                  type="text"
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  required
                  fullWidth
                  InputProps={{
                    style: { fontSize: '16px' },
                  }}
                  style={inputStyle}
                />
              </label>
            </Grid>
            <Grid item xs={12} sm={6}>
              <label>
                Incorrect Answer 1:
                <TextField
                  variant="outlined"
                  type="text"
                  value={answers[0]}
                  onChange={(e) => handleAnswerChange(0, e.target.value)}
                  required
                  fullWidth
                  InputProps={{
                    style: { fontSize: '16px' },
                  }}
                  style={inputStyle}
                />
              </label>
            </Grid>
            <Grid item xs={12} sm={6}>
              <label>
                Incorrect Answer 2:
                <TextField
                  variant="outlined"
                  type="text"
                  value={answers[1]}
                  onChange={(e) => handleAnswerChange(1, e.target.value)}
                  required
                  fullWidth
                  InputProps={{
                    style: { fontSize: '16px' },
                  }}
                  style={inputStyle}
                />
              </label>
            </Grid>
            <Grid item xs={12} sm={6}>
              <label>
                Incorrect Answer 3:
                <TextField
                  variant="outlined"
                  type="text"
                  value={answers[2]}
                  onChange={(e) => handleAnswerChange(2, e.target.value)}
                  required
                  fullWidth
                  InputProps={{
                    style: { fontSize: '16px' },
                  }}
                  style={inputStyle}
                />
              </label>
            </Grid>
          </Grid>
          <div>
            <Button size={'large'} variant={'contained'} style={newButtonStyle} type={'submit'}>
              Save Question
            </Button>
            <Button size={'large'} variant={'contained'} style={newButtonStyle} onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </form>
        <div style={questionsContainerStyle}>
          {questions.map((question, index) => (
            <div key={question.id} style={questionItemStyle}>
              <h3 style={labelStyle}>
                Question {index + 1}: {question.question_text}
              </h3>
              <p style={labelStyle}>Points: {question.points}</p>
              <p style={labelStyle}>Correct Answer: {question.correct_answer}</p>
              <p style={labelStyle}>Incorrect Answers: {question.incorrect_answer_list.join(', ')}</p>
              <Button
                size={'large'}
                variant={'contained'}
                style={newButtonStyle}
                onClick={() => handleEditQuestion(question)}
              >
                Edit
              </Button>
              <Button
                size={'large'}
                variant={'contained'}
                style={newButtonStyle}
                onClick={() => handleOpen(question.id)}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{'Confirm Deletion'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this question?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={deleteQuestion} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Main>
  );
}

export default EditQuizView;
