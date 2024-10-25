import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Main from '../../../layouts/Main/Main';
import Page from '../Components/Page/Page';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const General = () => {
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
  });

  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const generalResponse = await axios.get('https://api.edukona.com/profile', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });
        if (generalResponse.status === 200) {
          const { first_name, last_name, username, email } = generalResponse.data;
          setUserData({ first_name, last_name, username, email });
        }
      } catch (error) {
        console.error("Failed to gather the user's information.", error);
        if (error.response.status === 401) {
          navigate('https://api.edukona.com');
        }
      }
    };
    fetchData();
  }, [token, navigate]);

  return (
    <Main>
      <Page>
        <Typography variant="h6" gutterBottom fontWeight={700}>
          View your private information
        </Typography>
        <Box paddingY={4}>
          <Divider />
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            First Name: {userData?.first_name || ''}
          </Grid>
          <Grid item xs={12} sm={6}>
            Last Name: {userData?.last_name || ''}
          </Grid>
          <Grid item xs={12} sm={6}>
            Username: {userData?.username || ''}
          </Grid>
          <Grid item xs={12} sm={6}>
            Email: {userData?.email || ''}
          </Grid>
        </Grid>
      </Page>
    </Main>
  );
};

export default General;
