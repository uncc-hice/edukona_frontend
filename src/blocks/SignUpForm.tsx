import {
  Card,
  CardContent,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  Link,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const SignUpForm = () => {
  const [role, setRole] = useState('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { googleLogin } = useContext(UserContext);

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole((event.target as HTMLInputElement).value);
  };

  const handleGoogleError = () => {
    console.log('Google login failed');
    setError('Google Login failed. Please try again.');
  };

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (response.credential) {
      console.log('Google login success:', response.credential);
      googleLogin(response.credential, role, setError, navigate);
    } else {
      handleGoogleError();
    }
  };

  const styles = {
    error: {
      color: 'red',
      fontWeight: 'bold',
      textAlign: 'center',
    } as React.CSSProperties,
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
    >
      <Grid container spacing={2}>
        <Card sx={{ width: '100%' }}>
          <CardContent>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h5" align="center" gutterBottom>
                    Sign Up
                  </Typography>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <RadioGroup row value={role} onChange={handleRoleChange} sx={{ justifyContent: 'center' }}>
                    <FormControlLabel value="student" control={<Radio />} label="I'm a student/TA" />
                    <FormControlLabel value="instructor" control={<Radio />} label="I'm an instructor" />
                  </RadioGroup>
                </Grid>
                {role && (
                  <Grid item xs={12}>
                    <Grid container justifyContent="center">
                      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
                        <Box display="flex" justifyContent="center">
                          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
                        </Box>
                      </GoogleOAuthProvider>
                      <Typography component="h4" align="center" color="gray" gutterBottom sx={{ mt: 2 }}>
                        By clicking the &quot;Sign up&quot; button you agree with our{' '}
                        <Link
                          component="a"
                          href="https://edukona.com/terms-of-use"
                          style={{ textDecoration: 'none', color: 'blue' }}
                        >
                          company terms and conditions
                        </Link>
                        .
                      </Typography>
                    </Grid>
                  </Grid>
                )}
                <Grid item xs={12}></Grid>
                <Grid item xs={12}>
                  <Typography align="center">
                    Already have an account?{' '}
                    <Link
                      component="a"
                      href="https://edukona.com/login"
                      style={{
                        textDecoration: 'none',
                        color: 'blue',
                        marginBottom: '15px',
                      }}
                    >
                      Login
                    </Link>
                    .
                  </Typography>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
        {error !== '' && (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <p style={styles.error}>{error}</p>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default SignUpForm;
