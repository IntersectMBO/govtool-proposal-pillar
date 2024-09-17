import { Box, CircularProgress, Modal, Typography } from '@mui/material';
import React from 'react';

const CheckingDataModal = ({ open }) => {
    return (
        <Modal open={open} data-testid='data-checking-modal'>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: {
                        xs: '90%',
                        sm: '50%',
                        md: '30%',
                    },
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    borderRadius: '20px',
                }}
            >
                <Box
                    pt={2}
                    pl={2}
                    pr={2}
                    pb={1}
                    borderColor={(theme) => theme.palette.border.lightGray}
                >
                    <Box
                        display='flex'
                        flexDirection='row'
                        justifyContent='center'
                        alignItems={'center'}
                    >
                        <CircularProgress
                            id='data-checking-modal-loader'
                            data-testid='data-checking-modal-loader'
                            size={60}
                            color='inherit'
                        />
                    </Box>
                    <Typography
                        id='data-checking-modal-title'
                        data-testid='data-checking-modal-title'
                        mt={2}
                        color={(theme) => theme.palette.text.darkPurple}
                        variant='h5'
                        component={'h5'}
                    >
                        GovTool Is Checking Your Data
                    </Typography>
                    <Typography
                        id='data-checking-modal-description'
                        data-testid='data-checking-modal-description'
                        mt={2}
                        color={(theme) => theme.palette.text.darkPurple}
                        variant='body1'
                        component={'p'}
                    >
                        GovTool will read the URL that you supplied and make a
                        check to see if it’s identical with the information that
                        you entered on the form.
                    </Typography>
                </Box>
            </Box>
        </Modal>
    );
};

export default CheckingDataModal;
