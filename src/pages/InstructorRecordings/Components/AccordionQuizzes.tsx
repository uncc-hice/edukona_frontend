import React, { FC, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Typography,
  Table,
  TableBody,
} from '@mui/material';
import axios from 'axios';
import QuizListRow from '../../../blocks/QuizListRow';

interface Quiz {
  id: string;
}

interface AccordionQuizzesProps {
  recordingId: string;
  token: string;
  expanded: boolean;
  onChange: (event: React.SyntheticEvent, isExpanded: boolean) => void;
}

const AccordionQuizzes: FC<AccordionQuizzesProps> = ({
  recordingId,
  token,
  expanded,
  onChange,
}) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);

  useEffect(() => {
    if (expanded && !loadedOnce) {
      setLoading(true);
      axios
        .get(`https://api.edukona.com/recordings/${recordingId}/quizzes`, {
          headers: { Authorization: `Token ${token}` },
        })
        .then((res) => {
          setQuizzes(res.data);
          setLoadedOnce(true);
        })
        .catch((error) => {
          console.error('Error fetching quizzes:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [expanded, loadedOnce, recordingId, token]);

  return (
    <Accordion expanded={expanded} onChange={onChange} sx={{ boxShadow: 'none' }}>
      <AccordionSummary sx={{ padding: 0 }}>
        <Typography variant="subtitle1" sx={{ ml: 1 }}>
          Quizzes
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {loading ? (
          <CircularProgress />
        ) : quizzes.length === 0 ? (
          <Typography>No quizzes available</Typography>
        ) : (
          <Table>
            <TableBody>
              {quizzes.map((quiz) => (
                <QuizListRow
                  key={quiz.id}
                  quiz={quiz}
                  onUpdate={() => {}}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default AccordionQuizzes;
