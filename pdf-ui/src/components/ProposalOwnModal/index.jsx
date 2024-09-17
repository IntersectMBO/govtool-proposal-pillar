import { IconX } from '@intersect.mbo/intersectmbo.org-icons-set';
import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import React from 'react';

const ProposalOwnModal = ({ open, onClose }) => {
    return (
        <Modal open={open} onClose={onClose} data-testid='own-proposal-modal'>
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
                    borderBottom={1}
                    borderColor={(theme) => theme.palette.border.lightGray}
                >
                    <Box
                        display='flex'
                        flexDirection='row'
                        justifyContent='space-between'
                        alignItems={'center'}
                    >
                        <Typography
                            id='own-proposal-modal-title'
                            variant='h6'
                            component='h2'
                        >
                            Action not allowed
                        </Typography>
                        <IconButton onClick={onClose}>
                            <IconX width='24px' height='24px' />
                        </IconButton>
                    </Box>
                    <Typography
                        id='own-proposal-modal-description'
                        mt={2}
                        color={(theme) => theme.palette.text.grey}
                    >
                        You can not like or dislike your own proposal
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
                        data-testid='own-proposal-back-button'
                    >
                        Go back to Proposal
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ProposalOwnModal;
