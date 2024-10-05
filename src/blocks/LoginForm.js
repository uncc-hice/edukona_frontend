import { useContext, useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Grid } from '@mui/material';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { Box } from '@mui/system';
import axios from 'axios';

const LoginForm = ({ toggleForm }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, setIsLoggedIn, setToken } = useContext(UserContext);

  const styles = {
    error: {
      color: 'red',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  };

  const handleGoogleSuccess = async (response) => {
    const axiosUrl = 'https://api.edukona.com/auth/google/';
    console.log('Google Login success:', response);
    const { credential } = response;
    try {
      // Send the Google ID token to your backend for verification and token issuance
      const res = await axios.post(axiosUrl, { token: credential });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', res.data.user);

      setIsLoggedIn(true);
      setToken(res.data.token);

      navigate('/dashboard');
    } catch (error) {
      console.error('Google Login error:', error);
      // Extract and set the specific error message from the backend
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Google Login failed. Please try again.');
      }
    }
  };

  // Handle Google Sign-In failure
  const handleGoogleError = () => {
    setError('Google Login failed. Please try again.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(username, password, setError, navigate);
  };

  return (
    <Container component="main" maxWidth="xs" style={{ height: '100vh' }}>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
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
            {error !== '' && <p style={styles.error}>{error}</p>}
            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
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
          {/* Google Login Button */}
          <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <Box display="flex" justifyContent="center">
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
            </Box>
          </GoogleOAuthProvider>
        </div>
      </Grid>
    </Container>
  );
};

export default LoginForm;
