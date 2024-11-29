import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Navbar from '../blocks/Navbar';
import { createQuiz } from '../services/apiService';

function CreateQuiz() {
  const [quizName, setQuizName] = useState('');
  const [webSocket, setWebSocket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (webSocket) {
        webSocket.close();
      }
    };
  }, [webSocket]);

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

    try {
      const now = new Date().toISOString();
      const quizData = {
        title: quizName,
        created_at: now,
        start_time: now,
        end_time: now,
        live_bar_chart: true,
        timer: false,
        timer_duration: 60,
        skip_question: false,
        skip_count_per_student: 0,
        skip_question_logic: 'disabled',
        skip_question_streak_count: 0,
      };
      const socket_url = `wss://api.edukona.com/ws/recordings/?token=${token}`;
      const socket = new WebSocket(socket_url);
      setWebSocket(socket);

      socket.onopen = () => {
        console.log('Websocket connection opened.');
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Message received', message);

        if (message.type === 'quiz_creation_completed' && message.quiz_creation_status === 'Completed') {
          createQuiz(quizData).then((response) => {
            const quizId = response.data.quiz_id;
            navigate(`/quiz/${quizId}/edit`);
          });
        }
      };

      socket.onerror = (event) => {
        console.error('Failed to create quiz:', event);
      };

      socket.onclose = () => {
        console.log('Websocket connection closed');
      };
    } catch (error) {
      console.error('Failed to create quiz:', error);
      alert('Failed to parse websocket message.');
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
