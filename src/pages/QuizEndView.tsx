import { Typography, Box, Divider, CircularProgress, Fade } from '@mui/material';

interface GradingResponse {
  grade: number;
  question_count: number;
  skipped: number;
}

interface QuizEndViewProps {
  gradingStatus: string;
  gradingResponse: GradingResponse;
}

const QuizEndView = ({ gradingStatus, gradingResponse }: QuizEndViewProps) => {
  const { grade, question_count, skipped } = gradingResponse;
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
      <Fade in={gradingStatus === 'started'} unmountOnExit>
        <Box display="flex" alignItems="center" justifyContent="center">
          <CircularProgress size={24} />
        </Box>
      </Fade>
      <Divider sx={{ width: '50%', marginY: 2 }} />
      <Fade in={gradingStatus === 'completed'} unmountOnExit>
        <Box display="flex" flexDirection="column" alignItems="center">
          {grade !== -1 && (
            <Typography variant="h4" component="h2" align="center" color="text.secondary" marginTop={2}>
              Your Score: {grade} / {question_count - skipped}
            </Typography>
          )}
          {skipped > 0 && (
            <Typography variant="body1" component="p" align="center" color="text.secondary" marginTop={1}>
              Skipped: {skipped}
            </Typography>
          )}
          <Box marginTop={2}>
            <Typography variant="body1" component="p" align="center" color="text.secondary" fontStyle={'italic'}>
              Thank you for participating!
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
};

export default QuizEndView;
