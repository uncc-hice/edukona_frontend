import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/system';
import { Typography, Box } from '@mui/material';
import AnswersGrid from './AnswersGrid';
import Timer from '../blocks/Timer';

const QuizComponent = ({
                         userCount, liveBarChart, question, code, sendMessage, responseData, quizEnded, timerEnabled, timerDuration, resetTimer, onTimerEnd,
                       }) => {
  const theme = useTheme();
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  // Effect to shuffle answers only when the question changes
  useEffect(() => {
    if (question) {
      const answers = [...question['incorrect_answer_list'], question['correct_answer']];
      const shuffled = answers.sort(() => 0.5 - Math.random());
      setShuffledAnswers(shuffled);
    }
  }, [question]);

  // Function to calculate total responses
  const getTotalResponses = () => {
    return Object.values(responseData).reduce((total, count) => total + count, 0);
  };

  return (<Box width="100%" p={theme.spacing(3)}>
    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
      <Box flexGrow={1} display="flex" justifyContent="center">
        <Typography variant="h6" gutterBottom component="div" textAlign="center">
          Total Responses: {getTotalResponses()}
        </Typography>
        <Typography variant="h6" gutterBottom component="div" textAlign="center" ml={2}>
          Total Students: {userCount}
        </Typography>
      </Box>
      {timerEnabled && (<Box>
        <Timer
          key={resetTimer}
          initialTime={timerDuration}
          onTimerEnd={onTimerEnd}
        />
      </Box>)}
    </Box>
    <Box mt={3} textAlign="center">
      <Typography variant="h2" gutterBottom component="div">
        {question['question_text']}
      </Typography>
    </Box>
    <Box mt={3}>
      <AnswersGrid
        liveBarChart={liveBarChart}
        answers={shuffledAnswers}
        code={code}
        qid={question['id']}
        responseData={responseData}
        sendMessage={sendMessage}
      />
    </Box>
  </Box>);
};

export default QuizComponent;
