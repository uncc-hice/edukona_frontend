import { Typography, Box, Divider } from '@mui/material';

interface QuizEndViewProps {
  grading: string;
  score: number;
}

const QuizEndView = ({ grading, score }: QuizEndViewProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="background.default"
    >
      <Typography variant="h2" component="h1" align="center" color="text.primary" gutterBottom>
        🎉 Quiz Ended 🎉
      </Typography>
      <Typography variant="h6" component="h2" align="center" color="text.secondary" fontStyle="italic">
        {grading === 'started'
          ? 'Grading in progress...'
          : grading === 'completed'
            ? 'Grading complete!'
            : 'Quiz ended.'}
      </Typography>
      <Divider sx={{ width: '50%', marginY: 2 }} />
      {score !== -1 && (
        <Typography variant="h4" component="h2" align="center" color="text.secondary" marginTop={2}>
          Your Score: {score}
        </Typography>
      )}
    </Box>
  );
};

export default QuizEndView;
