import React, { useState, useEffect } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { updateCategoryApi } from '../../services/categoryApi';

const CategoryEditPage = ({ category, onUpdateCategory, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || '',
                description: category.description || '',
            });
        }
    }, [category]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedCategory = await updateCategoryApi(category._id, formData);
            if (onUpdateCategory) onUpdateCategory(updatedCategory.data); // pass updated data back
            if (onClose) onClose();
        } catch (error) {
            console.error('Failed to update category', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <TextField
                fullWidth
                label="Name"
                name="name"
                size='small'
                value={formData.name}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                required
            />
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
            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                fullWidth
            >
                Save
            </Button>
        </Box>
    );
};

export default CategoryEditPage;
