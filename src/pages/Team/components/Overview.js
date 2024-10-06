import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ListItemText from '@mui/material/ListItemText';
import CardMedia from '@mui/material/CardMedia';
import { Link as ScrollLink } from 'react-scroll'; // For smooth scrolling

import Container from '../../../components/Container';

const Overview = ({ mock }) => {
  const handleCardClick = (i) => {
    const targetId = `team-member-${i}`;
    document.getElementById(targetId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  return (
    <Container>
      <Box>
        <Box marginBottom={4}>
          <Typography
            sx={{
              textTransform: 'uppercase',
            }}
            gutterBottom
            color={'text.secondary'}
            align={'center'}
            fontWeight={700}
          >
            Our team
          </Typography>
          <Typography fontWeight={700} variant={'h4'} align={'center'}>
            Pioneering minds advancing knowledge through collaboration.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {mock.map((item, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card
                onClick={() => handleCardClick(i)}
                sx={{
                  boxShadow: 0,
                  background: 'transparent',
                  backgroundImage: 'none',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 4,
                    cursor: 'pointer',
                  },
                }}
              >
                <Box component={CardMedia} borderRadius={2} width={1} height={1} minHeight={320} image={item.avatar} />
                <Box component={CardContent} bgcolor={'transparent'} marginTop={-5}>
                  <Box component={Card}>
                    <CardContent>
                      <ListItemText primary={item.name} secondary={item.title} />
                    </CardContent>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Learn more section with arrow */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 4,
          }}
        >
          <ScrollLink to="team-section" smooth={true}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6" fontWeight={700} color="primary">
                Learn more about us
              </Typography>
              <Box component="span" sx={{ fontSize: '2rem', color: 'primary.main' }}>
                ↓
              </Box>
            </Box>
          </ScrollLink>
        </Box>
      </Box>
    </Container>
  );
};

export default Overview;
