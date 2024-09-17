import React from 'react';
import { Modal, Box, Typography, Button, IconButton } from '@mui/material';
import { IconX } from '@intersect.mbo/intersectmbo.org-icons-set';
const DeleteProposalModal = ({ open, onClose, handleDeleteProposal }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            data-testid='delete-proposal-modal'
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
                            id='modal-modal-title'
                            variant='h6'
                            component='h2'
                        >
                            Do you want to delete your proposal?
                        </Typography>
                        <IconButton onClick={onClose}>
                            <IconX width='24px' height='24px' />
                        </IconButton>
                    </Box>
                    <Typography
                        id='modal-modal-description'
                        mt={2}
                        color={(theme) => theme.palette.text.grey}
                    >
                        Clicking "Delete Proposal" will permanently remove your
                        proposal from the system. This action cannot be undone.
                    </Typography>
                </Box>
                <Box display='flex' flexDirection='column' padding={2} gap={2}>
                    <Button
                        variant='contained'
                        fullWidth
                        data-testid='delete-proposal-yes-button'
                        onClick={handleDeleteProposal}
                    >
                        Delete Proposal
                    </Button>
                    <Button
                        variant='outlined'
                        fullWidth
                        onClick={onClose}
                        data-testid='delete-proposal-no-button'
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default DeleteProposalModal;
