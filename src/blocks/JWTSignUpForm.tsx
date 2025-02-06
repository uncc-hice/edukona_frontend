import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Button,
  Link,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardContent,
  Divider,
} from '@mui/material';

const SignUpForm = () => {
  const [role, setRole] = useState('');

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole((event.target as HTMLInputElement).value);
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
                      <Button variant="contained" color="secondary" fullWidth sx={{ maxWidth: '300px' }}>
                        Sign Up With Google
                      </Button>
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
      </Grid>
    </Container>
  );
};

export default SignUpForm;
