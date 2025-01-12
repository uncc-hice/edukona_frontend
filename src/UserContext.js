// UserContext.js
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Retrieve token from localStorage
  const storedToken = localStorage.getItem('token');

  // Initialize state based on the presence of a token in localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(!!storedToken);
  const [token, setToken] = useState(storedToken);

  // Function to log in the user
  const login = (email, password, setError, navigate) => {
    const axiosUrl = 'https://api.edukona.com/login/';

    //declares user data (password and email)
    const data = {
      email: email,
      password: password,
    };

    //uses the axios.post function to send the data to backend
    axios
      .post(axiosUrl, data)
      .then((response) => {
        //creates a response in console to ensure that the data sent was correct
        //sets token data
        localStorage.setItem('token', response.data['token']);
        //sets user data
        localStorage.setItem('user', response.data['user']);

        setIsLoggedIn(true);
        setToken(response.data['token']);

        if (response.data['instructor']) {
          navigate('/');
        }
      })
      .catch((error) => {
        console.error('Error: ', error.response.status);
        if (error.response.status === 400 || error.response.status === 401) {
          setError('Invalid email or password.');
        } else {
          setError("Sorry, we couldn't log you in due to an internal server error.");
        }
      });
  };

  // Function to log out the user

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('instructor');
    setIsLoggedIn(false);
    setToken(null);
    window.location.reload();
  };

  // Listen for changes to localStorage
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'token') {
        const newToken = event.newValue;
        if (newToken) {
          // Token was added or changed
          setIsLoggedIn(true);
          setToken(newToken);
        } else {
          // Token was removed
          setIsLoggedIn(false);
          setToken(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <UserContext.Provider value={{ setToken, setIsLoggedIn, isLoggedIn, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
