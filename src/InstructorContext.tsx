import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { UserContext } from './JWTUserContext';
import { UserContext as UserContextToken } from './UserContext';
import { Course } from './types/edukonaTypes';
import { fetchInstructorCourses } from './services/apiService';

interface InstructorContextType {
  courses: Course[] | null;
  activeCourse: Course | null;
  setActiveCourse: (course: Course | null) => void;
  updateCourses: () => void;
}

export const InstructorContext = createContext<InstructorContextType>({
  courses: null,
  activeCourse: null,
  setActiveCourse: () => {},
  updateCourses: () => {},
});

export const InstructorProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const { isLoggedIn: isLoggedInJWT } = useContext(UserContext);
  const { isLoggedIn: isLoggedInToken } = useContext(UserContextToken);
  const isLoggedIn = isLoggedInJWT || isLoggedInToken;
  const fetchCourses = () => fetchInstructorCourses().then((res) => setCourses(res.data));

  useEffect(() => {
    if (isLoggedIn && courses === null) {
      fetchCourses();
    }
  }, []);

  return (
    <InstructorContext.Provider value={{ courses, activeCourse, setActiveCourse, updateCourses: fetchCourses }}>
      {children}
    </InstructorContext.Provider>
  );
};
