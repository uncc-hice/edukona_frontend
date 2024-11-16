import { Delete, Edit, List, PlayArrow } from '@mui/icons-material';
import { MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import GenericMenu from './GenericMenu';

const QuizListRowMenu = ({ quizId, numQuestions, token, deleteQuiz }) => {
  const navigate = useNavigate();

  const startQuiz = async (quizId) => {
    if (!token) {
      console.log('No token found');
      return;
    }
    toast.promise(
      axios
        .post(
          'https://api.edukona.com/quiz-session/',
          {
            quiz_id: quizId,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${token.current}`,
            },
          }
        )
        .then((res) => navigate(`/session/${res.data.code}`)),
      { error: 'Failed to start quiz' }
    );
  };

  const viewQuestions = (quizId) => {
    navigate(`/quiz/${quizId}/edit`);
  };

  const settings = (quizId) => {
    navigate(`/quiz/${quizId}/settings`);
  };
  return (
    <GenericMenu title="Actions">
      <MenuItem onClick={() => startQuiz(quizId)} disableRipple>
        <PlayArrow /> Start Quiz
      </MenuItem>
      <MenuItem onClick={() => settings(quizId)} disableRipple>
        <Edit /> Edit Settings
      </MenuItem>
      <MenuItem onClick={() => viewQuestions(quizId)}>
        <List /> View Questions ({numQuestions})
      </MenuItem>
      <MenuItem onClick={() => deleteQuiz(quizId)} disableRipple>
        <Delete /> Delete Quiz
      </MenuItem>
    </GenericMenu>
  );
};

export default QuizListRowMenu;
