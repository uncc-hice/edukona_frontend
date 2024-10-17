import React from 'react';
import { Typography, ButtonBase } from '@mui/material';
import { styled } from '@mui/system';

const getColor = (index) => {
  const colors = ['#e91e63', '#9c27b0', '#2196f3', '#00bcd4'];
  return colors[index % colors.length];
};

const StyledButtonBase = styled(ButtonBase)(({ theme, index }) => ({
  backgroundColor: getColor(index),
  textAlign: 'center',
  width: '100%',
  minHeight: '220px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    opacity: 0.9,
    boxShadow: theme.shadows[4],
  },
  color: theme.palette.getContrastText(getColor(index)),
}));

const ResponseLine = styled('div')(({ theme, width }) => ({
  height: '4px',
  backgroundColor: theme.palette.primary.main,
  width: `${width}%`,
  transition: 'width 0.3s ease-in-out',
}));

const AnswerOption = ({ answer, index, count, totalResponses }) => {
  const width = totalResponses > 0 ? (count / totalResponses) * 100 : 0;

  return (
    <StyledButtonBase index={index}>
      <ResponseLine width={width} />
      <Typography variant="h4">{answer}</Typography>
    </StyledButtonBase>
  );
};

export default AnswerOption;
