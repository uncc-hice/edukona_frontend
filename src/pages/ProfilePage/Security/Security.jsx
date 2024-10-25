import React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Main from '../../../layouts/Main/Main';
import Page from '../Components/Page/Page';

const Security = () => {
  return (
    <Main>
      <Page>
        <Box
          display={'flex'}
          flexDirection={{ xs: 'column', md: 'row' }}
          justifyContent={'space-between'}
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          <Typography variant="h6" fontWeight={700}>
            Click below to delete your account. Please note this action is permanent.
          </Typography>
        </Box>
        <Box paddingY={4}>
          <Divider />
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Button size={'large'} variant={'contained'} type={'submit'}>
              Delete Account
            </Button>
          </Grid>
        </Grid>
      </Page>
    </Main>
  );
};

export default Security;
