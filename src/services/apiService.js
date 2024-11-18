import axios from 'axios';
import { toast } from 'react-toastify';

const token = localStorage.getItem('token');

const api = axios.create({
  baseURL: 'https://api.edukona.com/',
  timeout: 1500,
  headers: { Authorization: `Token ${token}` },
});

export const fetchQuizzes = () =>
  api
    .get('instructor/quizzes/', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch((e) => {
      toast.error('An error occurred while fetching your quizzes');
      console.error(`Error fetching quizzes ${e}`);
    });
