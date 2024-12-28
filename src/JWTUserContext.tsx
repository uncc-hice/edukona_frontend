import React, { createContext, useEffect, useState } from 'react';
import { login as apiLogin } from './services/apiService';
import { logout as apiLogout } from './services/apiService';
import { googleAuth } from './services/apiService';

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

const defaultUserContext: UserContextType = {
  accessToken: null,
  refreshToken: null,
  login: async () => {},
  logout: () => {},
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

  useEffect(() => {
    if (accessToken === null) {
      setIsLoggedIn(false);
      setUser(null);
    } else {
      setIsLoggedIn(true);
    }
  }, [accessToken]);
  const login = async (username: string, password: string, setError: SetErrorFunction, navigate: NavigateFunction) => {
    console.log('Logging in');
    try {
      const response: LoginResponse = await apiLogin(username, password);
      console.log(response);
      setAccessToken(response.data.access);
      setRefreshToken(response.data.refresh);
      setUser(response.data.user);
      navigate('/');
    } catch (error: any) {
      console.log(error);
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

  const logout = () => {
    setAccessToken(null);
    apiLogout();
    window.location.reload();
  };

  return (
    <UserContext.Provider
      value={{ accessToken, googleLogin, isLoggedIn, login, logout, refreshToken, setAccessToken, user }}
    >
      {children}
    </UserContext.Provider>
  );
};
