import React from 'react';
import { useTheme } from '@emotion/react';
import {
    IconExclamation,
    IconX,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import { getItemFromLocalStorage, correctAdaFormat } from '../../../lib/utils';
const PROTOCOL_PARAMS_KEY = 'protocol_params';

const InsufficientBallanceModal = ({ open, onClose, buttonOneClick }) => {
    const theme = useTheme();
    const protocolParams = getItemFromLocalStorage(PROTOCOL_PARAMS_KEY);

    return (
        <Modal
            open={open}
            onClose={onClose}
            data-testid='insufficient-ballance-error-modal'
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
                            data-testid='insufficient-ballance-error-modal-close-button'
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
                        id='insufficient-ballance-error-modal-title'
                        data-testid='insufficient-ballance-error-modal-title'
                        mt={2}
                        color={(theme) => theme.palette.text.darkPurple}
                        variant='h5'
                        component={'h5'}
                    >
                        Insufficient Balance
                    </Typography>
                    <Typography
                        id='insufficient-ballance-error-modal-description'
                        data-testid='insufficient-ballance-error-modal-description'
                        mt={2}
                        color={(theme) => theme.palette.text.darkPurple}
                        variant='body1'
                        component={'p'}
                    >
                        To submit a Governance Action, you will be required to
                        post a refundable balance of ₳
                        {correctAdaFormat(protocolParams?.gov_action_deposit)}.
                        You do not currently have enough ADA in your wallet to
                        continue.
                    </Typography>
                </Box>
                <Box display='flex' flexDirection='column' padding={2} gap={2}>
                    <Button
                        variant='outlined'
                        fullWidth
                        sx={{
                            borderRadius: '20px',
                        }}
                        onClick={buttonOneClick}
                        data-testid='cancel-button'
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default InsufficientBallanceModal;
