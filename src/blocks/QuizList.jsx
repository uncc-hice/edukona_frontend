import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  DialogActions,
  DialogContent, DialogContentText, DialogTitle, Dialog
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from "axios";


const QuizList = () => {

  const [quizzes, setQuizzes] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleOpen = (quizId) => {
    setSelectedQuizId(quizId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('https://api.edukona.com/quiz/', {
        headers: {
          'Content-Type': 'application/json', 'Authorization': `Token ${token}`,
        },
      });

      const data = response.data;
      setQuizzes(data['quizzes']);
    } catch (error) {
      console.error('An error occurred while fetching the quizzes:', error.message);
    }
  };

  const deleteQuiz = async () => {
    handleClose();
    try {
      const response = await axios.delete(`https://api.edukona.com/quiz/${selectedQuizId}`, {
        headers: {
          'Content-Type': 'application/json', 'Authorization': `Token ${token}`,
        },
      });

      if (response.status === 200) {
        fetchQuizzes();
      }
    } catch (error) {
      console.error('An error occurred while deleting the quiz:', error.message);
    }
  }

  const startQuiz = async (quizId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("No token found");
      return;
    }
    try {
      const response = await axios.post('https://api.edukona.com/quiz-session/', {
        quiz_id: quizId,
      }, {
        headers: {
          'Content-Type': 'application/json', 'Authorization': `Token ${token}`,
        }
      });

      // Assuming the response contains a session code in the format: { code: 'someCode' }
      const sessionCode = response.data.code;

      if (!(response.status === 400)) {
        navigate(`/session/${sessionCode}`);
      }

      // Example of using URL parameters

    } catch (error) {
      console.error('Error starting the quiz:', error);
      // Handle error (e.g., showing an error message to the user)
    }
  };


  const viewQuestions = (quizId) => {
    navigate(`/quiz/${quizId}/edit`);
  };

  const settings = (quizId) => {
    navigate(`/quiz/${quizId}/settings`)
  }

  return (<TableContainer component={Paper}>
    <Table>
      <TableBody>
        {quizzes.map((quiz) => (<TableRow key={quiz.id}>
          <TableCell>{quiz.title}</TableCell>
          <TableCell>
            <Button
              variant="contained"
              color="primary"
              onClick={() => viewQuestions(quiz.id)}
            >
              View Questions
            </Button>
          </TableCell>
          <TableCell>
            <Button
              variant="contained"
              color="primary"
              onClick={() => settings(quiz.id)}
            >
              Edit Settings
            </Button>
          </TableCell>
          <TableCell>
            <Button
              variant="contained"
              color="primary"
              onClick={() => startQuiz(quiz.id)} // Add onClick event handler to call startQuiz
            >
              Start Quiz
            </Button>
          </TableCell>

          <TableCell>
            <Button
                variant="contained"
                color="warning"
                onClick={() => handleOpen(quiz.id)}
            >
              Delete Quiz
            </Button>
          </TableCell>
        </TableRow>))}
      </TableBody>
    </Table>
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this quiz?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={deleteQuiz} color="primary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  </TableContainer>);
};

export default QuizList;