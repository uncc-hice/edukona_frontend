import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ListItemText from '@mui/material/ListItemText';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import Container from '../../components/Container';
import Main from '../../layouts/Main';
import Overview from './components/Overview';

const mock = [
  {
    name: 'Ayman Hajja',
    title: 'Principal Investigator and Chief Engineer',
    avatar: 'https://elasticbeanstalk-us-west-2-730335402099.s3.us-west-2.amazonaws.com/hice_frontend/Ayman.jpeg',
    desc: '',
  },
  {
    name: 'Aryan Aladar',
    title: 'Senior Research Assistant and Senior Developer',
    avatar: 'https://elasticbeanstalk-us-west-2-730335402099.s3.us-west-2.amazonaws.com/hice_frontend/Aryan.JPG',
    desc: '',
  },
  {
    name: 'Austin Hunter',
    title: 'Research Assistant and Developer',
    avatar: 'https://elasticbeanstalk-us-west-2-730335402099.s3.us-west-2.amazonaws.com/hice_frontend/Austin.jpg',
    desc: '',
  },
  {
    name: 'Andrew Praskala',
    title: 'Project Contributor',
    avatar: 'https://elasticbeanstalk-us-west-2-730335402099.s3.us-west-2.amazonaws.com/hice_frontend/andrew.jpg',
    desc: '',
  },
];

const Team = () => {
  return (
    <Main>
      <Overview mock={mock} />
      <Divider
        sx={{
          marginY: 4, // Adds vertical spacing (top and bottom) around the divider
          borderWidth: 2, // Makes the divider slightly thicker
          width: '60%', // Adjusts the width of the divider
          marginX: 'auto', // Centers the divider horizontally
        }}
      />
      <Container id="team-section">
        {mock.map((item, i) => (
          <Box
            key={i}
            id={`team-member-${i}`} // Unique id for each team member
            sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column',
                md: i % 2 === 0 ? 'row' : 'row-reverse', // Flip for odd-indexed items
              },
              alignItems: 'center',
              marginBottom: '40px',
              padding: '20px',
              bgcolor: i % 2 === 0 ? 'background.default' : 'background.paper', // Alternate background
            }}
          >
            {/* Image section with lazy loading */}
            <CardMedia
              component="img"
              image={item.avatar}
              loading="lazy"
              sx={{
                borderRadius: 2,
                width: { xs: '100%', md: '40%' },
                height: { xs: '300px', md: '400px' },
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />

            {/* Text Content Section */}
            <Box
              sx={{
                width: { xs: '100%', md: '60%' },
                padding: { xs: '20px 0', md: '0 20px' },
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', md: 'flex-start' },
              }}
            >
              <Card sx={{ width: '100%' }}>
                <CardContent>
                  <ListItemText
                    primary={
                      <Typography variant="h5" fontWeight={700}>
                        {item.name}
                      </Typography>
                    }
                    secondary={
                      <Typography color="text.secondary" variant="subtitle1">
                        {item.title}
                      </Typography>
                    }
                  />
                </CardContent>
              </Card>
            </Box>
          </Box>
        ))}
      </Container>
    </Main>
  );
};

export default Team;
