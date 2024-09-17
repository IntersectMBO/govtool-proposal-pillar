import { useTheme } from '@emotion/react';
import { IconCheck, IconX } from '@intersect.mbo/intersectmbo.org-icons-set';
import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const GovernanceActionSubmittedModal = ({ open, onClose }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    return (
        <Modal open={open} onClose={onClose} data-testid='ga-submitted-modal'>
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
                            data-testid='ga-submitted-modal-close-button'
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
                                        theme?.palette?.iconButton?.success_100,
                                },
                                width: '100px',
                                height: '100px',
                            }}
                            disabled
                        >
                            <IconCheck
                                width='54px'
                                height='54px'
                                fill={theme?.palette?.iconButton?.success_300}
                            />
                        </IconButton>
                    </Box>
                    <Typography
                        id='ga-submitted-modal-title'
                        data-testid='ga-submitted-modal-title'
                        mt={2}
                        color={(theme) => theme.palette.text.darkPurple}
                        variant='h5'
                        component={'h5'}
                    >
                        Governance Action submitted!
                    </Typography>
                    <Typography
                        id='ga-submitted-modal-description-1'
                        data-testid='ga-submitted-modal-description-1'
                        mt={2}
                        color={(theme) => theme.palette.text.darkPurple}
                        variant='body1'
                        component={'p'}
                    >
                        Your Governance Action may take a little time to submit
                        to the chain.
                    </Typography>
                </Box>
                <Box display='flex' flexDirection='column' padding={2} gap={2}>
                    <Button
                        variant='outlined'
                        fullWidth
                        sx={{
                            borderRadius: '20px',
                        }}
                        onClick={() => navigate('/proposal_discussion')}
                        data-testid='ga-submitted-modal-dashboard-button'
                    >
                        Go to Dashboard
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default GovernanceActionSubmittedModal;
