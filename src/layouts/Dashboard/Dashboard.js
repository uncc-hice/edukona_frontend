import React, { useState } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';

import Container from '../../components/Container';
import Topbar from '../Main/components/Topbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

const ChildMock = () => {
    const theme = useTheme();
    return (
        <Box p={4}>
            <Box
                width={1}
                height={1}
                minHeight={800}
                borderRadius={2}
                border={`2px solid ${theme.palette.divider}`}
                sx={{
                    borderStyle: 'dashed',
                }}
            />
        </Box>
    );
};

const Dashboard = ({children}) => {
    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.up('md'), {
        defaultMatches: true,
    });

    const [openSidebar, setOpenSidebar] = useState(false);

    const handleSidebarOpen = () => {
        setOpenSidebar(true);
    };

    const handleSidebarClose = () => {
        setOpenSidebar(false);
    };

    const open = isMd ? false : openSidebar;

    return (
        <Box>
            <AppBar
                position={'fixed'}
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
                elevation={0}
            >
                <Container maxWidth={1} paddingY={{ xs: 1, sm: 1.5 }}>
                    <Topbar onSidebarOpen={handleSidebarOpen} />
                </Container>
            </AppBar>
            <Sidebar
                onClose={handleSidebarClose}
                open={open}
                variant={isMd ? 'permanent' : 'temporary'}
            />
            <main>
                <Box height={{ xs: 58, sm: 66, md: 71 }} />
                <Box
                    display="flex"
                    flex="1 1 auto"
                    overflow="hidden"
                    paddingLeft={{ md: '256px' }}
                >
                    <Box display="flex" flex="1 1 auto" overflow="hidden">
                        <Box flex="1 1 auto" height="100%" overflow="auto">
                            {children}
                            <Divider />
                            <Container paddingY={4}>
                                <Footer />
                            </Container>
                        </Box>
                    </Box>
                </Box>
            </main>
        </Box>
    );
};

export default Dashboard;