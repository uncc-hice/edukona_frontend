import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './UserContext';
import { UserProvider as JWTUserProvider } from './JWTUserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <JWTUserProvider>
    <UserProvider>
      <App />
    </UserProvider>
  </JWTUserProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
