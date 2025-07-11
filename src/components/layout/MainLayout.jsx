import React, { useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';

import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const drawerWidth = 240;
const collapsedWidth = 60;

const MainLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => setCollapsed((prev) => !prev);

    return (
        <Box
            sx={{
                height: '89vh',
                backgroundColor: '#f0f0f0', // <-- layout background except sidebar
            }}>
            <CssBaseline />

            <Sidebar collapsed={collapsed} />

            {/* Pass collapsed here */}
            <Header onMenuClick={toggleSidebar} collapsed={collapsed} />

            <Box
                component="main"

                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: `calc(100% - ${collapsed ? collapsedWidth : drawerWidth}px)`,
                    ml: `${collapsed ? collapsedWidth : drawerWidth}px`,
                    transition: 'all 0.3s ease',
                    mt: '64px',
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;
