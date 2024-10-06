import React, { useState, useEffect, useRef } from 'react';

const Timer = ({ initialTime, onTimerEnd, resetTrigger }) => {
  const [timer, setTimer] = useState(initialTime);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const endTimeRef = useRef(Date.now() + initialTime * 1000);

  // Reset the timer whenever resetTrigger or initialTime changes
  useEffect(() => {
    clearInterval(intervalRef.current);
    setTimer(initialTime);
    startTimeRef.current = Date.now();
    endTimeRef.current = Date.now() + initialTime * 1000;

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const remaining = Math.round((endTimeRef.current - now) / 1000);
      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        setTimer(0);
        onTimerEnd();
      } else {
        setTimer(remaining);
      }
    }, 250); // Update every 250ms for better accuracy

    return () => clearInterval(intervalRef.current);
  }, [resetTrigger, initialTime, onTimerEnd]);

  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getTimerStyle = () => {
    let color = 'green';
    if (timer <= 40) {
      color = 'red';
    } else if (timer <= 80) {
      color = 'orange';
    }
    const animation = timer <= 10 ? 'pulse 1s infinite' : 'none';
    return {
      position: 'absolute',
      top: '70px',
      right: '20px',
      padding: '15px',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      color,
      fontWeight: 'bold',
      borderRadius: '10px',
      fontSize: '24px',
      animation,
      transition: 'color 0.3s, transform 0.3s',
    };
  };

  return <div style={getTimerStyle()}>{formatTime()}</div>;
};

export default Timer;
