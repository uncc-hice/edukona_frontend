import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container } from '@mui/material';

const StudentDashboard = () => {
    const navigate = useNavigate();

    const handleJoinQuiz = () => {
        navigate('/join');
    };

    return (
        <Container component="main" maxWidth="xs" style={{ marginTop: '20vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleJoinQuiz}>
                Join Quiz
            </Button>
        </Container>
    );
};

export default StudentDashboard;
