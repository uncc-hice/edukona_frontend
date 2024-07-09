import React, {useEffect, useState} from 'react';
import Navbar from '../blocks/Navbar';
import QuizList from "../blocks/QuizList";
import Button from '@mui/material/Button'
import axios from "axios";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const InstructorDashBoard = () => {
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        const fetchQuizzes = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log("No token found");
                return;
            }

            try {
                const response = await axios.get('https://api.edukona.com/quiz/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`,
                    },
                });

                const data = response.data;
                setQuizzes(data['quizzes']);
                console.log(data['quizzes']);
            } catch (error) {
                console.error('An error occurred while fetching the quizzes:', error.message);
            }
        };

        fetchQuizzes();
    }, []);

        let navigate = useNavigate();

    const handleCreateQuiz = () => {
        navigate('/create-quiz')
    };
    return (
        <div>
            <Navbar />
            <h1 style={{ textAlign: 'Left', margin: '20px' }}>Your Quizzes</h1>
            <QuizList quizzes={quizzes} />
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/your-sessions">
                    <Button variant="contained" color="primary" size="large" style={{ width: '80%', maxWidth: '1000px', marginBottom: '10px' }}>
                        Your Sessions
                    </Button>
                </Link>
               <Button variant="contained" color="primary" size="large" style={{ width: '80%', maxWidth: '1000px' }}
                   onClick={handleCreateQuiz}>
          Create New Quiz
        </Button>
            </div>
        </div>
    );
};

export default InstructorDashBoard;
