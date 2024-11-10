//TODO:
//TODO: DEBUG THE LOGIN FUNCTION AND GET IT WORKING
//TODO: DEBUG THE GETQUIZZES FUNCTION AND GET IT WORKING
//having trouble with header for response

import axios from 'axios';
import { toast } from 'react-toastify';
//Login function for app

export function signUp(firstName, lastName, password, email, role) {
  //TODO: Eventually we will need to update instructor to ${role} when we are accepting students
  const endpoint = role === 'instructor' ? 'sign-up-instructor/' : 'sign-up-student/';
  const axiosUrl = `https://api.edukona.com/${endpoint}`;

  //defines data to be sent back in API request
  // Username is replaced with first name and last name.
  const data = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    password: password,
  };
  //API request using instructor URL and data from SignUpForm.js
  axios
    .post(axiosUrl, data)
    .then((response) => {
      //shows response in console
      console.log('Response: ', response.data);
      localStorage.setItem('token', response.data['token']);
      window.location.reload();
    })
    //catches error and displays in console
    .catch((error) => {
      //console.error('Error: ', error);
      toast('Sign up failed.');
    });
}

// function getQuizzes(token){
//
//     const [quizzes, setQuizzes] = useState([]);
//
//     const axiosUrl = 'http://hice-backend-dev.us-west-2.elasticbeanstalk.com/quiz/';
//
//     const data = {
//         data: data['quizzes']
//     };
//
//     //uses the axios.get function to get data from the backend
//     axios.get(axiosUrl, token)
//         .then(response => {
//             console.log('Response: ', response.data);
//             //sets quiz data
//             setQuizzes(data['quizzes']);
//         })
//
//         //error handling
//         .catch(error => {
//             console.error('Error: ', error)
//         });
//
// }

//TODO: FINISH THE LAST TWO FUNCTIONS
//function getStudents()
//function startQuizSession()
