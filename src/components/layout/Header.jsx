import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Assets from '../../assets/Assets';
import WifiIcon from '@mui/icons-material/Wifi';
import Box from '@mui/material/Box';
import { useLocation } from 'react-router-dom';

const drawerWidth = 240;
const collapsedWidth = 60;

const Header = ({ onMenuClick, collapsed }) => {
    const location = useLocation(); // 🔹 Step 2
    const path = location.pathname;

    const getTitle = () => {
        if (path.includes('/category')) return 'Item Categories';
        if (path.includes('/user')) return 'Employees';
        return 'Items';
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                width: `calc(100% - ${collapsed ? collapsedWidth : drawerWidth}px)`,
                ml: `${collapsed ? collapsedWidth : drawerWidth}px`,
                boxShadow: 0,
                bgcolor: 'inherit',
                backgroundImage: 'none',
                borderBottom: '1px solid',
                borderColor: '#f0f0f0',
                top: 0,
                zIndex: (theme) => theme.zIndex.drawer + 1,
                transition: 'all 0.3s ease',
            }}
        >
            <Toolbar>
                <div className="flex items-center w-full">
                    <IconButton
                        edge="start"
                        aria-label="menu"
                        onClick={onMenuClick}
                        className="mr-2"
                    >
                        <MenuIcon />
                    </IconButton>

                    <p className="font-semibold text-black text-base">{getTitle()}</p>
                </div>
                <div className='flex items-center gap-3'>

                    <WifiIcon className='text-green-500' fontSize="large" />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <img
                            src={Assets.logo}
                            alt="Logo"
                            width="45"
                            style={{ objectFit: 'contain', userSelect: 'none', pointerEvents: 'none' }}
                        />
                    </Box>
                </div>
            </Toolbar>

        </AppBar>
    );
};

export default Header;
