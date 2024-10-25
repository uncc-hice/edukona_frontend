import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { signUp } from './Functions';

const SignUpForm = ({ toggleForm }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!firstName || !password || !confirmPassword || !email) {
      setError('Please fill in all fields.');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
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
  };

  return (
    <Container maxWidth="sm">
      <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
        <Grid item xs={12} sm={8} md={6}>
          <div>
            <Typography variant="h4" component="h2" align="center" gutterBottom>
              Sign Up
            </Typography>
            {error && (
              <Typography variant="body2" color="error" align="center">
                {error}
              </Typography>
            )}
            {/* Added first name and last name input boxes here */}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                id="firstName"
                label="First Name"
                variant="outlined"
                margin="normal"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                fullWidth
                id="lastName"
                label="Last Name"
                variant="outlined"
                margin="normal"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <TextField
                fullWidth
                id="password"
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                fullWidth
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <TextField
                fullWidth
                id="email"
                label="Email"
                type="email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel id="role-label">Role</InputLabel>
                <Select label="Role" id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="instructor">Instructor</MenuItem>
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
                Sign Up
              </Button>
            </form>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignUpForm;
