import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Grid, Tabs, Tab } from '@mui/material';
import { signUpInstructor } from '../services/apiService';
import { Link } from 'react-router-dom';
import { Footer } from '../layouts/Main/components';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (formData.password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    signUpInstructor(formData)
      .then(() => navigate('/'))
      .catch((err) => {
        console.error(err.response.data.message);
        toast.error(`Failed to create account: ${err.response.data.message}`);
      });
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
        <form onSubmit={(e) => handleSubmit(e)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <p style={nameStyle}>Enter your First Name</p>
              <TextField
                fullWidth
                id="firstName"
                name="first_name"
                label="First Name"
                variant="outlined"
                value={formData.first_name}
                onChange={(e) => handleFormChange(e)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <p style={nameStyle}>Enter your Last Name</p>
              <TextField
                fullWidth
                id="lastName"
                name="last_name"
                label="Last Name"
                variant="outlined"
                value={formData.last_name}
                onChange={(e) => handleFormChange(e)}
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
                name="email"
                label="Email"
                type="email"
                variant="outlined"
                value={formData.email}
                onChange={(e) => handleFormChange(e)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <p style={otherFields}>Enter your Password</p>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                variant="outlined"
                value={formData.password}
                onChange={(e) => handleFormChange(e)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <p style={otherFields}>Confirm your Password</p>
              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Grid>
            <Grid container item xs={12} spacing={2} sx={{ mt: 2 }} alignItems="center">
              <Grid item xs={12} sm={8}>
                <Typography component="h4" align="left" color="gray" gutterBottom>
                  Already have an account?
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
