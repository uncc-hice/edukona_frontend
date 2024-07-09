import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/system';
import { Grid, Typography } from '@mui/material';
import AnswersGrid from './AnswersGrid'; // Import the new component

const QuizComponent = ({liveBarChart, question, code, sendMessage, responseData }) => {
    const theme = useTheme();
    const [shuffledAnswers, setShuffledAnswers] = useState([]);

    // Effect to shuffle answers only when the question changes
    useEffect(() => {
        if (question) {
            const answers = [...question['incorrect_answer_list'], question['correct_answer']];
            const shuffled = answers.sort(() => 0.5 - Math.random()); // Shuffle answers
            setShuffledAnswers(shuffled); // Set shuffled answers to state
        }
    }, [question]); // Dependency on question ensures this runs only when question changes

    return (
        <Grid container spacing={3} direction="column" alignItems="center" justifyContent="center" style={{ padding: theme.spacing(3) }}>
            <Grid item xs={12}>
                <Typography variant="h2" gutterBottom component="div" textAlign="center">
                    {question['question_text']}
                </Typography>
            </Grid>
            {/* Ensure the Grid item that nests AnswersGrid takes full width and centers its content */}
            <Grid item xs={12} container justifyContent="center" alignItems="center">
                <AnswersGrid liveBarChart={liveBarChart} answers={shuffledAnswers} code={code} qid={question['id']} responseData={responseData} sendMessage={sendMessage} />
            </Grid>
        </Grid>
    );
}

export default QuizComponent;
