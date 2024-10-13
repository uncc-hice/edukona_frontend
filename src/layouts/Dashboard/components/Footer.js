import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const Footer = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          width={1}
          flexDirection={{ xs: 'column', sm: 'row' }}
        >
          <Box
            component="a"
            href="/"
            title="Edukona"
            sx={{
              display: 'flex',
              width: { xs: 120, md: 140 },
              height: { xs: 50, md: 60 },
              overflow: 'hidden',
            }}
          >
            <Box
              component="img"
              src="https://elasticbeanstalk-us-west-2-730335402099.s3.us-west-2.amazonaws.com/hice_frontend/EdukonaLog.svg"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          </Box>
          <Box display={'flex'} alignItems={'center'}>
            <Box>
              <Link variant={'body2'} underline="none" component="a" href="/" color="text.primary">
                Home
              </Link>
            </Box>
            <Box marginLeft={2}>
              <Link variant={'body2'} underline="none" component="a" href="/dashboard" color="text.primary">
                  {/* Changed it from dashboard to quizzes - Jacob P */}
                Quizzes
              </Link>
            </Box>
            <Box marginLeft={2}>
              <Link variant={'body2'} underline="none" component="a" href="/Team/Team" color="text.primary">
                Team
              </Link>
            </Box>
            {/*<Box marginLeft={2}>*/}
            {/*    <Button*/}
            {/*        variant="contained"*/}
            {/*        color="primary"*/}
            {/*        component="a"*/}
            {/*        target="blank"*/}
            {/*        href="#"*/}
            {/*        size="small"*/}
            {/*        startIcon={*/}
            {/*            <svg*/}
            {/*                xmlns="http://www.w3.org/2000/svg"*/}
            {/*                width={20}*/}
            {/*                height={20}*/}
            {/*                viewBox="0 0 20 20"*/}
            {/*                fill="currentColor"*/}
            {/*            >*/}
            {/*                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />*/}
            {/*                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />*/}
            {/*            </svg>*/}
            {/*        }*/}
            {/*    >*/}
            {/*        Conatct us*/}
            {/*    </Button>*/}
            {/*</Box>*/}
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography align={'center'} variant={'subtitle2'} color="text.secondary" gutterBottom>
          &copy; EduKona. 2024. All rights reserved
        </Typography>
        <Typography align={'center'} variant={'caption'} color="text.secondary" component={'p'}>
          When you visit or interact with our sites, services or tools, we or our authorised service providers may use
          cookies for storing information to help provide you with a better, faster and safer experience and for
          marketing purposes.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Footer;
