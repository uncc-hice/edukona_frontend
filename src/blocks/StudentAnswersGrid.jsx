import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Box, Typography } from '@mui/material';
import StudentAnswerOption from "./StudentAnswerOption";

const StudentAnswersGrid = ({ answers, question, code, sendMessage, setIsSubmitted, isSubmitted, quizSession }) => {
    const { id: questionId, question_text, incorrect_answer_list, correct_answer } = question;
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const sid = localStorage.getItem('sid');

    useEffect(() => {
        // Check if there's a stored submission state for the current question
        const storedSubmission = localStorage.getItem(`submitted_${questionId}_${code}_${sid}`);
        if (storedSubmission) {
            setSelectedAnswer(storedSubmission);
            setIsSubmitted(true);
        }
    }, [questionId, setIsSubmitted, code, sid]);

    const handleSubmitAnswer = async (answer) => {
        if (isSubmitted) return; // Prevents re-submitting if already submitted


        if (!sid) {
            console.error('No student ID found');
            return;
        }

        console.log("Submitting answer for questionId: ", questionId);
        const postData = {
            student: { id: sid },
            question_id: questionId,
            quiz_session_code: code,
            selected_answer: answer
        };

        try {
            // const response = await axios.post('https://api.edukona.com/user-response/', postData, {
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            // });
            console.log('response data:', postData);
            sendMessage(JSON.stringify({
                'type': 'response',
                'data': postData
            }))

            setSelectedAnswer(answer);
            setIsSubmitted(true);
            localStorage.setItem(`submitted_${questionId}_${code}_${sid}`, answer); // Store the submission state persistently
            // Optionally handle response data like 'is_correct'
        } catch (error) {
            console.error('An error occurred:', error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 404) {
                // Handle specifically 404 error
                setSelectedAnswer(answer);
                setIsSubmitted(true);
                localStorage.setItem(`submitted_${questionId}_${code}`, answer); // Persist submission state even on error
            }
        }
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                {answers.map((answer, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                        <StudentAnswerOption
                            answer={answer}
                            index={index}
                            onClick={() => handleSubmitAnswer(answer)}
                            isSelected={selectedAnswer === answer}
                            isSubmitted={isSubmitted}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default StudentAnswersGrid;
