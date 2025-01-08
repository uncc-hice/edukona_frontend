/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { alpha, useTheme } from '@mui/material/styles';
import { TextField, Button, Paper, Divider, Stack } from '@mui/material/';
import { submitContactForm } from '../../../../services/apiService';
import { toast } from 'react-toastify';

const Contact = () => {
  const theme = useTheme();

  const submit_form = (event) => {
    event.preventDefault();
    const toast_theme = theme.palette.mode;
    const formData = new FormData(event.target);
    const form = Object.fromEntries(formData.entries());
    submitContactForm(form)
      .then(() => {
        event.target.reset();
        toast.success('Message sent successfully!', { theme: toast_theme });
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed to send message. Please try again.', { theme: toast_theme });
      });
  };

  return (
    <Box
      sx={{
        position: 'relative',
        '&::after': {
          position: 'absolute',
          content: '""',
          width: '40%',
          height: '100%',
          zIndex: 1,
          top: 0,
          right: 0,
          backgroundSize: '18px 18px',
          backgroundImage: `radial-gradient(${alpha(theme.palette.primary.dark, 0.4)} 20%, transparent 20%)`,
          opacity: 0.2,
        },
      }}
    >
      <Box position={'relative'} zIndex={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Grid item xs={12}>
              <Box marginBottom={1}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Get in touch
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Typography variant="h6" color={'text.secondary'}>
                  We'd love to talk about how we can help you.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box marginY={3} marginX={2}>
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="map"
                  marginHeight={0}
                  marginWidth={0}
                  scrolling="no"
                  src="https://maps.google.com/maps?width=100%&height=100%&hl=en&q=Charlotte&ie=UTF8&t=&z=14&iwloc=B&output=embed"
                  style={{
                    minHeight: 300,
                    borderRadius: 8,
                    filter: theme.palette.mode === 'dark' ? 'grayscale(0.5) opacity(0.7)' : 'none',
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6} sm={6}>
              <Typography variant={'body1'} gutterBottom sx={{ fontWeight: 'medium' }}>
                Email us:
              </Typography>
              <Typography variant={'subtitle1'}>edukona.team@gmail.com</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant={'body1'} gutterBottom sx={{ fontWeight: 'medium' }}>
                Address:
              </Typography>
              <Typography variant={'subtitle1'}>9201 University City Blvd, Charlotte, NC 28223</Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} justifyItems="center">
            <Grid item xs={12}>
              <Paper
                elevation={3}
                sx={{
                  maxWidth: 600,
                  bgcolor: 'background.paper',
                  margin: 'auto',
                }}
              >
                <Box
                  component="form"
                  onSubmit={(e) => {
                    submit_form(e);
                  }}
                  p={6}
                  margin={1}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        id="first_name"
                        name="first_name"
                        label="First Name"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth id="last_name" name="last_name" label="Last Name" variant="outlined" />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        id="email"
                        name="email"
                        label="Email"
                        type="email"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        id="message"
                        name="message"
                        label="Message"
                        multiline
                        rows={10}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 2, mb: 2 }}>
                        Submit
                      </Button>
                    </Grid>
                    <Grid item xs={12} textAlign={'center'}>
                      <Stack spacing={2}>
                        <Divider />
                        <Typography variant={'subtitle2'}>We'll get back to you in 1-2 business days.</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Contact;
