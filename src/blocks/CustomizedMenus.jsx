import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';
import QuizIcon from '@mui/icons-material/Quiz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, ' +
      'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, ' +
      'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, ' +
      'rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}));

export default function CustomizedMenus(props) {
  const { recording, handleOpenDialogue, setSelectedRecording, setOpenNewRecording } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation(); // Prevent accordion from toggling
    setAnchorEl(event.currentTarget);
    setSelectedRecording(recording.id); // Set the selected recording ID
  };

  const handleClose = (event) => {
    event.stopPropagation(); // Prevent accordion from toggling
    setAnchorEl(null);
  };

  // Handle menu item actions
  const handleCreateAndStartQuiz = (event) => {
    event.stopPropagation();
    setOpenNewRecording(true);
    handleClose(event);
  };

  const handleDeleteRecording = (event) => {
    event.stopPropagation();
    handleOpenDialogue(recording.id);
    handleClose(event);
  };

  return (
    <div>
      <Button
        id="action-button"
        aria-controls={open ? 'customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Action
      </Button>
      <StyledMenu
        id="customized-menu"
        MenuListProps={{
          'aria-labelledby': 'action-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleCreateAndStartQuiz} disableRipple>
          <QuizIcon />
          Create and Start Quiz
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleDeleteRecording} disableRipple>
          <DeleteIcon />
          Delete Recording
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
