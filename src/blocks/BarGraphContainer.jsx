import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BarGraphComponent from './BarGraphComponent';
import { getQuizSessionResponsesCount } from '../services/apiService';

const BarGraphContainer = ({ code, currentQuestion }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      try {
        const response = await getQuizSessionResponsesCount(code);

        console.log(response.data);
        const responseData = response.data || {};
        // Combine correct and incorrect answers to map over them
        const allOptions = [currentQuestion.correct_answer, ...currentQuestion.incorrect_answer_list];
        const formattedData = allOptions.map((option) => ({
          name: option, // Answer text
          students: responseData[option] || 0, // Number of students who selected this answer
        }));
        setData(formattedData);
      } catch (error) {
        console.error('Failed to fetch data for bar graph:', error);
        setData([]);
      }
    };

    if (currentQuestion && currentQuestion.incorrect_answer_list && currentQuestion.correct_answer) {
      fetchData();
      const intervalId = setInterval(fetchData, 1000); // Set up the interval to fetch data every second
      return () => clearInterval(intervalId); // Clean up the interval on component unmount or dependency change
    }
  }, [code, currentQuestion]); // Dependencies include the current question and its details

  return <BarGraphComponent data={data} />;
};

export default BarGraphContainer;
