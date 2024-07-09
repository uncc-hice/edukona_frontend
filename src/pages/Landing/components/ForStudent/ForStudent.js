/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import PhoneSkeletonIllustration from './PhoneSkeleton';
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import useMediaQuery from "@mui/material/useMediaQuery";


const mock = [
    {
        title: 'Engaging for Students',
        subtitle:
            'EduKona is designed to make learning fun and interactive in the classroom. Experience engaging quizzes that enhance your understanding. ',
        icon: (
            <svg
                height={24}
                width={24}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                />
            </svg>
        ),
    },
    {
        title: 'Modern and User-Friendly',
        subtitle:
            'EduKona boasts a sleek, modern interface that is easy to navigate, making your learning experience both effective and enjoyable.',
        icon: (
            <svg
                height={24}
                width={24}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
            </svg>
        ),
    },
    {
        title: 'Clear Guidance',
        subtitle:
            'With detailed instructions and support for every feature, you\'ll never be left wondering how to use the app or complete your quizzes.',
        icon: (
            <svg
                height={24}
                width={24}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
            </svg>
        ),
    },
];
const ForStudent = () => {
    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.up('md'), {
        defaultMatches: true,
    });

    const LeftSide = () => (
        <Box width={1}>
            <Box
                sx={{
                    maxWidth: 350,
                    position: 'relative',
                    marginX: 'auto',
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        borderRadius: '2.75rem',
                        boxShadow: 1,
                        width: '75% !important',
                        marginX: 'auto',
                    }}
                >
                    <Box>
                        <Box
                            position={'relative'}
                            zIndex={2}
                            maxWidth={1}
                            height={'auto'}
                            sx={{ verticalAlign: 'middle' }}
                        >
                            <PhoneSkeletonIllustration />
                        </Box>
                        <Box
                            position={'absolute'}
                            top={'2.4%'}
                            left={'4%'}
                            width={'92.4%'}
                            height={'96%'}
                        >
                            <Box
                                component={'img'}
                                loading="lazy"
                                src={
                                    theme.palette.mode === 'light'
                                        ? 'https://elasticbeanstalk-us-west-2-730335402099.s3.us-west-2.amazonaws.com/hice_frontend/StudentAnswer.jpg'
                                        : 'https://elasticbeanstalk-us-west-2-730335402099.s3.us-west-2.amazonaws.com/hice_frontend/StudentAnswer.jpg'
                                }
                                alt="Image Description"
                                width={1}
                                height={1}
                                sx={{
                                    objectFit: 'cover',
                                    borderRadius: '2.5rem',
                                    filter:
                                        theme.palette.mode === 'dark'
                                            ? 'brightness(0.7)'
                                            : 'none',
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );

    const RightSide = () => (
        <List disablePadding>
            {mock.map((item, index) => (
                <ListItem
                    key={index}
                    disableGutters
                    data-aos="fade-up"
                    data-aos-delay={index * 300}
                    data-aos-offset={100}
                    data-aos-duration={600}
                >
                    <ListItemAvatar>
                        <Box
                            component={Avatar}
                            variant={'rounded'}
                            color={theme.palette.primary.dark}
                            bgcolor={`${theme.palette.primary.light}22`}
                        >
                            {item.icon}
                        </Box>
                    </ListItemAvatar>
                    <ListItemText primary={item.title} secondary={item.subtitle} />
                </ListItem>
            ))}
        </List>
    );

    return (
        <Box>
            <Box marginBottom={4}>
                <Box marginBottom={2}>
                    <Typography variant="h4" align={'center'} sx={{ fontWeight: 700 }}>
                        For Students:
                    </Typography>
                </Box>
                <Typography variant="h6" component="p" align={'center'}>
                    Participating in classroom quizzes can be daunting,
                </Typography>
                <Typography variant="h6" component="p" align={'center'}>
                    but our app transforms this experience into an engaging and interactive activity, making it fun and easy to excel.
                </Typography>

            </Box>
            <Grid container spacing={4}>
                <Grid item container alignItems={'center'} xs={12} md={6}>
                    <LeftSide />
                </Grid>
                <Grid item container alignItems={'center'} xs={12} md={6}>
                    <Box data-aos={isMd ? 'fade-right' : 'fade-up'}>
                        <RightSide />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ForStudent;
