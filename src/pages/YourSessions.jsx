import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const YourSessions = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('user');
    if (userId) {
      const fetchSessions = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`https://api.edukona.com/quiz-sessions-list/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
          setSessions(response.data.quiz_sessions);
        } catch (error) {
          console.error('Failed to fetch sessions:', error);
        }
      };

      fetchSessions();
    } else {
      console.error('User ID is undefined');
    }
  }, []);

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Your Quiz Sessions
      </Typography>
      <List>
        {sessions.map((session) => (
          <ListItem key={session.quiz_session_id} divider>
            <ListItemText
              primary={session.quiz_name}
              secondary={`Start Time: ${formatDateTime(session.start_time)}`}
            />
            <Link to={`/results/${session.code}`} style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="primary">
                View Results
              </Button>
            </Link>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default YourSessions;
