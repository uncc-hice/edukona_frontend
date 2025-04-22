import React, { createContext, useEffect, useState } from 'react';
import { login as apiLogin } from './services/apiService';
import { logout as apiLogout } from './services/apiService';
import { googleAuth } from './services/apiService';
import { JWTSignUpInstructor as apiSignUp } from './services/apiService';
import { toast } from 'react-toastify';
import { forceTokenRefresh } from './services/apiService';
import { verifyToken as apiVerifyToken } from './services/apiService';

interface SetErrorFunction {
  (message: string): void;
}

interface NavigateFunction {
  (path: string): void;
}

export enum Role {
  INSTRUCTOR = 'instructor',
  STUDENT = 'student',
  NONE = 'none',
}

interface UserContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (username: string, password: string, setError: SetErrorFunction, navigate: NavigateFunction) => Promise<void>;
  logout: () => void;
  signUp: (data: SignUpFormData, navigate: NavigateFunction) => void;
  setAccessToken: (accessToken: string | null) => void;
  googleLogin: (token: string, role: string | null, setError: SetErrorFunction) => Promise<GoogleLoginResponse>;
  refreshTokens: () => void;
  timeUntilRefresh: () => number;
  validateToken: () => Promise<boolean>;
  isLoggedIn: boolean;
  user: number | null;
  getRole: () => Role;
}

interface LoginResponse {
  data: {
    access: string;
    refresh: string;
    user: number;
    instructor?: number;
    student?: number;
  };
}

interface GoogleLoginResponse {
  success: boolean;
  role: Role;
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
  googleLogin: async () => Promise.resolve({ success: false, role: Role.NONE }),
  refreshTokens: async () => {},
  timeUntilRefresh: () => 0,
  validateToken: () => Promise.resolve(false),
  isLoggedIn: false,
  user: null,
  getRole: () => Role.NONE,
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

  const [isLoggedIn, setIsLoggedIn] = useState(!!accessToken);
  const [user, setUser] = useState<number | null>(getUserLocalStorage());
  const [role, setRole] = useState<Role>(Role.NONE);
  const [roleId, setRoleId] = useState<number | null>(null);

  const reset = () => {
    setIsLoggedIn(false);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setRole(Role.NONE);
    setRoleId(null);
  };

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      setIsLoggedIn(true);
    } else {
      reset();
    }
  }, [accessToken]);

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    } else {
      localStorage.removeItem('refreshToken');
    }
  }, [refreshToken]);

  useEffect(() => {
    if (role) {
      localStorage.setItem('role', role);
      localStorage.setItem('roleId', roleId?.toString() || '');
    }
  }, [role, roleId]);

  const login = async (username: string, password: string, setError: SetErrorFunction, navigate: NavigateFunction) => {
    apiLogin(username, password)
      .then((res: LoginResponse) => {
        setAccessToken(res.data.access);
        setRefreshToken(res.data.refresh);
        setUser(res.data.user);
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
    role: string | null,
    setError: SetErrorFunction
  ): Promise<GoogleLoginResponse> => {
    try {
      const response = await googleAuth(credential, role);

      setAccessToken(response.data.access);
      setRefreshToken(response.data.refresh);
      setUser(response.data.user);

      const userRole = response.data.instructor ? Role.INSTRUCTOR : Role.STUDENT;

      let roleId = null;
      if (userRole === Role.INSTRUCTOR) {
        roleId = response.data.instructor;
      } else if (userRole === Role.STUDENT) {
        roleId = response.data.student;
      }

      setRole(userRole);
      setRoleId(roleId ?? null);

      return { success: true, role: userRole };
    } catch (error) {
      console.error(error);
      setError('Google Login failed. Please try again.');
      return { success: false, role: Role.NONE };
    }
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

  const refreshTokens = async () => {
    try {
      const refreshed = await forceTokenRefresh();
      if (!refreshed) {
        console.error('Token refresh failed in UserContext');
        reset();
      } else {
        setAccessToken(localStorage.getItem('accessToken'));
        setRefreshToken(localStorage.getItem('refreshToken'));
      }
    } catch (error) {
      console.error('Error during token refresh in UserContext', error);
      reset();
    }
  };

  const timeUntilRefresh = () => {
    if (!accessToken) return 0;
    try {
      const jwt = accessToken.split('.')[1];
      const jwtPayload = JSON.parse(atob(jwt));
      const now = new Date().getTime() / 1000;
      return jwtPayload.exp - now; // seconds
    } catch (error) {
      console.error('Failed to parse JWT', error);
      return 0;
    }
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

  const getRole = () => {
    return localStorage.getItem('role') as Role;
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
        getRole,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
