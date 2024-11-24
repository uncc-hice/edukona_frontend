import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Main from '../../../layouts/Main/Main';
import Page from '../Components/Page/Page';
import { DialogActions, DialogContent, DialogTitle, Dialog } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../../../services/apiService';
import { toast } from 'react-toastify';

const Security = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const handleOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const triggerDeleteAccount = () => {
    setOpenDialog(false);
    deleteUser()
      .then(() => {
        localStorage.clear();
        navigate('/');
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error deleting account: ', error);
        toast.error('Error deleting account');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      });
  };

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
            <Button size={'large'} variant={'contained'} type={'submit'} onClick={handleOpen}>
              Delete Account
            </Button>
            <Dialog open={openDialog} onClose={handleClose}>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogContent>
                Would you like to delete your account? This action is permanent and cannot be undone.
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} autoFocus>
                  Cancel
                </Button>
                <Button onClick={triggerDeleteAccount} color={'error'} variant={'outlined'}>
                  {' '}
                  Delete Account{' '}
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
      </Page>
    </Main>
  );
};

export default Security;
