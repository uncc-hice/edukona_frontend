import axios from 'axios';
import { useState } from "react";
import { TextField, Button, Typography, Container, Grid } from '@mui/material';
import { login, consumeFlash } from './Functions'
import { useNavigate } from 'react-router-dom';
import FlashMessageText from './FlashMessageText';


const LoginForm = ({ toggleForm }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    login(username, password, navigate);
  };

  return (
      <Container component="main" maxWidth="xs" style={{ height: '100vh' }}>
        <Grid
            container
            direction="column"
            justifyContent="center" // This centers the form vertically
            alignItems="center"    // This centers the form horizontally
            style={{ minHeight: '100vh' }}
        >
          <div>
            <Typography variant="h4" component="h1" align="center">
              Login
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
			<FlashMessageText flashName="loginFlash" />
              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>
              <Grid container justifyContent="center">
                <Grid item>
                  <Button onClick={toggleForm} sx={{ mt: 3, mb: 2 }}>
                    Don't have an account? Sign Up
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        </Grid>
      </Container>
  );
};

export default LoginForm;
