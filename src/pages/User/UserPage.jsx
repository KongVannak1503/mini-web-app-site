import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    Autocomplete,
    Snackbar,
    Alert,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    TablePagination,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import CustomBreadcrumb from '../../components/breakcrumb/CustomBreadcrumbs';
import ModalMdCenter from '../../components/modal/ModalMdCenter';
import { getCategoriesApi } from '../../services/categoryApi';
import { deleteUserApi, getUsersApi } from '../../services/userApi';
import UserCreatePage from './UserCreatePage';
import UserUpdatePage from './UserUpdatePage';
import uploadUrl from '../../services/uploadApi';
import { typeRoleOptions } from '../../data/Type';
import ConfirmDialog from '../../components/popup/ConfirmDialog ';

const UserPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedRole, setSelectedRole] = useState(''); // role _id or '' for no filter
    const [categories, setCategories] = useState([]);
    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const breadcrumbItems = [
        { breadcrumbName: 'Home', path: '/' },
        { breadcrumbName: 'Users' },
    ];

    const fetchUsers = async () => {
        try {
            const res = await getUsersApi();
            setUsers(res);
        } catch (error) {
            console.error('Failed to load users', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await getCategoriesApi();
            setCategories(res);
        } catch (error) {
            console.error('Failed to load categories', error);
        }
    };

    useEffect(() => {
        document.title = 'Users';
        fetchUsers();
        fetchCategories();
    }, []);

    const openEditModal = (user) => {
        setEditingUser(user);
        setIsOpen(true);
    };

    const openCreateModal = () => {
        setEditingUser(null);
        setIsOpen(true);
    };

    const handleUpdateUser = (updatedUser) => {
        setUsers((prev) =>
            prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
        );
        setIsOpen(false);
        setEditingUser(null);
        setSuccessMessage('Updated successfully');
        setSuccessOpen(true);
    };

    const handleAddUser = (newUser) => {
        setUsers((prev) => [newUser, ...prev]);
        setIsOpen(false);
        setEditingUser(null);
        setSuccessMessage('Added successfully');
        setSuccessOpen(true);
    };

    const confirmDelete = (id) => {
        setSelectedId(id);
        setConfirmOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteUserApi(id);
            setUsers((prev) => prev.filter((u) => u._id !== id));
            setConfirmOpen(false);
            setSuccessMessage('Deleted successfully');
            setSuccessOpen(true);
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const handleMenuClick = (event, id) => {
        setAnchorEl(event.currentTarget);
        setMenuOpenId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuOpenId(null);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Filter users by name and role
    const filteredUsers = users.filter((user) => {
        const matchesName = (user.name || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesRole = selectedRole
            ? user.role === selectedRole
            : true;

        return matchesName && matchesRole;
    });

    // Pagination slice
    const paginatedUsers = filteredUsers.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <>
            <Snackbar
                open={successOpen}
                autoHideDuration={3000}
                onClose={() => setSuccessOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSuccessOpen(false)}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    {successMessage || 'Action successful!'}
                </Alert>
            </Snackbar>

            <div className="flex justify-between items-center mb-6">
                <CustomBreadcrumb items={breadcrumbItems} />
                <div>
                    <RefreshIcon
                        className="mx-5 cursor-pointer"
                        onClick={fetchUsers}
                    />
                    <Button variant="contained" onClick={openCreateModal}>
                        <AddCircleOutlineIcon className="mr-2" /> Add User
                    </Button>
                </div>
            </div>

            <TableContainer component={Paper}>
                <Table aria-label="user table">
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={7}>
                                <div className="grid grid-cols-4 gap-4">
                                    {/* <TextField
                                        label="Search Name"
                                        size="small"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    /> */}

                                    <Autocomplete
                                        disablePortal
                                        options={typeRoleOptions}
                                        getOptionLabel={(option) => option.name}
                                        value={typeRoleOptions.find((opt) => opt.name === selectedRole) || null}
                                        isOptionEqualToValue={(option, value) => option.name === value.name}
                                        onChange={(event, newValue) => {
                                            setSelectedRole(newValue ? newValue.name : '');
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Role" size="small" />
                                        )}
                                    />
                                </div>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Phone</strong></TableCell>
                            <TableCell><strong>City</strong></TableCell>
                            <TableCell><strong>Country</strong></TableCell>
                            <TableCell><strong>Role</strong></TableCell>
                            <TableCell align="right"><strong>Action</strong></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7}>Loading...</TableCell>
                            </TableRow>
                        ) : paginatedUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7}>No users found.</TableCell>
                            </TableRow>
                        ) : (
                            paginatedUsers.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell className="!flex !items-center !gap-3">
                                        <Avatar
                                            alt={user.name}
                                            src={`${uploadUrl}/${user.image_url?.path}`}
                                            sx={{ width: 45, height: 45 }}
                                        />
                                        {user.name}
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell>{user.city}</TableCell>
                                    <TableCell>{user.country}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={(e) => handleMenuClick(e, user._id)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={menuOpenId === user._id}
                                            onClose={handleMenuClose}
                                        >
                                            <MenuItem
                                                onClick={() => {
                                                    handleMenuClose();
                                                    openEditModal(user);
                                                }}
                                            >
                                                Update
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    handleMenuClose();
                                                    confirmDelete(user._id);
                                                }}
                                            >
                                                Delete
                                            </MenuItem>
                                        </Menu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <TablePagination
                    component="div"
                    count={filteredUsers.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    labelRowsPerPage="Items per page"
                    sx={{
                        '& .MuiInputBase-root': {
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            paddingRight: '8px',
                        },
                    }}
                />
            </TableContainer>

            <ModalMdCenter
                open={isOpen}
                onCancel={() => setIsOpen(false)}
                title={editingUser ? 'Edit User' : 'Add User'}
            >
                {editingUser ? (
                    <UserUpdatePage
                        user={editingUser}
                        onUpdateProduct={handleUpdateUser}
                        onClose={() => setIsOpen(false)}
                    />
                ) : (
                    <UserCreatePage
                        onAddUser={handleAddUser}
                        onClose={() => setIsOpen(false)}
                    />
                )}
            </ModalMdCenter>

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={() => handleDelete(selectedId)}
                title="Confirm Delete"
                content="Are you sure you want to delete this user?"
            />
        </>
    );
};

export default UserPage;
