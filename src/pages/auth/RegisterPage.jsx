import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Paper,
    Alert,
    Snackbar,
} from '@mui/material';
import Assets from '../../assets/Assets';
import { createAuthApi } from '../../services/authApi';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // or 'error', 'info', 'warning'
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await createAuthApi(formData);

            setSnackbarMessage('Registration successful!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            setFormData({ name: '', email: '', phone: '', password: '' });
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // or 'bottom', etc.
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
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
                    width="100"
                    style={{ objectFit: 'contain', userSelect: 'none', pointerEvents: 'none' }}
                />
            </Box>
            <Paper elevation={3} sx={{ p: 4, mt: 0 }}>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        margin="normal"
                        required
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                    />

                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />

                    <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        margin="normal"
                        type='number'
                        required
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />

                    <Button
                        size='large'
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 3 }}
                    >
                        Register
                    </Button>
                    <p className='text-center mt-3'>
                        Already have an account?{' '}
                        <span
                            className='cursor-pointer !text-blue-600'
                            onClick={() => navigate('/login', { replace: true })}
                        >
                            Login
                        </span>
                    </p>
                </Box>
            </Paper>
        </Container>
    );
};

export default RegisterPage;
