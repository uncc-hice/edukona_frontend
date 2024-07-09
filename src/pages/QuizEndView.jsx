import React from 'react';
import { Typography, Box } from '@mui/material';

const QuizEndView = () => {
    return (
        <Box display="flex" alignItems="center" justifyContent="center" height="100vh" bgcolor="background.default">
            <Typography variant="h2" component="h1" align="center" color="text.primary" gutterBottom>
                Quiz Ended
            </Typography>
        </Box>
    );
};

export default QuizEndView;
