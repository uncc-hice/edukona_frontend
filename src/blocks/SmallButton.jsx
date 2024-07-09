import React from 'react';
import Button from '@mui/material/Button';

const SmallButton = ({ label, onClick }) => {
  const buttonStyles = {
    backgroundColor: 'green',
    color: 'white',
  };

  return (
    <Button style={buttonStyles} size="small" onClick={onClick}>
      {label}
    </Button>
  );
};

export default SmallButton;
