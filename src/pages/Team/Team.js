import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ListItemText from '@mui/material/ListItemText';
import CardMedia from '@mui/material/CardMedia';
import Container from '../../components/Container';
import Main from '../../layouts/Main';
import Overview from './components/Overview';
import Divider from '@mui/material/Divider';

const mock = [
  {
    name: 'Ayman Hajja',
    title: 'Lead Developer and Professor at UNC Charlotte',
    avatar: 'https://placehold.co/600x400',
    desc: '',
  },
  {
    name: 'Aryan Aladar',
    title: 'Lead Developer and Student at UNC Chapel Hill',
    avatar: 'https://placehold.co/600x400',
    desc: '',
  },
  {
    name: 'Austin Hunter',
    title: 'Full-Stack Developer and Student at UNC Charlotte',
    avatar: 'https://placehold.co/600x400',
    desc: '',
  },
  {
    name: 'Andrew Praskala',
    title: 'Full-Stack Developer and Student at UNC Charlotte',
    avatar: 'https://placehold.co/600x400',
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
            {/* Image section */}
            <Box
              component={CardMedia}
              sx={{
                borderRadius: 2,
                width: { xs: '100%', md: '40%' },
                height: { xs: '300px', md: '400px' },
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundImage: `url(${item.avatar})`,
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
