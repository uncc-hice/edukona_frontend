import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import ReactGA from 'react-ga4';

import LoginForm from './blocks/LoginForm';
import SignUpForm from './blocks/SignUpForm';
import QuizSession from './pages/QuizSession';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import QuizSessionResults from './pages/QuizSessionResults';
import YourSessions from './pages/YourSessions';
import CreateQuiz from './pages/CreateQuiz';
import EditQuizView from './pages/EditQuizView';
import InstructorQuestionView from './pages/InstructorQuestionView';
import JoinQuiz from './pages/JoinQuiz';
import StudentAnswerView from './pages/StudentAnswerView';
import SettingsPage from './pages/SettingsPage/Settings';
import Landing from './pages/Landing';
import Page from './components/Page';
import Unauthorized from './pages/Unauthorized';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'aos/dist/aos.css';
import DevRoute from "./blocks/DevRoute";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  useEffect(() => {
    const checkAuthStatus = () => {
      const loggedIn = !!localStorage.getItem('token');
      setIsLoggedIn(loggedIn);
    };

    window.addEventListener('storage', checkAuthStatus);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  ReactGA.initialize(process.env.GAID);

  ReactGA.send({
    hitType: 'event',
    eventCategory: 'User',
    eventAction: 'Visit',
    eventLabel: 'User has visited'
  })

  return (
      <Page>
        <Router>
          <ReactNotifications />
          <Routes>
            <Route path="/student-dashboard" element={isLoggedIn ? <StudentDashboard /> : <Navigate to="/login" />} />
            <Route path="/join" element={<JoinQuiz />} />
            <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginForm toggleForm={toggleForm}/>} />
            <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginForm toggleForm={toggleForm} />} />
            <Route path="/signup" element={isLoggedIn ? <Navigate to="/dashboard" /> : <SignUpForm toggleForm={toggleForm} />} />
            <Route path="/dashboard" element={isLoggedIn ? <InstructorDashboard /> : <Navigate to="/" />} />
            <Route path="/session/:code" element={isLoggedIn ? <QuizSession /> : <Navigate to="/" />} />
            <Route path="/results/:code" element={isLoggedIn ? <QuizSessionResults /> : <Navigate to="/" />} />
            <Route path="/your-sessions" element={isLoggedIn ? <YourSessions /> : <Navigate to="/" />} />
            <Route path="/create-quiz" element={isLoggedIn ? <CreateQuiz /> : <Navigate to="/" />} />
            <Route path="/student/:code" element={<StudentAnswerView />} />
            <Route path="/quiz/:quizId/edit" element={isLoggedIn ? <EditQuizView /> : <Navigate to="/" />} />
            <Route path="/quiz/:code" element={isLoggedIn ? <InstructorQuestionView /> : <Navigate to="/" />} />
            <Route path="/quiz/:id/settings" element={isLoggedIn ? <SettingsPage /> : <Navigate to="/" />} />
            <Route path="/create-landing" element={<DevRoute element={<Landing />} />} />
            <Route path="/unauthorized" element={<Unauthorized/> } />
          </Routes>
        </Router>
      </Page>
  );
}

export default App;
