import React, { useState, useEffect } from 'react';
import { Grid, Button, Paper, Typography, Box } from '@mui/material';
import axios from 'axios';

const QuestionAnswerComponent = ({ question, quizSessionId }) => {
  const { id: questionId, question_text, incorrect_answer_list, correct_answer } = question;
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  // Randomize answers
  const allAnswers = [...incorrect_answer_list, correct_answer].sort(() => Math.random() - 0.5);

  useEffect(() => {
    // Reset states when a new question is received
    setSelectedAnswer('');
    setIsSubmitted(false);
    setIsCorrect(null);
  }, [questionId]); // Dependency array includes questionId to detect changes to the question

  const handleSubmitAnswer = async (answer) => {
    if (isSubmitted) return; // Prevents re-submitting

    let sid = localStorage.getItem('sid');
    if (!sid) {
      console.error('No student ID found');
      return;
    }

    const postData = {
      student: { id: sid }, // Example static ID, adjust as needed
      question_id: questionId,
      quiz_session_id: quizSessionId, // Use passed quizSessionId prop
      selected_answer: answer,
    };

    try {
      const response = await axios.post('https://api.edukona.com/user-response/', postData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSelectedAnswer(answer);
      setIsSubmitted(true);
      setIsCorrect(response.data['is_correct']); // Assuming 'is_correct' is returned from the API
    } catch (error) {
      console.error('An error occurred:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        {question_text}
      </Typography>
      <Grid container spacing={2}>
        {allAnswers.map((answer, index) => (
          <Grid item xs={6} key={index}>
            <Button
              variant="contained"
              color={selectedAnswer === answer ? (isCorrect ? 'success' : 'error') : 'primary'}
              fullWidth
              style={{ height: '100%' }}
              disabled={isSubmitted}
              onClick={() => handleSubmitAnswer(answer)}
            >
              {answer}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default QuestionAnswerComponent;
