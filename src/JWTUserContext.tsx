import React, { createContext, useEffect, useState } from 'react';
import { login as apiLogin } from './services/apiService';
import { logout as apiLogout } from './services/apiService';
import { googleAuth } from './services/apiService';
import { JWTSignUpInstructor as apiSignUp } from './services/apiService';
import { toast } from 'react-toastify';
import { refreshAccessToken } from './services/apiService';
import { verifyToken as apiVerifyToken } from './services/apiService';

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
  googleLogin: (token: string, role: string, setError: SetErrorFunction, navigate: NavigateFunction) => void;
  refreshTokens: () => void;
  timeUntilRefresh: () => number;
  validateToken: () => Promise<boolean>;
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
  refreshTokens: async () => {},
  timeUntilRefresh: () => 0,
  validateToken: () => Promise.resolve(false),
  isLoggedIn: false,
  user: null,
};

/**
 * Helper function to get the user value as an integer from local storage.
 * @returns {number | null} The user id saved in local storage or null if it does not exist.
 */
const getUserLocalStorage = (): number | null => {
  const user = localStorage.getItem('user');
  if (!user) {
    return null;
  }
  return parseInt(user);
};

export const UserContext = createContext<UserContextType>(defaultUserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));

  const [isLoggedIn, setIsLoggedIn] = useState(!(accessToken === null));
  const [user, setUser] = useState<number | null>(getUserLocalStorage());

  const reset = () => {
    setIsLoggedIn(false);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  useEffect(() => {
    if (accessToken === null) {
      reset();
    } else {
      setIsLoggedIn(true);
    }
  }, [accessToken]);

  const login = async (username: string, password: string, setError: SetErrorFunction, navigate: NavigateFunction) => {
    apiLogin(username, password)
      .then((res: LoginResponse) => {
        setAccessToken(res.data.access);
        setRefreshToken(res.data.refresh);
        setUser(res.data.user);
        localStorage.setItem('accessToken', res.data.access);
        localStorage.setItem('refreshToken', res.data.refresh);
        localStorage.setItem('user', res.data.user.toString());
        navigate('/');
      })
      .catch((err) => {
        if (err.response && (err.response.status === 400 || err.response.status === 401)) {
          setError('Invalid email or password.');
        } else {
          setError("Sorry, we couldn't log you in due to an internal server error.");
        }
      });
  };

  const googleLogin = async (
    credential: string,
    role: string,
    setError: SetErrorFunction,
    navigate: NavigateFunction
  ) => {
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
      .catch(() => {
        toast.error(`Failed to create account, please try again.`);
        reset();
      });
  };

  const logout = () =>
    apiLogout(refreshToken).then(() => {
      reset();
      window.location.reload();
    });

  const loadTokensFromStorage = () => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
    }
  };

  const refreshTokens = async () => {
    if (!refreshToken) {
      console.error('No refresh token available');
      reset();
      return;
    }

    try {
      await refreshAccessToken(refreshToken);
      loadTokensFromStorage();
    } catch (error) {
      console.error('Failed to refresh access token', error);
      reset();
    }
  };

  const timeUntilRefresh = () => {
    if (!accessToken) return 0;
    const jwt = accessToken.split('.')[1];
    const jwtPayload = JSON.parse(atob(jwt));
    const now = new Date().getTime() / 1000;
    return jwtPayload.exp - now; // seconds
  };

  const validateToken = async (): Promise<boolean> => {
    if (!accessToken) return false;
    try {
      await apiVerifyToken(accessToken);
      return true;
    } catch (error) {
      console.error('Failed to verify access token', error);
      return false;
    }
  };

  return (
    <UserContext.Provider
      value={{
        accessToken,
        googleLogin,
        isLoggedIn,
        login,
        logout,
        refreshToken,
        refreshTokens,
        setAccessToken,
        signUp,
        timeUntilRefresh,
        user,
        validateToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
