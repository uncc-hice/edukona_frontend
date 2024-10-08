import React from 'react';
import { Button, ButtonBase, Typography } from '@mui/material';
import { styled } from '@mui/system';

const getColor = (index) => {
  const colors = ['#e91e63', '#9c27b0', '#2196f3', '#00bcd4'];
  return colors[index % colors.length]; // Cycle through colors based on index
};

const StyledButtonBase = styled(ButtonBase)(({ theme, index, selected }) => ({
  backgroundColor: getColor(index), // Set background color based on index
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
  ...(!selected && {
    color: theme.palette.text.disabled, // Example disabled text color
    opacity: 0.2, // Adjust as needed to indicate disabled state visually
  }),
}));
const StudentAnswerOption = ({ answer, index, onClick, selected }) => {
  return (
    <StyledButtonBase
      variant="contained"
      onClick={onClick}
      selected={selected}
      index={index}
      // Adjust color or style if needed based on isSelected
    >
      <Typography variant="h4">{answer}</Typography>
    </StyledButtonBase>
  );
};

export default StudentAnswerOption;
