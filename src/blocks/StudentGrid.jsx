import React from 'react';
import { Grid, Paper, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { red } from '@mui/material/colors';

const StudentGrid = ({ students, onDelete }) => {
  return (
    <Grid container spacing={2}>
      {students.length > 0 ? (
        students.map((student) => (
          <Grid item xs={12} sm={6} md={4} key={student.id}>
            <Paper
              elevation={3}
              style={{
                padding: '20px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <Typography variant="h6">{student.username}</Typography>
                <Typography>{student.class}</Typography>
              </div>
              <IconButton onClick={() => onDelete(student.id)} style={{ color: red[500] }}>
                <DeleteIcon />
              </IconButton>
            </Paper>
          </Grid>
        ))
      ) : (
        <Typography>No students found.</Typography>
      )}
    </Grid>
  );
};

export default StudentGrid;
