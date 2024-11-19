import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Grid, Tabs, Tab } from '@mui/material';
import { signUp } from './Functions';
import { Link } from 'react-router-dom';
import { Footer } from '../layouts/Main/components';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SignUpForm = ({ toggleForm }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    if (!firstName || !password || !confirmPassword || !email) {
      setError('Please fill in all fields.');
      return false;
    }

    if (password !== confirmPassword) {
      toast('Passwords do not match. Please try again.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    //signUp function imported from Functions.js
    signUp(firstName, lastName, password, email, role);
    navigate('/');
  };

  const nameStyle = {
    marginBottom: '4px',
  };

  const otherFields = {
    marginBottom: '15px',
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Grid container justifyContent="center" style={{ minHeight: '100vh' }} direction="column">
        <Grid style={{ textAlign: 'left' }} item xs={12} sm={8} md={6}>
          <Typography variant="h6" component="h3" align="left" color="gray" gutterBottom>
            Sign Up
          </Typography>
          <Typography style={{ fontWeight: 'bold' }} variant="h4" component="h2" align="left" gutterBottom>
            Create an Account
          </Typography>
          <Typography variant="h6" component="h3" align="left" color="gray" gutterBottom>
            Fill out the form to get started
          </Typography>
          {error && (
            <Typography variant="body2" color="error" align="left">
              {error}
            </Typography>
          )}
        </Grid>
        {/* Added first name and last name input boxes here */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <p style={nameStyle}>Enter your First Name</p>
              <TextField
                fullWidth
                id="firstName"
                label="First Name *"
                variant="outlined"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <p style={nameStyle}>Enter your Last Name</p>
              <TextField
                fullWidth
                id="lastName"
                label="Last Name"
                variant="outlined"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4} sx={{ pl: { sm: 1 } }}>
              <p style={nameStyle}>Select your Role</p>
              <Tabs variant="fullWidth" value={role} onChange={(e, newValue) => setRole(newValue)} centered>
                <Tab label="Instructor" value="instructor" />
                <Tab label="Student" value="student" />
              </Tabs>
            </Grid>
            <Grid item xs={12}>
              <p style={otherFields}>Enter your Email</p>
              <TextField
                fullWidth
                id="email"
                label="Email *"
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <p style={otherFields}>Enter your Password</p>
              <TextField
                fullWidth
                id="password"
                label="Password *"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <p style={otherFields}>Confirm your Password</p>
              <TextField
                fullWidth
                id="confirmPassword"
                label="Confirm Password *"
                type="password"
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Grid>
            <Grid container item xs={12} spacing={2} sx={{ mt: 2 }} alignItems="center">
              <Grid item xs={12} sm={8}>
                <Typography component="h4" align="left" color="gray" gutterBottom>
                  Already have an account?{' '}
                  <Link
                    to="https://edukona.com/login"
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
              <Grid item xs={12} sm={4}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ fontWeight: 'bold', minWidth: '100px' }}
                >
                  Sign Up
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
        <Typography component="h4" align="center" color="gray" gutterBottom sx={{ mt: 2 }}>
          By clicking "Sign up" button you agree with our{' '}
          <Link to="https://edukona.com/terms-of-use" style={{ textDecoration: 'none', color: 'blue' }}>
            company terms and conditions
          </Link>
          .
        </Typography>
        <Footer />
      </Grid>
    </Container>
  );
};

export default SignUpForm;
