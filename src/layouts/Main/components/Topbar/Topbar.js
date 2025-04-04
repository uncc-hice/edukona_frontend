// Topbar.js
import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, useMediaQuery } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ThemeModeToggler from '../../../../components/ThemeModeToggler';
import { UserContext } from '../../../../UserContext';
import { useLocation } from 'react-router-dom';
import CourseDropdown from '../../../../components/CourseDropdown';

const Topbar = ({ onSidebarOpen }) => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'));
  const { pathname } = useLocation();
  console.log(pathname);

  const { isLoggedIn, logout } = useContext(UserContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" width={1}>
      {/* Logo */}
      <Box
        component="a"
        href="/"
        title="Edukona"
        sx={{
          display: 'flex',
          width: { xs: 120, md: 140 },
          height: { xs: 50, md: 60 },
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src="https://elasticbeanstalk-us-west-2-730335402099.s3.us-west-2.amazonaws.com/hice_frontend/EdukonaLog.svg"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </Box>

      {/* Desktop Navigation */}
      {isMd && (
        <Box display="flex" alignItems="center">
          <ThemeModeToggler />

          {isLoggedIn ? (
            <>
              {pathname === '/dashboard' ? (
                <CourseDropdown boxStyle={{ marginLeft: 4 }} />
              ) : (
                <Button
                  variant="text"
                  color="primary"
                  component="a"
                  href="/dashboard"
                  size="large"
                  sx={{ marginLeft: 4 }}
                >
                  Dashboard
                </Button>
              )}
              <Button variant="text" color="primary" component="a" href="/team" size="large" sx={{ marginLeft: 4 }}>
                Team
              </Button>
              <Button
                variant="text"
                color="primary"
                component="a"
                href="/account-general"
                size="large"
                sx={{ marginLeft: 4 }}
              >
                Profile
              </Button>

              <Button variant="outlined" color="primary" onClick={handleLogout} size="large" sx={{ marginLeft: 4 }}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="text" color="primary" component="a" href="/team" size="large" sx={{ marginLeft: 4 }}>
                Team
              </Button>
              <Button
                variant="contained"
                color="primary"
                component="a"
                href="/signup"
                size="large"
                sx={{ marginLeft: 4 }}
              >
                Sign Up
              </Button>

              <Button
                variant="outlined"
                color="primary"
                component="a"
                href="/login"
                size="large"
                sx={{ marginLeft: 4 }}
              >
                Login
              </Button>
            </>
          )}
        </Box>
      )}

      {/* Mobile Navigation */}
      {!isMd && (
        <Box display="flex" alignItems="center">
          <Button
            onClick={onSidebarOpen}
            aria-label="Menu"
            variant="outlined"
            sx={{
              borderRadius: 2,
              minWidth: 'auto',
              padding: 1,
              borderColor: alpha(theme.palette.divider, 0.2),
            }}
          >
            <MenuIcon />
          </Button>
        </Box>
      )}
    </Box>
  );
};

Topbar.propTypes = {
  onSidebarOpen: PropTypes.func.isRequired,
  colorInvert: PropTypes.bool,
};

export default Topbar;
