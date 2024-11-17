import { Delete, Edit, EditNote, List, PlayArrow } from '@mui/icons-material';
import { MenuItem } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ChangeQuizTitleDialog from './ChangeQuizTitleDialog';
import GenericMenu from './GenericMenu';

const QuizListRowMenu = ({ quiz, numQuestions, token, deleteQuiz, onUpdate }) => {
  const [editTitleOpen, setEditTitleOpen] = useState(false);
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
              Authorization: `Token ${token}`,
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
    <>
      <GenericMenu title="Actions">
        <MenuItem onClick={() => startQuiz(quiz.id)} disableRipple>
          <PlayArrow /> Start Quiz
        </MenuItem>
        <MenuItem onClick={() => settings(quiz.id)} disableRipple>
          <EditNote /> Edit Settings
        </MenuItem>
        <MenuItem onClick={() => setEditTitleOpen(true)} disableRipple>
          <Edit /> Edit Title
        </MenuItem>
        <MenuItem onClick={() => viewQuestions(quiz.id)}>
          <List /> View Questions ({numQuestions})
        </MenuItem>
        <MenuItem onClick={() => deleteQuiz(quiz.id)} disableRipple>
          <Delete /> Delete Quiz
        </MenuItem>
      </GenericMenu>
      <ChangeQuizTitleDialog
        open={editTitleOpen}
        setOpen={setEditTitleOpen}
        quizId={quiz.id}
        currentTitle={quiz.title}
        token={token}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default QuizListRowMenu;
