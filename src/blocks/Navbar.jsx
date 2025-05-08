import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { useContext } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const { logout: contextLogout } = useContext(UserContext);

  const home = () => {
    navigate('/');
  };
  const logout = () => {
    contextLogout();
  };

  return (
    <AppBar position="static">
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          EduKona: Bridging Technology and Pedagogy with Adaptive Educational Games
        </Typography>
        <div>
          <Button color="inherit" onClick={() => home()} style={{ textTransform: 'capitalize', fontSize: '16px' }}>
            Home
          </Button>
          <Button color="inherit" style={{ textTransform: 'capitalize', fontSize: '16px' }}>
            Profile
          </Button>
          <Button color="inherit" onClick={() => logout()} style={{ textTransform: 'capitalize', fontSize: '16px' }}>
            Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
