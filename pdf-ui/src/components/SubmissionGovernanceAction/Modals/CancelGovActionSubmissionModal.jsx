'use client';

import { useTheme } from '@emotion/react';
import {
    IconExclamation,
    IconX,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CancelGovActionSubmissionModal = ({ open, onClose }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Modal
            open={open}
            onClose={onClose}
            data-testid='cancel-ga-submission-modal'
        >
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
                            data-testid='cancel-ga-submission-modal-close-button'
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
                        id='cancel-ga-submission-modal-title'
                        data-testid='cancel-ga-submission-modal-title'
                        mt={2}
                        color={(theme) => theme.palette.text.darkPurple}
                        variant='h5'
                        component={'h5'}
                    >
                        Do you want to Cancel your Governance Action submission?
                    </Typography>
                    <Typography
                        id='cancel-ga-submission-modal-description'
                        data-testid='cancel-ga-submission-modal-description'
                        mt={2}
                        color={(theme) => theme.palette.text.darkPurple}
                        variant='body1'
                        component={'p'}
                    >
                        Returning to the proposal list will cancel your
                        submission and your proposed Governance Action will not
                        be submitted.
                    </Typography>
                </Box>
                <Box display='flex' flexDirection='column' padding={2} gap={2}>
                    <Button
                        variant='contained'
                        fullWidth
                        sx={{
                            borderRadius: '20px',
                        }}
                        onClick={onClose}
                        data-testid='cancel-ga-submission-modal-no-button'
                    >
                        I don’t want to cancel
                    </Button>
                    <Button
                        variant='text'
                        fullWidth
                        sx={{
                            borderRadius: '20px',
                        }}
                        onClick={() => navigate('/proposal_discussion')}
                        data-testid='cancel-ga-submission-modal-yes-button'
                    >
                        Yes, cancel my proposal submission and take me to the to
                        proposal list
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default CancelGovActionSubmissionModal;
