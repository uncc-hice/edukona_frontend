import React from 'react';
import { Typography, ButtonBase } from '@mui/material';
import { styled, keyframes } from '@mui/system';

const correct_answer_color = '#4caf50';
const incorrect_answer_color = '#f44336';

const getColor = (index) => {
  const colors = ['#e91e63', '#9c27b0', '#2196f3', '#00bcd4'];
  return colors[index % colors.length];
};

const popUpAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
`;

const StyledButtonBase = styled(ButtonBase)(({ theme, index, bgcolor, highlight }) => ({
  backgroundColor: bgcolor || getColor(index),
  textAlign: 'center',
  width: '100%',
  minHeight: '220px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  borderRadius: theme.shape.borderRadius,
  transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
  border: '2px solid transparent',
  '&:hover': {
    opacity: 0.9,
    boxShadow: theme.shadows[4],
  },
  color: 'white',
  animation: highlight === 'correct' ? `${popUpAnimation} 0.6s ease-in-out` : 'none',
}));

const ResponseLine = styled('div')(({ theme, width }) => ({
  height: '4px',
  backgroundColor: theme.palette.primary.main,
  width: `${width}%`,
  transition: 'width 0.3s ease-in-out',
}));

const AnswerOption = ({ answer, index, count, totalResponses, highlight, feedback }) => {
  const width = totalResponses > 0 ? (count / totalResponses) * 100 : 0;
  let bgcolor;

  if (highlight === 'correct') {
    bgcolor = correct_answer_color;
  } else if (highlight === 'incorrect') {
    bgcolor = incorrect_answer_color;
  }

  return (
    <StyledButtonBase index={index} bgcolor={bgcolor} highlight={highlight}>
      <ResponseLine width={width} />
      <Typography variant="h4">{answer}</Typography>
      {highlight === 'incorrect' && <Typography variant="body2">{feedback}</Typography>}
    </StyledButtonBase>
  );
};

export default AnswerOption;
