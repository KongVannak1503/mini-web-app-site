import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchInput = ({ value, onChange, placeholder = "Search..." }) => {
    return (
        <TextField
            fullWidth
            placeholder={placeholder}
            variant="outlined"
            size="small"
            value={value}
            onChange={onChange}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton edge="end" size="small">
                            <SearchIcon fontSize="small" />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
};

export default SearchInput;
