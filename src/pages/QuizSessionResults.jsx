import React, { useEffect, useState } from 'react';
import QuizResults from '../blocks/QuizResults';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import Dashboard from '../layouts/Dashboard/Dashboard';
import { fetchResults } from '../services/apiService';

const QuizSessionResults = () => {
  const { code } = useParams();
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (code) {
      fetchResults(code).then((data) => {
        setResults(data);
      });
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
