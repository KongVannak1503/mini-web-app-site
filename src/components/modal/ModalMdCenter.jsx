import React, { useEffect } from 'react';
import {
    Modal,
    Box,
    Typography,
    Fade,
    Backdrop,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ModalMdCenter = ({
    open,
    onCancel,
    title = 'Custom Modal',
    width = 750,
    children,
}) => {
    // useEffect(() => {
    //     if (open) {
    //         document.body.style.overflow = 'hidden';
    //     } else {
    //         document.body.style.overflow = 'auto';
    //     }
    //     return () => {
    //         document.body.style.overflow = 'auto';
    //     };
    // }, [open]);

    return (
        <Modal
            open={open}
            onClose={onCancel}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 300 }}
            disableEscapeKeyDown
            disableAutoFocus
            aria-labelledby="custom-modal-title"
            sx={{ zIndex: 2000 }}
        >
            <Fade in={open}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        maxHeight: '80vh',
                        outline: 'none',
                        p: 0, // Remove padding here and move it inside child sections
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {/* Fixed Header */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            px: 3,
                            py: 2,
                            borderBottom: '1px solid #eee',
                        }}
                    >
                        <Typography id="custom-modal-title" variant="h6" fontWeight="bold">
                            {title}
                        </Typography>
                        <IconButton onClick={onCancel} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Scrollable Content */}
                    <Box
                        sx={{
                            px: 3,
                            py: 2,
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            maxHeight: 'calc(80vh - 64px)', // adjust height subtracting header height
                        }}
                    >
                        {children}
                    </Box>
                </Box>
            </Fade>
        </Modal>

    );
};

export default ModalMdCenter;
