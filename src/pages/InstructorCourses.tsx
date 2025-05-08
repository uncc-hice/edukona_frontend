import { Typography, Container, Box, Button, Divider, CircularProgress, Alert, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Main } from '../layouts';
import { useEffect, useState } from 'react';
import { fetchInstructorCourses } from '../services/apiService';
import InstructorCourseList from './InstructorCourseList';
import { Course } from '../types/edukonaTypes';

const InstructorCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchInstructorCourses();
        setCourses(response.data || response);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <Main>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
            }}
          >
            My Courses
          </Typography>

          {courses.length > 0 && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              sx={{
                borderRadius: 2,
                px: 3,
              }}
            >
              Create Course
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Content section */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        ) : courses.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Typography variant="h6" gutterBottom>
              You don&apos;t have any courses yet
            </Typography>
            <Button variant="outlined" color="primary" startIcon={<AddIcon />}>
              Create Your First Course
            </Button>
          </Box>
        ) : (
          <InstructorCourseList courses={courses} />
        )}
      </Container>
    </Main>
  );
};

export default InstructorCourses;
