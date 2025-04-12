import { Course } from '../types/edukonaTypes';
import { Grid, Card, CardContent, CardActions, Typography, Box, Button } from '@mui/material';
import ArticleIcon from '@mui/icons-material/ArticleOutlined';
import { styled } from '@mui/material/styles';

const ColorAccent = styled(Box)(({ theme }) => ({
  height: 4,
  backgroundColor: theme.palette.primary.main,
  width: '100%',
}));

const InstructorCourseList = ({ courses }: { courses: Course[] }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Grid container spacing={3} sx={{ px: 0, py: 0 }}>
      {courses.map((course) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
          <Card
            elevation={2}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
            }}
          >
            <ColorAccent />
            <CardContent sx={{ flexGrow: 1, pb: 1, position: 'relative' }}>
              <Button
                size="small"
                color="primary"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 1,
                }}
              >
                <ArticleIcon sx={{ mr: 1 }} />
                Open
              </Button>
              <Typography
                variant="h4"
                component="h4"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {course.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(course.start_date)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default InstructorCourseList;
