import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Navbar from '../blocks/Navbar';
import axios from 'axios';

function CreateQuiz() {
  const [quizName, setQuizName] = useState('');
  const navigate = useNavigate();

  const handleQuizNameChange = (event) => {
    setQuizName(event.target.value);
  };

  const saveQuiz = async () => {
    if (!quizName) {
      alert('Please enter a quiz name.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found');
      return;
    }

    const now = new Date().toISOString();
    const quizData = {
      title: quizName,
      created_at: now,
      start_time: now,
      end_time: now,
      settings: {
        live_bar_chart: true,
        timer: false,
        timer_duration: 60,
        skip_question: false,
        skip_count_per_student: 0,
        skip_question_logic: 'disabled',
        skip_question_streak_count: 0,
      },
    };

    try {
      const response = await axios.post('https://api.edukona.com/quiz/', quizData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });
      const quizId = response.data.quiz_id;
      navigate(`/quiz/${quizId}/edit`);
    } catch (error) {
      console.error('Failed to create quiz:', error);
      alert('Failed to create quiz');
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', margin: '20px' }}>
        <TextField
          label="Quiz Name"
          variant="outlined"
          value={quizName}
          onChange={handleQuizNameChange}
          style={{ flexGrow: 1 }}
        />
        <Button variant="contained" color="primary" onClick={saveQuiz} style={{ marginLeft: '10px' }}>
          Create Quiz
        </Button>
      </div>
    </div>
  );
}

export default CreateQuiz;
