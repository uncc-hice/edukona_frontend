import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import { Course } from './types/edukonaTypes';
import { fetchInstructorCourses } from './services/apiService';

interface InstructorContextType {
  courses: Course[] | null;
  activeCourse: Course | null;
  setActiveCourse: (course: Course | null) => void;
  updateCourses: () => void;
  isLoadingCourses: boolean;
}

export const InstructorContext = createContext<InstructorContextType>({
  courses: null,
  activeCourse: null,
  setActiveCourse: () => {},
  updateCourses: () => {},
  isLoadingCourses: true,
});

export const InstructorProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [isLoadingCourses, setIsLoadingCourses] = useState<boolean>(true);
  const { isLoggedIn } = useContext(UserContext);

  const fetchCourses = () => {
    setIsLoadingCourses(true);
    fetchInstructorCourses()
      .then((res) => {
        const fetchedCourses = res.data;
        setCourses(fetchedCourses);
      })
      .catch((err) => {
        console.error(err);
        setCourses([]);
      })
      .finally(() => {
        setIsLoadingCourses(false);
      });
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchCourses();
    } else {
      setCourses(null);
      setActiveCourse(null);
      setIsLoadingCourses(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && courses && activeCourse) {
      const isActiveCourseStillPresent = courses.some((course) => course.id === activeCourse.id);
      if (!isActiveCourseStillPresent) {
        setActiveCourse(null);
      }
    }
  }, [courses, activeCourse, isLoggedIn, setActiveCourse]);

  return (
    <InstructorContext.Provider
      value={{ courses, activeCourse, setActiveCourse, updateCourses: fetchCourses, isLoadingCourses }}
    >
      {children}
    </InstructorContext.Provider>
  );
};
