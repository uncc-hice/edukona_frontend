//TODO:
//TODO: DEBUG THE LOGIN FUNCTION AND GET IT WORKING
//TODO: DEBUG THE GETQUIZZES FUNCTION AND GET IT WORKING
//having trouble with header for response

import axios from "axios";
import {useState} from "react";

// Helper function for adding creating flash messages
function makeFlash(type, message) {
	return `{"type": "${type}", "message": "${message}"}`
}

// function for consuming flash messages
export function consumeFlash(flashName) {
	let flash = localStorage.getItem(flashName);
	if (!flash) {
		return null;
	}
	localStorage.removeItem(flashName);
	return JSON.parse(flash);
}

//Login function for app
export function login(username, password,navigate ){
     const axiosUrl = 'https://api.edukona.com/login/';

    //declares user data (password and username)
    const data = {
        username: username,
        password: password
    };

    //uses the axios.post function to send the data to backend
    axios.post(axiosUrl, data)
        .then(response => {
            //creates a response in console to ensure that the data sent was correct
            console.log('Response: ', response.data);
            //sets token data
            localStorage.setItem('token', response.data['token']);
            //sets user data
            localStorage.setItem('user', response.data['user']);
           if (response.data['instructor']) {
                navigate('/dashboard');
            } else if (response.data['student']) {
                navigate('/student-dashboard');
            }
            window.location.reload();
        })
        .catch(error => {
            console.error('Error: ', error.response.status);
			if (error.response.status == 400 || error.response.status == 401) { 
				localStorage.setItem('loginFlash', makeFlash("error", "Invalid username or password."));
			} else {
				localStorage.setItem('loginFlash', makeFlash("info", "Sorry, we couldn't log you in due to an internal server error."));
			}
			window.location.reload();
        });
}


export function signUp(username, password, email, role){

    //TODO: Eventually we will need to update instructor to ${role} when we are accepting students
    const endpoint = role === 'instructor' ? 'sign-up-instructor/' : 'sign-up-student/';
    const axiosUrl = `https://api.edukona.com/${endpoint}`;

    //defines data to be sent back in API request
    const data = {
        user: {
            username: username,
            password: password,
            email: email
        }
    }
    //API request using instructor URL and data from SignUpForm.js
    axios.post(axiosUrl, data)
        .then(response => {
            //shows response in console
            console.log('Response: ', response.data);
            localStorage.setItem('token', response.data['token']);
            window.location.reload();
        })
        //catches error and displays in console
        .catch(error => {
            console.error('Error: ', error);
        })
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
