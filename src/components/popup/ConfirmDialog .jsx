// components/ConfirmDialog.jsx
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material';

const ConfirmDialog = ({ open, onClose, onConfirm, title, content }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title || "Are you sure?"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {content || "This action cannot be undone."}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined">Cancel</Button>
                <Button onClick={onConfirm} color="error" variant="contained">Delete</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
