import { Add } from '@mui/icons-material';
import { Box, Button, Menu, MenuItem, SxProps } from '@mui/material';
import { MouseEvent, useContext, useState } from 'react';
import { InstructorContext } from '../../InstructorContext';
import { Course } from '../../types/edukonaTypes';
import CreateCourseDialog from './CreateCourseDialog';

const CourseDropdown = ({ boxStyle }: { boxStyle: SxProps | null }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [createCourseOpen, setCreateCourseOpen] = useState<boolean>(false);
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  const { courses, activeCourse, setActiveCourse } = useContext(InstructorContext);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    setAnchor(e.currentTarget);
    setOpen(!open);
  };

  const handleSelectCourse = (course: Course | null) => {
    setActiveCourse(course);
    setOpen(false);
  };

  return (
    <Box sx={boxStyle}>
      <Button id="course-dropdown" onClick={handleClick}>
        {activeCourse === null ? 'Courses' : activeCourse.title}
      </Button>
      <Menu
        open={open}
        onClose={() => setOpen(!open)}
        anchorEl={anchor}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiPaper-root': {
            borderTop: `3px solid #377dff`,
            borderTopRightRadius: '0',
            borderTopLeftRadius: '0',
          },
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        title={activeCourse === null ? 'Courses' : activeCourse.title}
      >
        {courses?.map((course) => (
          <MenuItem key={course.id} onClick={() => handleSelectCourse(course)}>
            {course.title}
          </MenuItem>
        ))}
        <MenuItem onClick={() => handleSelectCourse(null)}>Sandbox Course</MenuItem>
        <MenuItem onClick={() => setCreateCourseOpen(true)}>
          <Add />
          Create Course
        </MenuItem>
      </Menu>
      <CreateCourseDialog open={createCourseOpen} setOpen={setCreateCourseOpen} />
    </Box>
  );
};

export default CourseDropdown;
