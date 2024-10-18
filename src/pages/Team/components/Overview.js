import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ListItemText from '@mui/material/ListItemText';
import CardMedia from '@mui/material/CardMedia';

import IconButton from '@mui/material/IconButton';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter'; // Use TwitterIcon for X
import GitHubIcon from '@mui/icons-material/GitHub'; // Import GitHubIcon

import Container from '../../../components/Container';

const Overview = ({ mock }) => {
  const numberOfItems = mock.length;

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
        <Grid container spacing={2} justifyContent={numberOfItems < 4 ? 'center' : 'flex-start'}>
          {mock.map((item, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card
                sx={{
                  boxShadow: 0,
                  border: '1px solid lightgrey',
                  background: 'transparent',
                  backgroundImage: 'none',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    boxShadow: 3,
                  },
                }}
              >
                <Box
                  component={CardMedia}
                  borderRadius={2}
                  width={1}
                  height={1}
                  minHeight={320}
                  image={item.avatar}
                  sx={{
                    borderBottomRightRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                />
                <Box component={Card}>
                  <CardContent>
                    <ListItemText primary={item.name} secondary={item.title} />
                    {(item.linkedIn || item.x || item.github) && (
                      <Box marginTop={1}>
                        {item.linkedIn && (
                          <IconButton
                            aria-label="LinkedIn"
                            size="small"
                            color="primary"
                            component="a"
                            href={item.linkedIn}
                            target="_blank"
                            rel="noopener"
                          >
                            <LinkedInIcon />
                          </IconButton>
                        )}
                        {item.x && (
                          <IconButton
                            aria-label="X"
                            size="small"
                            color="primary"
                            component="a"
                            href={item.x}
                            target="_blank"
                            rel="noopener"
                          >
                            <TwitterIcon />
                          </IconButton>
                        )}
                        {item.github && (
                          <IconButton
                            aria-label="GitHub"
                            size="small"
                            color="primary"
                            component="a"
                            href={item.github}
                            target="_blank"
                            rel="noopener"
                          >
                            <GitHubIcon />
                          </IconButton>
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Overview;
