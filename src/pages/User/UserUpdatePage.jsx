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
import { typeRoleOptions } from '../../data/Type';
import { updateUserApi } from '../../services/userApi';
import uploadUrl from '../../services/uploadApi';
import { countryOptions } from '../../data/Country';

const UserUpdatePage = ({ user, onUpdateProduct, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        role: '',
        description: '',
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
                country: user.country || '',
                role: user.role || '',
                description: user.description || '',
            });
            if (user.image_url?.path) {
                setPreviewUrl(`${uploadUrl}/${user.image_url?.path}`); // adjust path if needed
            }
        }
    }, [user]);
    console.log(user);

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
                form.append('file', selectedFile); // new image file
            }

            const res = await updateUserApi(user._id, form); // ← send update
            if (onUpdateProduct) onUpdateProduct(res.data);
            if (onClose) onClose();
        } catch (error) {
            console.error('Update Error:', error);
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
                />
                <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    size="small"
                    onChange={handleChange}
                    margin="normal"
                    placeholder="Leave blank to keep old password"
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
                    value={countryOptions.find((opt) => opt.name === formData.country) || null}
                    onChange={(event, newValue) =>
                        setFormData((prev) => ({
                            ...prev,
                            country: newValue ? newValue.name : '',
                        }))
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
                <Box display="flex" alignItems="center" gap={2}>
                    <Box position="relative" display="inline-block">
                        <Avatar src={previewUrl} sx={{ width: 45, height: 45 }} />
                        <IconButton
                            component="label"
                            sx={{
                                position: 'absolute',
                                bottom: 3,
                                right: -10,
                                backgroundColor: '#fff',
                                border: '1px solid #ccc',
                                '&:hover': { backgroundColor: '#eee' },
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
                            value={selectedFile?.name || user?.image_url?.name || ''}
                            disabled
                        />
                    </Box>
                </Box>

                <Autocomplete
                    disablePortal
                    options={typeRoleOptions}
                    getOptionLabel={(option) => option.name}
                    value={typeRoleOptions.find((opt) => opt.name === formData.role) || null}
                    onChange={(event, newValue) =>
                        setFormData((prev) => ({
                            ...prev,
                            role: newValue ? newValue.name : '',
                        }))
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
                Update
            </Button>
        </Box>
    );
};

export default UserUpdatePage;
