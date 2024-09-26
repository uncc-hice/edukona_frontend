import React from 'react';
import PropTypes from 'prop-types';
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';

const mock = [
    {
        title: 'Overview',
        href: '#',
    },
    {
        title: 'Analytics',
        href: '#',
    },
    {
        title: 'Automation',
        href: '#',
    },
];

const Topbar = ({ onSidebarOpen }) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            width={1}

        >
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
            <Box display={'flex'}>
                <Box sx={{ display: { xs: 'none', md: 'flex' } }} alignItems={'center'}>
                    {mock.map((item, i) => (
                        <Box marginLeft={3} key={i}>
                            <Link
                                underline="none"
                                component="a"
                                href={item.href}
                                color="text.primary"
                            >
                                {item.title}
                            </Link>
                        </Box>
                    ))}
                </Box>
                <Box sx={{ display: { xs: 'flex', md: 'none' } }} alignItems={'center'}>
                    <React.Fragment>
                        <Tooltip title="Menu">
                            <IconButton onClick={handleClick} size="small">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={24}
                                    height={24}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                                    />
                                </svg>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            PaperProps={{
                                elevation: 3,
                                sx: {
                                    overflow: 'visible',
                                    mt: 1.5,
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            {mock.map((item, i) => (
                                <MenuItem key={i}>
                                    <Link
                                        underline="none"
                                        component="a"
                                        href={item.href}
                                        color="text.primary"
                                    >
                                        {item.title}
                                    </Link>
                                </MenuItem>
                            ))}
                        </Menu>
                    </React.Fragment>
                </Box>
                <Box marginLeft={{ xs: 2, md: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        component="a"
                        target="blank"
                        href="#"
                        size="large"
                        startIcon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={20}
                                height={20}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                        }
                    >
                        Conatct us
                    </Button>
                </Box>
                <Box sx={{ display: { xs: 'block', md: 'none' } }} marginLeft={2}>
                    <Button
                        onClick={() => onSidebarOpen()}
                        aria-label="Menu"
                        variant={'outlined'}
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
            </Box>
        </Box>
    );
};

Topbar.propTypes = {
    onSidebarOpen: PropTypes.func,
};

export default Topbar;
