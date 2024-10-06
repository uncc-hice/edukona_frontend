import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { Navigate } from 'react-router-dom';

const checkDeveloperStatus = async () => {
  try {
    const response = await axios.get('/check-developer/', {
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`, // Assuming the token is stored in localStorage
      },
    });
    return response.data.isDeveloper;
  } catch (error) {
    console.error('Error checking developer status:', error);
    return false;
  }
};
const DevRoute = ({ element }) => {
  const [isDeveloper, setIsDeveloper] = useState(null);

  useEffect(() => {
    const verifyDeveloper = async () => {
      const status = await checkDeveloperStatus();
      setIsDeveloper(status);
    };

    verifyDeveloper();
  }, []);

  if (isDeveloper === null) {
    return <div>Loading...</div>;
  }

  return isDeveloper ? element : <Navigate to="/unauthorized" />;
};

export default DevRoute;
