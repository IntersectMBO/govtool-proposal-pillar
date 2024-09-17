import { useTheme } from '@emotion/react';
import {
    IconExclamation,
    IconX,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import React from 'react';

const ExternalDataNotMatchModal = ({
    open,
    onClose,
    buttonOneClick,
    buttonTwoClick,
}) => {
    const theme = useTheme();
    return (
        <Modal open={open} onClose={onClose} data-testid='data-not-match-modal'>
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
                        justifyContent='flex-end'
                        alignItems={'center'}
                    >
                        <IconButton
                            onClick={onClose}
                            data-testid='data-not-match-modal-close-button'
                        >
                            <IconX width='24px' height='24px' />
                        </IconButton>
                    </Box>
                    <Box
                        display='flex'
                        flexDirection='row'
                        justifyContent='center'
                        alignItems={'center'}
                    >
                        <IconButton
                            sx={{
                                ':disabled': {
                                    backgroundColor: (theme) =>
                                        theme?.palette?.iconButton?.error_50,
                                },
                                width: '100px',
                                height: '100px',
                            }}
                            disabled
                        >
                            <IconExclamation
                                width='54px'
                                height='54px'
                                fill={theme?.palette?.iconButton?.error_200}
                            />
                        </IconButton>
                    </Box>
                    <Typography
                        id='data-not-match-modal-title'
                        data-testid='data-not-match-modal-title'
                        mt={2}
                        color={(theme) => theme.palette.text.darkPurple}
                        variant='h5'
                        component={'h5'}
                    >
                        Your External Data Does Not Match the Original File.
                    </Typography>
                    <Typography
                        id='data-not-match-modal-description-1'
                        data-testid='data-not-match-modal-description-1'
                        mt={2}
                        color={(theme) => theme.palette.text.darkPurple}
                        variant='body1'
                        component={'p'}
                    >
                        GovTool checks the URL you entered to see if the JSON
                        file that you self-host matches the one that was
                        generated in GovTool. To complete registration, this
                        match must be exact.
                    </Typography>
                    <Typography
                        id='data-not-match-modal-description-2'
                        data-testid='data-not-match-modal-description-2'
                        mt={2}
                        color={(theme) => theme.palette.text.darkPurple}
                        variant='body1'
                        component={'p'}
                    >
                        In this case, there is a mismatch. You can go back to
                        the data edit screen and try the process again.
                    </Typography>
                </Box>
                <Box display='flex' flexDirection='column' padding={2} gap={2}>
                    <Button
                        variant='contained'
                        fullWidth
                        sx={{
                            borderRadius: '20px',
                        }}
                        onClick={buttonOneClick}
                        data-testid='data-not-match-modal-go-to-data-button'
                    >
                        Go to Data Edit Screen
                    </Button>
                    <Button
                        variant='outlined'
                        fullWidth
                        sx={{
                            borderRadius: '20px',
                        }}
                        onClick={buttonTwoClick}
                        data-testid='data-not-match-modal-cancel-button'
                    >
                        Cancel registration
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ExternalDataNotMatchModal;
