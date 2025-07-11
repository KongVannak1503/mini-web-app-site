import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Autocomplete } from '@mui/material';
import { getCategoriesApi } from '../../services/categoryApi';
import { updateProductApi } from '../../services/productApi'; // <-- use update API

const ProductEditPage = ({ product, onUpdateProduct, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        pax: '',
        sku: '',
        price: '',
        description: '',
        note: '',
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                pax: product.pax || '',
                sku: product.sku || '',
                categoryId: product.categoryId?._id || null,
                price: product.price || '',
                description: product.description || '',
                note: product.note || '',
            });
        }
    }, [product]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await getCategoriesApi();
            setCategories(res);
        } catch (error) {
            console.error('Failed to load categories', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updated = await updateProductApi(product._id, formData);
            if (onUpdateProduct) onUpdateProduct(updated.data);
            if (onClose) onClose();
        } catch (error) {
            console.error('Failed to update product', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <TextField
                fullWidth
                label="Product Name"
                name="name"
                size="small"
                value={formData.name}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                required
            />

            <div className="grid grid-cols-2 gap-4">
                <TextField
                    fullWidth
                    label="SKU"
                    name="sku"
                    size="small"
                    value={formData.sku}
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Price"
                    name="price"
                    type="number"
                    size="small"
                    value={formData.price}
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <TextField
                    fullWidth
                    label="Pax"
                    name="pax"
                    size="small"
                    value={formData.pax}
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                />
                <Autocomplete
                    disablePortal
                    sx={{ zIndex: 9999 }}
                    options={categories}
                    getOptionLabel={(option) => option?.name || ''}
                    value={categories.find(cat => cat._id === formData.categoryId) || null}
                    onChange={(event, newValue) => {
                        setFormData(prev => ({
                            ...prev,
                            categoryId: newValue ? newValue._id : '',
                        }));
                    }}
                    isOptionEqualToValue={(option, value) =>
                        !!option && !!value && option._id === value._id
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Category"
                            size="small"
                            fullWidth
                            margin="normal"
                        />
                    )}
                />
            </div>

            <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                multiline
                rows={4}
            />
            <TextField
                fullWidth
                label="Note"
                name="note"
                value={formData.note}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                multiline
                rows={3}
            />

            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                fullWidth
            >
                Save Changes
            </Button>
        </Box>
    );
};

export default ProductEditPage;
