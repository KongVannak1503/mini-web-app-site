import React, { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Autocomplete,
    Avatar,
    IconButton,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { createUserApi } from '../../services/userApi'; // ✅ Use correct API
import { typeRoleOptions } from '../../data/Type';
import { countryOptions } from '../../data/Country';

const UserCreatePage = ({ onAddUser, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        address: '',
        city: '',
        country: '',
        role: '',
        description: '',
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        document.title = 'Create User';
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const form = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                form.append(key, value);
            });
            if (selectedFile) {
                form.append('file', selectedFile); // 👈 field name must match backend
            }

            const res = await createUserApi(form); // 👈 your API call
            if (onAddUser) onAddUser(res.data);
            if (onClose) onClose();

            // Reset form
            setFormData({
                name: '',
                phone: '',
                email: '',
                password: '',
                address: '',
                city: '',
                country: '',
                role: '',
                description: '',
            });
            setSelectedFile(null);
            setPreviewUrl(null);
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
                <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    size="small"
                    value={formData.name}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    size="small"
                    value={formData.phone}
                    onChange={handleChange}
                    margin="normal"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    size="small"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    size="small"
                    value={formData.password}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
            </div>

            <TextField
                fullWidth
                label="Address"
                name="address"
                size="small"
                value={formData.address}
                onChange={handleChange}
                margin="normal"
            />

            <div className="grid grid-cols-2 gap-4">
                <TextField
                    fullWidth
                    label="City"
                    name="city"
                    size="small"
                    value={formData.city}
                    onChange={handleChange}
                    margin="normal"
                />
                {/* <TextField
                    fullWidth
                    label="Country"
                    name="country"
                    size="small"
                    value={formData.country}
                    onChange={handleChange}
                    margin="normal"
                /> */}
                <Autocomplete
                    disablePortal
                    options={countryOptions}
                    getOptionLabel={(option) => option.name}
                    value={
                        countryOptions.find((opt) => opt.name === formData.country) || null
                    }
                    onChange={(event, newValue) => {
                        setFormData((prev) => ({
                            ...prev,
                            country: newValue ? newValue.name : '',
                        }));
                    }}
                    isOptionEqualToValue={(option, value) =>
                        option.name === value.name
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Country"
                            size="small"
                            fullWidth
                            margin="normal"
                        />
                    )}
                />
            </div>

            <div className="grid grid-cols-2 items-center gap-4 mt-2">
                <Box display="flex" alignItems="center" gap={7}>
                    <Box position="relative" display="inline-block">
                        <Avatar
                            alt="User Avatar"
                            src={previewUrl}
                            sx={{ width: 45, height: 45 }}
                        />
                        <IconButton
                            component="label"
                            sx={{
                                position: 'absolute',
                                bottom: 3,
                                right: -45,
                                backgroundColor: '#fff',
                                border: '1px solid #ccc',
                                '&:hover': { backgroundColor: '#eee' },
                                zIndex: 1,
                            }}
                            size="small"
                        >
                            <PhotoCameraIcon fontSize="small" />
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </IconButton>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <TextField
                            label="Avatar"
                            size="small"
                            fullWidth
                            value={selectedFile?.name || ''}
                            disabled
                        />
                    </Box>
                </Box>

                <Autocomplete
                    disablePortal
                    options={typeRoleOptions}
                    getOptionLabel={(option) => option.name}
                    value={
                        typeRoleOptions.find((opt) => opt.name === formData.role) || null
                    }
                    onChange={(event, newValue) => {
                        setFormData((prev) => ({
                            ...prev,
                            role: newValue ? newValue.name : '',
                        }));
                    }}
                    isOptionEqualToValue={(option, value) =>
                        option.name === value.name
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Role"
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

export default UserCreatePage;
