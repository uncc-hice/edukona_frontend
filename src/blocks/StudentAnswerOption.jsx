import React from 'react';
import { ButtonBase, Typography } from '@mui/material';
import { styled } from '@mui/system';

const getColor = (index) => {
  const colors = ['#e91e63', '#9c27b0', '#2196f3', '#00bcd4'];
  return colors[index % colors.length]; // Cycle through colors based on index
};

const StyledButtonBase = styled(ButtonBase)(({ theme, index, selected, submitted }) => ({
  backgroundColor: getColor(index), // Set background color based on index
  textAlign: 'center',
  width: '100%',
  minHeight: '220px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  borderRadius: theme.shape.borderRadius,
  '@media (hover: hover)': {
    '&:hover': {
      opacity: 0.9,
      boxShadow: theme.shadows[4],
    },
  },
  color: theme.palette.getContrastText(getColor(index)),
  ...(!selected &&
    submitted && {
      opacity: 0.3, // Adjust as needed to indicate disabled state visually
      '&:hover, &:active, &:focus, &:focus-within': {
        opacity: 0.3,
      },
    }),
  ...(selected && {
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.4)',
  }),
}));
const StudentAnswerOption = ({ answer, index, onClick, selected, submitted }) => {
  return (
    <StyledButtonBase
      variant="contained"
      onClick={onClick}
      selected={selected}
      submitted={submitted}
      index={index}
      // Adjust color or style if needed based on isSelected
    >
      <Typography variant="h4">{answer}</Typography>
    </StyledButtonBase>
  );
};

export default StudentAnswerOption;
