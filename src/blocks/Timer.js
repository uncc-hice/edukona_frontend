import React, { useState, useEffect, useRef } from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Timer = React.memo(({ initialTime, onTimerEnd }) => {
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

  const percentage = (timeLeft / initialTime) * 100;

  const getPathColor = (percentage) => {
    if (percentage > 50) return '#3ae374'; // Green
    if (percentage > 25) return '#ffd32a'; // Yellow
    return '#ff3f34'; // Red
  };

  return (
    <div style={{ width: 80, height: 80 }}>
      <CircularProgressbarWithChildren
        value={percentage}
        styles={buildStyles({
          rotation: 0,
          strokeLinecap: 'round',
          pathTransitionDuration: 0.5,
          pathColor: getPathColor(percentage),
          trailColor: '#d6d6d6',
        })}
      >
        <div style={{ fontSize: 16 }}>
          <strong>{timeLeft}s</strong>
        </div>
      </CircularProgressbarWithChildren>
    </div>
  );
});

export default Timer;
