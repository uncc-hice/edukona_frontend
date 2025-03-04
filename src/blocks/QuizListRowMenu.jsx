import { Delete, Edit, EditNote, List, PlayArrow } from '@mui/icons-material';
import { MenuItem } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ChangeQuizTitleDialog from './ChangeQuizTitleDialog';
import GenericMenu from './GenericMenu';
import { startQuizSession } from '../services/apiService';

const QuizListRowMenu = ({ quiz, numQuestions, deleteQuiz, onUpdate }) => {
  const [editTitleOpen, setEditTitleOpen] = useState(false);
  const [actionsMenuOpen, setActionsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const startQuiz = async (quizId) =>
    toast.promise(
      startQuizSession(quizId).then((res) => navigate(`/session/${res.data.code}`)),
      { error: 'Failed to start quiz' }
    );

  const viewQuestions = (quizId) => {
    navigate(`/quiz/${quizId}/edit`);
  };

  const settings = (quizId) => {
    navigate(`/quiz/${quizId}/settings`);
  };
  return (
    <>
      <GenericMenu title="Actions" isOpen={actionsMenuOpen} setIsOpen={setActionsMenuOpen}>
        <MenuItem
          onClick={() => {
            startQuiz(quiz.id);
            setActionsMenuOpen(false);
          }}
          disableRipple
        >
          <PlayArrow /> Start Quiz
        </MenuItem>
        <MenuItem
          onClick={() => {
            setEditTitleOpen(true);
            setActionsMenuOpen(false);
          }}
          disableRipple
        >
          <Edit /> Edit Title
        </MenuItem>
        <MenuItem
          onClick={() => {
            viewQuestions(quiz.id);
            setActionsMenuOpen(false);
          }}
          disableRipple
        >
          <List /> View Questions ({numQuestions})
        </MenuItem>
        <MenuItem
          onClick={() => {
            deleteQuiz(quiz.id);
            setActionsMenuOpen(false);
          }}
          disableRipple
        >
          <Delete /> Delete Quiz
        </MenuItem>
      </GenericMenu>
      <ChangeQuizTitleDialog
        open={editTitleOpen}
        setOpen={setEditTitleOpen}
        quizId={quiz.id}
        currentTitle={quiz.title}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default QuizListRowMenu;
