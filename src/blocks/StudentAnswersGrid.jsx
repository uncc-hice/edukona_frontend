import { Grid, Box } from '@mui/material';
import StudentAnswerOption from './StudentAnswerOption';

const StudentAnswersGrid = ({
  answers,
  question,
  code,
  sendMessage,
  setIsSubmitted,
  isSubmitted,
  selectedAnswer,
  setSelectedAnswer,
}) => {
  const { id: questionId } = question;
  const sid = localStorage.getItem('sid');

  const handleSubmitAnswer = async (answer) => {
    if (answer === selectedAnswer) {
      return;
    }

    if (!sid) {
      console.error('No student ID found');
      return;
    }

    console.log('Submitting answer for questionId: ', questionId);
    const postData = {
      student: { id: sid },
      question_id: questionId,
      quiz_session_code: code,
      selected_answer: answer,
    };

    try {
      console.log('response data:', postData);
      sendMessage(
        JSON.stringify({
          type: 'response',
          data: postData,
        })
      );
    } catch (error) {
      console.error('An error occurred:', error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 404) {
        setSelectedAnswer(answer);
        setIsSubmitted(true);
      }
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        {answers.map((answer, index) => {
          const answerText = typeof answer === 'string' ? answer : answer.answer;
          return (
            <Grid item xs={12} sm={6} key={index}>
              <StudentAnswerOption
                answer={answerText}
                index={index}
                onClick={() => handleSubmitAnswer(answerText)}
                selected={answerText === selectedAnswer}
                submitted={isSubmitted}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default StudentAnswersGrid;
