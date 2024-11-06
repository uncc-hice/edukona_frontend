import React, { useEffect, useRef, useState } from 'react';
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';

const Timer = React.memo(({ initialTime, onTimerEnd, sendMessage, questionId }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const intervalRef = useRef(null);

  useEffect(() => {
    setTimeLeft(initialTime);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalRef.current);
          onTimerEnd();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [initialTime, onTimerEnd]);

  const addTime = (seconds) => {
    if (timeLeft > 0) {
      sendMessage(JSON.stringify({ type: 'increase_duration', question_id: questionId, extension: seconds }));
      setTimeLeft((prevTime) => {
        return prevTime + seconds;
      });
    }
  };

  const percentage = (timeLeft / initialTime) * 100;

  const getPathColor = (percentage) => {
    if (percentage > 50) return '#3ae374'; // Green
    if (percentage > 25) return '#ffd32a'; // Yellow
    return '#ff3f34'; // Red
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: 80, height: 80, margin: '0 auto', marginTop: '10px' }}>
        <CircularProgressbarWithChildren
          value={percentage}
          styles={buildStyles({
            rotation: 0,
            strokeLinecap: 'round',
            pathTransitionDuration: 0.5,
            pathColor: getPathColor(percentage),
            trailColor: '#d 6d6d6',
          })}
        >
          <div style={{ fontSize: 16 }}>
            <strong>{timeLeft}s</strong>
          </div>
        </CircularProgressbarWithChildren>
      </div>
      <Button onClick={() => addTime(15)} style={{ height: 60 }} variant="contained" color="primary">
        <Add /> 15 seconds
      </Button>
    </div>
  );
});

export default Timer;
