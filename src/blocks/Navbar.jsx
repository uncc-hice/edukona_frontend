import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const home = () => {
    navigate('/');
  };
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('instructor');
    window.location.reload();
  };

  return (
    <AppBar position="static">
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          EduKona: Bridging Technology and Pedagogy with Adaptive Educational Games
        </Typography>
        <div>
          <Button
            color="inherit"
            onClick={() => home()}
            style={{ textTransform: 'capitalize', fontSize: '16px' }}
          >
            Home
          </Button>
          <Button color="inherit" style={{ textTransform: 'capitalize', fontSize: '16px' }}>
            Profile
          </Button>
          <Button
            color="inherit"
            onClick={() => logout()}
            style={{ textTransform: 'capitalize', fontSize: '16px' }}
          >
            Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
