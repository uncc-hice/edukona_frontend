import React, { useEffect } from 'react';
import { Grid, Typography, styled } from '@mui/material';
import AnswerOption from './AnswerOption';

const ResponseLine = styled('div')(({ theme, width }) => ({
  height: '4px',
  backgroundColor: theme.palette.primary.main,
  width: `${width}%`,
  transition: 'width 0.3s ease-in-out',
  margin: '0 auto 10px', // Center the line and add space below before the answer
}));

const StyledCountText = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: '8px', // Space below the count before the answer option
}));

const AnswersGrid = ({
  liveBarChart,
  sendMessage,
  answers,
  responseData,
  toggleHighlight,
  correctAnswer,
  incorrectAnswers,
}) => {
  const totalResponses = responseData.total_responses;

  useEffect(() => {
    // Send an update order message when answers or their order changes
    sendMessage(
      JSON.stringify({
        type: 'update_order',
        order: answers,
      })
    );
  }, [answers, sendMessage]);

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      {answers.map((answer, index) => {
        const count = responseData?.answers?.[answer] || 0;
        const width = totalResponses > 0 ? (count / totalResponses) * 100 : 0;
        const highlight = toggleHighlight ? (correctAnswer === answer ? 'correct' : 'incorrect') : 'base';
        let feedback = '';
        console.log('feedback1', incorrectAnswers[index]);
        if (highlight === 'incorrect') {
          if (incorrectAnswers[index] && incorrectAnswers[index]['feedback']) {
            feedback = incorrectAnswers[index]['feedback'];
          } else {
            feedback = ''; // No feedback available
          }
        }

        return (
          <Grid item xs={12} sm={6} key={index}>
            {liveBarChart && (
              <>
                <ResponseLine width={width} />
                <StyledCountText variant="body2">{`Responses: ${count}`}</StyledCountText>
              </>
            )}
            <AnswerOption answer={answer} index={index} highlight={highlight} feedback={feedback} />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default AnswersGrid;
