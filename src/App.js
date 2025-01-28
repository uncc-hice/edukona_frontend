// app.js

import './App.css';
import { useEffect, useContext } from 'react';
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
import InstructorRecordings from './pages/InstructorRecordings/InstructorRecordings';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from './UserContext';
import Team from './pages/Team/Team';
import General from './pages/ProfilePage/General';
import Security from './pages/ProfilePage/Security';
import Summary from './pages/Summary';
import JWTLoginForm from './blocks/JWTLoginForm';
import { UserContext as JWTUserContext } from './JWTUserContext';
import JWTSignUpForm from './blocks/JWTSignUpForm';

function App() {
  const { isLoggedIn: isLoggedInToken } = useContext(UserContext);
  const { isLoggedIn: isLoggedInJWT } = useContext(JWTUserContext);
  // This is temporary to allow for testing until we have moved to using JWT based auth across the app.
  const isLoggedIn = isLoggedInToken || isLoggedInJWT;

  useEffect(() => {
    const gaMeasurementId = process.env.REACT_APP_GA_MEASUREMENT_ID;
    //console.log('GA_MEASUREMENT_ID', gaMeasurementId);
    if (gaMeasurementId) {
      ReactGA.initialize(gaMeasurementId);
      // ReactGA.send({
      //   hitType: 'event',
      //   eventCategory: 'User',
      //   eventAction: 'Visit',
      //   eventLabel: 'User has visited'
      // });
    } else {
      console.error('GA_MEASUREMENT_ID is not set');
    }
  }, []);

  return (
    <Page>
      <Router>
        <ReactNotifications />
        <Routes>
          <Route path="/student-dashboard" element={isLoggedIn ? <StudentDashboard /> : <Navigate to="/login" />} />
          <Route path="/join" element={<JoinQuiz />} />
          <Route path="/" element={<Landing />} />
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginForm signUpRoute={'/signup'} />}
          />
          <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <SignUpForm />} />
          <Route path="/jwt-signup" element={isLoggedIn ? <Navigate to="/" /> : <JWTSignUpForm />} />
          <Route
            path="/jwt-login"
            element={isLoggedIn ? <Navigate to="/" /> : <JWTLoginForm signUpRoute={'/jwt-signup'} />}
          />
          <Route path="/session/:code" element={isLoggedIn ? <QuizSession /> : <Navigate to="/" />} />
          <Route path="/results/:code" element={isLoggedIn ? <QuizSessionResults /> : <Navigate to="/" />} />
          <Route path="/create-quiz" element={isLoggedIn ? <CreateQuiz /> : <Navigate to="/" />} />
          <Route path="/student/:code" element={<StudentAnswerView />} />
          <Route path="/quiz/:quizId/edit" element={isLoggedIn ? <EditQuizView /> : <Navigate to="/" />} />
          <Route path="/quiz/:code" element={isLoggedIn ? <InstructorQuestionView /> : <Navigate to="/" />} />
          <Route path="/quiz/:id/settings" element={isLoggedIn ? <SettingsPage /> : <Navigate to="/" />} />
          <Route path={'/team'} element={<Team />} />
          <Route path="/account-general" element={isLoggedIn ? <General /> : <Navigate to="/" />} />
          <Route path="account-security" element={isLoggedIn ? <Security /> : <Navigate to="/" />} />
          {/*<Route path="/create-landing" element={<DevRoute element={<Landing />} />} />*/}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/dashboard" element={isLoggedIn ? <InstructorRecordings /> : <Navigate to="/" />} />
          <Route path="/summary/:summaryId" element={isLoggedIn ? <Summary /> : <Navigate to="/" />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Page>
  );
}

export default App;
