import { FC, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Typography,
  Table,
  TableBody,
} from '@mui/material';
import QuizListRow from '../../../blocks/QuizListRow';
// Import your API helper that handles auth internally (e.g., via interceptors or default headers)
import { fetchQuizzesByRecording } from '../../../services/apiService';

interface Quiz {
  id: string;
  // ... other quiz properties
}

interface AccordionQuizzesProps {
  recordingId: string;
  expanded: boolean;
}

const AccordionQuizzes: FC<AccordionQuizzesProps> = ({ recordingId, expanded }) => {
  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFetchQuizzes = () =>
    fetchQuizzesByRecording(recordingId)
      .then((res) => {
        setQuizzes(res.data);
      })
      .catch((error) => {
        console.error('Error fetching quizzes:', error);
      })
      .finally(() => {
        setLoading(false);
      });

  useEffect(() => {
    // If the accordion isn't expanded, don't do anything
    if (!expanded) return;

    // Only fetch quizzes the first time the accordion is expanded
    if (quizzes === null) {
      setLoading(true);
      handleFetchQuizzes();
    }
  }, [expanded, quizzes, recordingId]);

  return (
    <Accordion expanded={expanded} sx={{ boxShadow: 'none' }}>
      <AccordionSummary sx={{ padding: 0 }}>
        <Typography variant="subtitle1" sx={{ ml: 1 }}>
          Quizzes
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        {loading ? (
          <CircularProgress />
        ) : !quizzes || quizzes.length === 0 ? (
          <Typography>No quizzes available</Typography>
        ) : (
          <Table>
            <TableBody>
              {quizzes.map((quiz) => (
                <QuizListRow key={quiz.id} quiz={quiz} onUpdate={handleFetchQuizzes} />
              ))}
            </TableBody>
          </Table>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default AccordionQuizzes;
