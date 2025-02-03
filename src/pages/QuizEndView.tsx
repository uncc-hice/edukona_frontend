import { Typography, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { requestScoring, getScore } from '../services/apiService';

interface QuizEndViewProps {
  student_id: string;
  session_id: string;
}

const QuizEndView = ({ student_id, session_id }: QuizEndViewProps) => {
  const [grade, setGrade] = useState(-1);

  useEffect(() => {
    const fetchScore = async () => {
      await requestScoring(student_id, session_id);
      try {
        const response = await getScore(student_id, session_id);
        setGrade(response.data.score);
      } catch (error) {
        console.error('Error fetching score:', error);
      }
    };

    fetchScore();
  }, [student_id, session_id]);

  return (
    <Box display="flex" alignItems="center" justifyContent="center" height="100vh" bgcolor="background.default">
      <Typography variant="h2" component="h1" align="center" color="text.primary" gutterBottom>
        Quiz Ended
      </Typography>
      {grade !== -1 && (
        <Typography variant="h4" component="h2" align="center" color="text.secondary">
          Your score: {grade}
        </Typography>
      )}
    </Box>
  );
};

export default QuizEndView;
