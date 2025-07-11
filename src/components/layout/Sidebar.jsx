import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import DashboardIcon from '@mui/icons-material/Dashboard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CategoryIcon from '@mui/icons-material/Category';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Assets from '../../assets/Assets';
import { logoutUser } from '../../services/authApi';

const drawerWidth = 240;
const collapsedWidth = 60;

const Sidebar = ({ collapsed }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [openSubmenus, setOpenSubmenus] = useState({});

    const handleLogout = async () => {
        try {
            await logoutUser();
            sessionStorage.removeItem('token');
            window.location.href = '/login';
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    const toggleSubmenu = (label) => {
        setOpenSubmenus((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    };

    const menuSections = [
        {
            title: null,
            items: [{ label: 'Dashboard', icon: <DashboardIcon />, path: '/' }],
        },
        {
            title: 'Products',
            items: [
                { label: 'Products', icon: <StorefrontIcon />, path: '/products' },
                { label: 'Category', icon: <CategoryIcon />, path: '/category' },
            ],
        },
        {
            title: 'Other',
            items: [
                {
                    label: 'Settings',
                    icon: <SettingsIcon />,
                    path: '/settings',
                    children: [
                        {
                            label: 'User',
                            path: '/settings/user',
                            // icon: <PersonIcon /> // Add icon if you want
                        },
                        // add more children here if needed
                    ],
                },
                {
                    label: 'Logout',
                    icon: <LogoutIcon />,
                    action: 'logout',
                },
            ],
        },
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: collapsed ? collapsedWidth : drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: collapsed ? collapsedWidth : drawerWidth,
                    boxSizing: 'border-box',
                    transition: 'width 0.3s',
                    overflowX: 'hidden',
                },
            }}
            open
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 2,
                }}
            >
                <img
                    src={Assets.logo}
                    alt="Logo"
                    width={collapsed ? 40 : 80}
                    style={{ objectFit: 'contain', userSelect: 'none', pointerEvents: 'none' }}
                />
            </Box>

            {menuSections.map((section, idx) => (
                <List
                    key={idx}
                    subheader={
                        section.title ? (
                            <ListSubheader
                                component="div"
                                sx={{
                                    bgcolor: 'background.paper',
                                    paddingLeft: collapsed ? 1 : 2,
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    display: collapsed ? 'none' : 'block',
                                }}
                            >
                                {section.title}
                            </ListSubheader>
                        ) : null
                    }
                >
                    {section.items.map((item) => (
                        <React.Fragment key={item.label}>
                            <ListItem disablePadding sx={{ justifyContent: collapsed ? 'center' : 'initial' }}>
                                {item.action === 'logout' ? (
                                    <ListItemButton onClick={handleLogout} sx={{ px: collapsed ? 2 : 3 }}>
                                        <ListItemIcon
                                            sx={{ minWidth: 0, mr: collapsed ? 0 : 3, justifyContent: 'center' }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>
                                        {!collapsed && <ListItemText primary={item.label} />}
                                    </ListItemButton>
                                ) : item.children ? (
                                    <ListItemButton
                                        onClick={() => toggleSubmenu(item.label)}
                                        sx={{ px: collapsed ? 2 : 3 }}
                                    >
                                        <ListItemIcon
                                            sx={{ minWidth: 0, mr: collapsed ? 0 : 3, justifyContent: 'center' }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>
                                        {!collapsed && (
                                            <>
                                                <ListItemText primary={item.label} />
                                                {openSubmenus[item.label] ? <ExpandLess /> : <ExpandMore />}
                                            </>
                                        )}
                                    </ListItemButton>
                                ) : (
                                    <ListItemButton
                                        component={Link}
                                        to={item.path}
                                        selected={location.pathname === item.path}
                                        sx={{ px: collapsed ? 2 : 3 }}
                                    >
                                        <ListItemIcon
                                            sx={{ minWidth: 0, mr: collapsed ? 0 : 3, justifyContent: 'center' }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>
                                        {!collapsed && <ListItemText primary={item.label} />}
                                    </ListItemButton>
                                )}
                            </ListItem>

                            {/* Render children submenu */}
                            {item.children && (
                                <Collapse in={openSubmenus[item.label]} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {item.children.map((child) => (
                                            <ListItem
                                                key={child.label}
                                                disablePadding
                                                sx={{ pl: collapsed ? 2 : 6, justifyContent: collapsed ? 'center' : 'initial' }}
                                            >
                                                <ListItemButton
                                                    component={Link}
                                                    to={child.path}
                                                    selected={location.pathname === child.path}
                                                    sx={{ px: collapsed ? 2 : 3 }}
                                                >
                                                    {/* Optional child icon */}
                                                    {/* <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 3, justifyContent: 'center' }}>
                            {child.icon}
                          </ListItemIcon> */}
                                                    {!collapsed && <ListItemText primary={child.label} />}
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            )}
                        </React.Fragment>
                    ))}
                </List>
            ))}
        </Drawer>
    );
};

export default Sidebar;
