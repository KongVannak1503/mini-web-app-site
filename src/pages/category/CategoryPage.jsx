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
    Snackbar,
    Alert,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import CustomBreadcrumb from '../../components/breakcrumb/CustomBreadcrumbs';
import ModalMdCenter from '../../components/modal/ModalMdCenter';
import SearchInput from '../../components/input/SearchInput';
import CategoryCreatePage from './CategoryCreatePage';
import CategoryEditPage from './CategoryEditPage';
import { getCategoriesApi, deleteCategoryApi } from '../../services/categoryApi';
import ConfirmDialog from '../../components/popup/ConfirmDialog ';
import TablePagination from '@mui/material/TablePagination';

const CategoryPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCategory, setEditingCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [page, setPage] = useState(0);
    const [successOpen, setSuccessOpen] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [successMessage, setSuccessMessage] = useState('');

    const breadcrumbItems = [
        { breadcrumbName: 'Home', path: '/' },
        { breadcrumbName: 'Categories' },
    ];

    const fetchCategories = async () => {
        try {
            const res = await getCategoriesApi();
            setCategories(res);
        } catch (error) {
            console.error('Failed to load categories', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = 'Category';
        fetchCategories();
    }, []);

    const openEditModal = (category) => {
        setEditingCategory(category);
        setIsOpen(true);
    };

    const openCreateModal = () => {
        setEditingCategory(null);
        setIsOpen(true);
    };

    const handleUpdateCategory = (updatedCategory) => {
        setCategories((prev) =>
            prev.map((cat) => (cat._id === updatedCategory._id ? updatedCategory : cat))
        );
        setIsOpen(false);
        setEditingCategory(null);
        setSuccessOpen(true);
    };

    const handleAddCategory = (newCategory) => {
        setCategories((prev) => [newCategory, ...prev]);
        setIsOpen(false);
        setEditingCategory(null);
        setSuccessOpen(true);
    };

    const confirmDelete = (id) => {
        setSelectedId(id);
        setConfirmOpen(true);
    };

    const handleDelete = async (selectedId) => {
        try {
            await deleteCategoryApi(selectedId);
            setCategories((prev) => prev.filter((cat) => cat._id !== selectedId));

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
        setPage(0); // reset to first page on page size change
    };

    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Snackbar
                open={successOpen}
                autoHideDuration={3000}
                onClose={() => setSuccessOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setSuccessOpen(false)} severity="success" sx={{ width: '100%' }}>
                    {successMessage || 'Save successfully!'}
                </Alert>
            </Snackbar>
            <div className="flex justify-between items-center mb-6">
                <CustomBreadcrumb items={breadcrumbItems} />
                <div>
                    <RefreshIcon className="mx-5 cursor-pointer" onClick={fetchCategories} />
                    <Button variant="contained" onClick={openCreateModal}>
                        <AddCircleOutlineIcon className="mr-2" /> Add Item
                    </Button>
                </div>
            </div>

            <TableContainer component={Paper}>
                <Table aria-label="category table">
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={2}>
                                <div className="grid grid-cols-4">
                                    <SearchInput
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search by name..."
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <strong>Name</strong>
                            </TableCell>
                            <TableCell className="!text-end">
                                <strong>Action</strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={2}>Loading...</TableCell>
                            </TableRow>
                        ) : filteredCategories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2}>No categories found.</TableCell>
                            </TableRow>
                        ) : (
                            filteredCategories.map((row) => (
                                <TableRow key={row._id}>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell className="!text-right">
                                        <IconButton onClick={(e) => handleMenuClick(e, row._id)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={menuOpenId === row._id}
                                            onClose={handleMenuClose}
                                        >
                                            <MenuItem
                                                onClick={() => {
                                                    handleMenuClose();
                                                    openEditModal(row);
                                                }}
                                            >
                                                Update
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    handleMenuClose();
                                                    confirmDelete(row._id);
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
                    count={filteredCategories.length}
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
                title={editingCategory ? 'Edit Category' : 'Add Category'}
            >
                {editingCategory ? (
                    <CategoryEditPage
                        category={editingCategory}
                        onUpdateCategory={handleUpdateCategory}
                        onClose={() => setIsOpen(false)}
                    />
                ) : (
                    <CategoryCreatePage
                        onAddCategory={handleAddCategory}
                        onClose={() => setIsOpen(false)}
                    />
                )}
            </ModalMdCenter>

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={() => handleDelete(selectedId)}
                title="Confirm Delete"
                content="Are you sure you want to delete this category?"
            />
        </>
    );
};

export default CategoryPage;
