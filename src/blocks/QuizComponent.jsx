import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/system';
import { Typography, Box, LinearProgress } from '@mui/material';
import AnswersGrid from './AnswersGrid';
import Timer from '../blocks/Timer';

const QuizComponent = ({
  userCount,
  liveBarChart,
  question,
  code,
  sendMessage,
  responseData,
  quizEnded,
  timerEnabled,
  timerDuration,
  resetTimer,
  onTimerEnd,
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

  // Calculate progress percentage
  const totalResponses = getTotalResponses();
  const progressPercentage = userCount > 0 ? (totalResponses / userCount) * 100 : 0;

  return (
    <Box width="100%" p={theme.spacing(3)}>
      <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
        {/* Progress Bar and Counts */}
        <Box flexGrow={1}>
          <Box mt={3} alignItems="center">
            <LinearProgress variant="determinate" value={progressPercentage} style={{ height: 15, borderRadius: 5 }} />
            <Typography variant="body2" color="textSecondary" align="center" mt={1}>
              {Math.round(progressPercentage)}% of students have answered. Total Students: {userCount}. Total Responses:{' '}
              {totalResponses}
            </Typography>
          </Box>
        </Box>

        {/* Timer */}
        {timerEnabled && (
          <Box ml={4}>
            <Timer key={resetTimer} initialTime={timerDuration} onTimerEnd={onTimerEnd} />
          </Box>
        )}
      </Box>

      {/* Progress Bar */}

      {/* Question Text */}
      <Box mt={3} textAlign="center">
        <Typography variant="h2" gutterBottom component="div">
          {question['question_text']}
        </Typography>
      </Box>

      {/* Answers Grid */}
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
    </Box>
  );
};

export default QuizComponent;
