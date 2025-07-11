import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { createCategoryApi } from '../../services/categoryApi';

const CategoryCreatePage = ({ onAddCategory, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await createCategoryApi(formData);
            if (onAddCategory) onAddCategory(res.data);
            setFormData({ name: '', description: '' });
        } catch (error) {
            console.error("Error", error);
        }
    };


    return (
        <Box
            component="form"
            onSubmit={handleSubmit}

        >
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
                Submit
            </Button>
        </Box>
    );
};

export default CategoryCreatePage;
