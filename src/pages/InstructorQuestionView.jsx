import React, { useEffect, useState, useCallback } from "react";
import { Typography, Button, Box, Paper, styled } from "@mui/material";
import Navbar from "../blocks/Navbar";
import QuizComponent from "../blocks/QuizComponent";
import { useParams } from "react-router-dom";
import Timer from "../blocks/timer";
import QuizEndView from "./QuizEndView";
import useWebSocket from "react-use-websocket";

const InstructorQuestionView = () => {
    const [currentQuestion, setCurrentQuestion] = useState(undefined);
    const [quizEnded, setQuizEnded] = useState(false);
    const { code } = useParams();
    const [resetTimer, setResetTimer] = useState(false);
    const [responseData, setResponseData] = useState({});
    const [settings, setSettings] = useState({});

    const handleIncomingMessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Received data:', data);
        if ((data.type === 'next_question') || (data.type === 'current_question')) {
            setCurrentQuestion(data.question);
            setResetTimer(prev => !prev);
        } else if (data.type === 'quiz_ended') {
            setQuizEnded(true);
            setCurrentQuestion(null);
        } else if (data.type === 'user_response') {
            console.log('Response data:', data.response);
            // Update the responseData state correctly
            setResponseData(prevData => {
                const updatedData = { ...prevData };
                const response = data.response; // Assuming 'response' contains the answer key
                updatedData[response] = (updatedData[response] || 0) + 1;  // Increment if exists, else initialize to 1
                return updatedData;
            });
        } else if (data.type === 'settings') {
            setSettings(data.settings);
        }
    };

    const { sendMessage } = useWebSocket(`wss://api.edukona.com/ws/quiz-session-instructor/${code}/`, {
        onMessage: handleIncomingMessage,
        onOpen: () => console.log("WebSocket connected"),
        onClose: () => console.log("WebSocket disconnected"),
        onError: (event) => console.error("WebSocket error", event),
    });

    const handleNextQuestion = () => {
        setResponseData({});
        sendMessage(JSON.stringify({ type: 'next_question' }));
    };

    const onTimerEnd = () => {
        //sendMessage(JSON.stringify({ type: 'end_quiz' }));
    };

    useEffect(() => {
        handleNextQuestion();
    },[]);

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <Navbar />
            {!quizEnded && settings['timer'] && (
                <Timer initialTime={settings['timer_duration']} onTimerEnd={onTimerEnd} resetTrigger={resetTimer} />
            )}
            <Box flexGrow={1} display="flex" alignItems="center" justifyContent="center">
                {quizEnded ? (
                    <QuizEndView />
                ) : currentQuestion ? (
                    <>
                        <QuizComponent liveBarChart={settings['live_bar_chart']} question={currentQuestion} code={code} responseData={responseData} sendMessage={sendMessage} />
                        {/*<BarGraphContainer code={code} currentQuestion={currentQuestion} />*/}
                    </>
                ) : (
                    <Typography>Loading question...</Typography>
                )}
            </Box>
            {!quizEnded && currentQuestion && (
                <Box textAlign="right" p={2}>
                    <Button variant="contained" color="primary" onClick={handleNextQuestion}>Next Question</Button>
                </Box>
            )}
        </Box>
    );
}

export default InstructorQuestionView;
