import React, { useEffect } from 'react';
import { Grid, Typography, styled } from '@mui/material';
import AnswerOption from './AnswerOption';

const ResponseLine = styled('div')(({ theme, width }) => ({
    height: '4px',
    backgroundColor: theme.palette.primary.main,
    width: `${width}%`,
    transition: 'width 0.3s ease-in-out',
    margin: '0 auto 10px'  // Center the line and add space below before the answer
}));

const StyledCountText = styled(Typography)(({ theme }) => ({
    textAlign: 'center',
    marginBottom: '8px'  // Space below the count before the answer option
}));

const AnswersGrid = ({ liveBarChart,sendMessage, answers, responseData = {} }) => {
    // Calculate total responses by summing values in responseData
    const totalResponses = Object.values(responseData).reduce((sum, count) => sum + count, 0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        // Send an update order message when answers or their order changes
        sendMessage(JSON.stringify({
            type: 'update_order',
            order: answers,
        }));
    }, [answers, sendMessage]);

    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            {answers.map((answer, index) => {
                const count = responseData[answer] || 0;
                const width = totalResponses > 0 ? (count / totalResponses * 100) : 0;

                return (
                    <Grid item xs={12} sm={6} key={index}>
                        {liveBarChart && (
                            <>
                                <ResponseLine width={width} />
                                <StyledCountText variant="body2">{`Responses: ${count}`}</StyledCountText>
                            </>
                        )}
                        <AnswerOption
                            answer={answer}
                            index={index}
                        />
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default AnswersGrid;
