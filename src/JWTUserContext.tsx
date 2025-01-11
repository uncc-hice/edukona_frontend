import React, { createContext, useEffect, useState } from 'react';
import { login as apiLogin } from './services/apiService';
import { logout as apiLogout } from './services/apiService';
import { googleAuth } from './services/apiService';
import { JWTSignUpInstructor as apiSignUp } from './services/apiService';
import { toast } from 'react-toastify';

interface SetErrorFunction {
  (message: string): void;
}

interface NavigateFunction {
  (path: string): void;
}

interface UserContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (username: string, password: string, setError: SetErrorFunction, navigate: NavigateFunction) => Promise<void>;
  logout: () => void;
  signUp: (data: SignUpFormData, navigate: NavigateFunction) => void;
  setAccessToken: (accessToken: string | null) => void;
  googleLogin: (token: string, setError: SetErrorFunction, navigate: NavigateFunction) => void;
  isLoggedIn: boolean;
  user: number | null;
}

interface LoginResponse {
  data: {
    access: string;
    refresh: string;
    user: number;
  };
}

interface SignUpFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

const defaultUserContext: UserContextType = {
  accessToken: null,
  refreshToken: null,
  login: async () => {},
  logout: () => {},
  signUp: async () => {},
  setAccessToken: () => {},
  googleLogin: async () => {},
  isLoggedIn: false,
  user: null,
};

export const UserContext = createContext<UserContextType>(defaultUserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<number | null>(null);

  const reset = () => {
    setIsLoggedIn(false);
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (accessToken === null) {
      reset();
    } else {
      setIsLoggedIn(true);
    }
  }, [accessToken]);

  useEffect(() => {
    localStorage.setItem('accessToken', accessToken || '');
  }, [accessToken]);

  useEffect(() => {
    localStorage.setItem('refreshToken', refreshToken || '');
  }, [refreshToken]);

  useEffect(() => {
    localStorage.setItem('user', user !== null ? user.toString() : '');
  }, [user]);

  const login = async (username: string, password: string, setError: SetErrorFunction, navigate: NavigateFunction) => {
    try {
      const response: LoginResponse = await apiLogin(username, password);
      setAccessToken(response.data.access);
      setRefreshToken(response.data.refresh);
      setUser(response.data.user);
      navigate('/');
    } catch (error: any) {
      if (error.response && (error.response.status === 400 || error.response.status === 401)) {
        setError('Invalid email or password.');
      } else {
        setError("Sorry, we couldn't log you in due to an internal server error.");
      }
    }
  };

  const googleLogin = async (credential: string, setError: SetErrorFunction, navigate: NavigateFunction) => {
    googleAuth(credential)
      .then((response: LoginResponse) => {
        setAccessToken(response.data.access);
        setRefreshToken(response.data.refresh);
        setUser(response.data.user);
        navigate('/');
      })
      .catch((error) => {
        console.error(error);
        if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError('Google Login failed. Please try again.');
        }
      });
  };

  const signUp = async (data: SignUpFormData, navigate: NavigateFunction) => {
    apiSignUp(data)
      .then((response: LoginResponse) => {
        setAccessToken(response.data.access);
        setRefreshToken(response.data.refresh);
        setUser(response.data.user);
        navigate('/');
      })
      .catch((error: any) => {
        toast.error(`Failed to create account, please try again.`);
        reset();
      });
  };

  const logout = () => {
    reset();
    apiLogout();
    window.location.reload();
  };

  return (
    <UserContext.Provider
      value={{ accessToken, googleLogin, isLoggedIn, login, logout, signUp, refreshToken, setAccessToken, user }}
    >
      {children}
    </UserContext.Provider>
  );
};
