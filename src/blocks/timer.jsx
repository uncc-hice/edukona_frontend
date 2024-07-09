import React, { useState, useEffect } from 'react';

const Timer = ({ initialTime, onTimerEnd, resetTrigger }) => {
    const [timer, setTimer] = useState(initialTime);

    useEffect(() => {
        setTimer(initialTime); // Reset the timer whenever resetTrigger changes
    }, [resetTrigger, initialTime]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer <= 1) {
                    clearInterval(interval);
                    onTimerEnd();
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [onTimerEnd]);

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
        };
    };

    return (
        <div style={getTimerStyle()}>
            {formatTime()}
        </div>
    );
};

export default Timer;
