import React, { useContext, useState, FormEvent, ChangeEvent } from 'react';
import { TextField, Button, Typography, Container, Grid } from '@mui/material';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../JWTUserContext';
import { Box } from '@mui/system';

interface LoginFormProps {
  signUpRoute: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ signUpRoute }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { login, googleLogin } = useContext(UserContext);

  const styles = {
    error: {
      color: 'red',
      fontWeight: 'bold',
      textAlign: 'center',
    } as React.CSSProperties,
  };

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (response.credential) {
      console.log('Google login success:', response.credential);
      googleLogin(response.credential, null, setError, navigate);
    } else {
      handleGoogleError();
    }
  };

  const handleGoogleError = () => {
    console.log('Google login failed');
    setError('Google Login failed. Please try again.');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with:', { email, password });
    login(email, password, setError, navigate);
  };

  const directToSignUp = () => {
    console.log('Navigating to sign up');
    navigate(signUpRoute);
  };

  return (
    <Container component="main" maxWidth="xs" style={{ height: '100vh' }}>
      <Grid container direction="column" justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
        <div>
          <Typography variant="h4" component="h1" align="center">
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
            {error !== '' && <p style={styles.error}>{error}</p>}
            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
              Login
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Button onClick={directToSignUp} sx={{ mt: 3, mb: 2 }}>
                  Don&lsquo;t have an account? Sign Up
                </Button>
              </Grid>
            </Grid>
          </form>
          <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
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
