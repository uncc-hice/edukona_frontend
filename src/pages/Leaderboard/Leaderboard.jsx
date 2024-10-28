import React from 'react';
import { Container, Paper, Typography, Grid, List, ListItem, ListItemText } from '@mui/material';
import { motion } from 'framer-motion';

// Framer motion animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100 },
  },
};

// Helper function to transform data into a sorted list
const getSortedData = (grades) => {
  const sortedData = [];
  Object.keys(grades)
    .sort((a, b) => b - a)
    .forEach((score) => {
      grades[score].forEach((name) => {
        sortedData.push({ name, score });
      });
    });
  return sortedData;
};

const Leaderboard = ({ grades }) => {
  // Get sorted data and filter entries with score 100
  const sortedData = getSortedData(grades).filter((entry) => entry.score === 100);

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Leaderboard
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        {sortedData.length > 0 ? (
          <List component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
            {sortedData.map((entry, index) => (
              <ListItem
                key={index}
                component={motion.div}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                sx={{
                  backgroundColor: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? '#cd7f32' : 'white',
                  color: index < 3 ? 'black' : 'inherit',
                  mb: 1,
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                <Grid container alignItems="center">
                  <Grid item xs={2}>
                    <Typography variant="h5" fontWeight="bold">
                      {index + 1}
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <ListItemText primary={entry.name} primaryTypographyProps={{ variant: 'h6' }} />
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="h6" fontWeight="bold">
                      {entry.score}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="h6" align="center">
            No entries with a score of 100.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Leaderboard;
