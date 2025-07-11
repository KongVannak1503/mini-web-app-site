// src/pages/LoginPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    InputAdornment,
    IconButton,
    Container,
    CircularProgress,
    Paper,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    AccountCircle,
    Lock,
} from '@mui/icons-material';
import Logo from '../../assets/logo.png';
import { useAuth } from '../../contexts/AuthContext';
import { LoginUser } from '../../services/authApi';
import { attachTokenToApi } from '../../services/api';

const LoginPage = () => {
    const { isLoading, token, setToken, content } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate('/', { replace: true });
        }
    }, [token, navigate]);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoadingBtn(true);
        try {
            const res = await LoginUser(email, password);
            const accessToken = res.data.accessToken;
            setToken(accessToken);
            attachTokenToApi(accessToken);
            navigate('/');
        } catch (err) {
            setError(content?.loginFailed || 'Login failed');
        } finally {
            setLoadingBtn(false);
        }
    };

    if (isLoading) {
        return (
            <Box
                sx={{
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Container
            maxWidth="xs"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                px: 2,
            }}
        >
            <Box mb={4}>
                <img src={Logo} alt="Logo" style={{ width: 120, objectFit: 'contain' }} />
            </Box>

            <Paper sx={{ p: 4, width: '100%' }} elevation={3}>
                <Typography
                    variant="h5"
                    component="h1"
                    align="center"
                    gutterBottom
                    sx={{ fontWeight: 'bold' }}
                >
                    {content?.loginToSystem || 'Login to System'}
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleLogin}
                    noValidate
                    sx={{ mt: 2 }}
                >
                    <TextField
                        label={content?.email || 'email'}
                        variant="outlined"
                        fullWidth
                        required
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}

                    />

                    <TextField
                        label={content?.password || 'Password'}
                        variant="outlined"
                        fullWidth
                        required
                        margin="normal"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                        aria-label="toggle password visibility"
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {error && (
                        <Typography
                            color="error"
                            variant="body2"
                            align="center"
                            sx={{ mt: 1, mb: 1 }}
                        >
                            {error}
                        </Typography>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        sx={{ mt: 3 }}
                        disabled={loadingBtn}
                    >
                        {loadingBtn ? <CircularProgress size={24} color="inherit" /> : content?.login || 'Login'}
                    </Button>
                    <p className='text-center mt-3'>
                        Don't have any account?{' '}
                        <span
                            className='cursor-pointer !text-blue-600'
                            onClick={() => navigate('/register', { replace: true })}
                        >
                            Register
                        </span>
                    </p>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginPage;
