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
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import CustomBreadcrumb from '../../components/breakcrumb/CustomBreadcrumbs';
import ModalMdCenter from '../../components/modal/ModalMdCenter';
import SearchInput from '../../components/input/SearchInput';
import ConfirmDialog from '../../components/popup/ConfirmDialog ';
import TablePagination from '@mui/material/TablePagination';
import { deleteProductApi, getProductsApi } from '../../services/productApi';
import ProductCreatePage from './ProductCreatePage';
import { getCategoriesApi } from '../../services/categoryApi';
import ProductEditPage from './ProductEditPage';

const ProductPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const breadcrumbItems = [
        { breadcrumbName: 'Home', path: '/' },
        { breadcrumbName: 'Products' },
    ];

    const fetchProduct = async () => {
        try {
            const res = await getProductsApi();
            setProducts(res);
        } catch (error) {
            console.error('Failed to load products', error);
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
        document.title = 'Products';
        fetchProduct();
        fetchCategories();
    }, []);

    const openEditModal = (category) => {
        setEditingProduct(category);
        setIsOpen(true);
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        setIsOpen(true);
    };

    const handleUpdateProduct = (updatedCategory) => {
        setProducts((prev) =>
            prev.map((cat) => (cat._id === updatedCategory._id ? updatedCategory : cat))
        );
        setIsOpen(false);
        setEditingProduct(null);
        setSuccessOpen(true);
    };

    const handleAddProduct = (newProduct) => {
        setProducts((prev) => [newProduct, ...prev]);
        setIsOpen(false);
        setEditingProduct(null);
        setSuccessOpen(true);
    };

    const confirmDelete = (id) => {
        setSelectedId(id);
        setConfirmOpen(true);
    };

    const handleDelete = async (selectedId) => {
        try {
            await deleteProductApi(selectedId);
            setProducts((prev) => prev.filter((cat) => cat._id !== selectedId));
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

    const filteredProducts = products.filter((product) => {
        const matchesName = (product.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory
            ? product.categoryId?._id === selectedCategory
            : true;
        return matchesName && matchesCategory;
    });


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
                    <RefreshIcon className="mx-5 cursor-pointer" onClick={fetchProduct} />
                    <Button variant="contained" onClick={openCreateModal}>
                        <AddCircleOutlineIcon className="mr-2" /> Add Item
                    </Button>
                </div>
            </div>

            <TableContainer component={Paper}>
                <Table aria-label="category table">
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={6}>
                                <div className="grid grid-cols-4 gap-4">
                                    <SearchInput
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Name"
                                    />
                                    <Autocomplete
                                        options={categories}
                                        getOptionLabel={(option) => option?.name || ''}
                                        value={categories.find((cat) => cat._id === selectedCategory) || null}
                                        onChange={(event, newValue) => {
                                            setSelectedCategory(newValue ? newValue._id : '');
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Category" size="small" />
                                        )}
                                        isOptionEqualToValue={(option, value) => option._id === value._id}
                                    />

                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <strong>Name</strong>
                            </TableCell>
                            <TableCell>
                                <strong>SKU</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Pax</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Price</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Category</strong>
                            </TableCell>
                            <TableCell className="!text-end">
                                <strong>Action</strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6}>Loading...</TableCell>
                            </TableRow>
                        ) : filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6}>No categories found.</TableCell>
                            </TableRow>
                        ) : (
                            filteredProducts.map((row) => (
                                <TableRow key={row._id}>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.sku}</TableCell>
                                    <TableCell>{row.pax}</TableCell>
                                    <TableCell>{row.price}</TableCell>
                                    <TableCell>{row.categoryId?.name}</TableCell>
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
                    count={filteredProducts.length}
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
                title={editingProduct ? 'Edit Product' : 'Add Product'}
            >
                {editingProduct ? (
                    <ProductEditPage
                        product={editingProduct}
                        onUpdateProduct={handleUpdateProduct}
                        onClose={() => setIsOpen(false)}
                    />
                ) : (
                    <ProductCreatePage
                        onAddProduct={handleAddProduct}
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

export default ProductPage;
