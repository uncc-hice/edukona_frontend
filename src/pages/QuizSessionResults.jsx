import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QuizResults from '../blocks/QuizResults';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import Dashboard from '../layouts/Dashboard/Dashboard';

const QuizSessionResults = () => {
  const { code } = useParams();
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (code) {
      const fetchResults = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`https://api.edukona.com/quiz-session-results/${code}`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
          setResults(response.data.results);
        } catch (error) {
          console.error('Failed to fetch quiz results:', error);
        }
      };

      fetchResults();
    } else {
      console.error('Quiz session code is undefined');
    }
  }, [code]);

  return (
    <Dashboard>
      <Box margin={'20px'}>
        <Typography variant="h4" gutterBottom>
          Session Results for {code}
        </Typography>
        <QuizResults results={results} />
      </Box>
    </Dashboard>
  );
};

export default QuizSessionResults;
