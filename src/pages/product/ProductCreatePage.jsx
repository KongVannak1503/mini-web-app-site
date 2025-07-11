import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Autocomplete } from '@mui/material';
import { getCategoriesApi } from '../../services/categoryApi';
import { createProductApi } from '../../services/productApi';

const ProductCreatePage = ({ onAddProduct, onClose }) => {
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
        document.title = 'Products';
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await getCategoriesApi();
            setCategories(res);
        } catch (error) {
            console.error('Failed to load category', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await createProductApi(formData);
            if (onAddProduct) onAddProduct(res.data);
            if (onClose) onClose();
            setFormData({
                name: '',
                pax: '',
                sku: '',
                categoryId: '',
                price: '',
                description: '',
                note: '',
            });
        } catch (error) {
            console.error("Error", error);
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
                    name="sku" // ✅ corrected
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
                    sx={{ zIndex: 9999 }} // Optional but helps inside modals
                    options={categories}
                    getOptionLabel={(option) => {
                        if (typeof option === 'string') return option;
                        return option?.name || '';
                    }}
                    value={categories.find(cat => cat._id === formData.categoryId) || null}
                    onChange={(event, newValue) => {
                        setFormData((prev) => ({
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
                Submit
            </Button>
        </Box>
    );
};

export default ProductCreatePage;
