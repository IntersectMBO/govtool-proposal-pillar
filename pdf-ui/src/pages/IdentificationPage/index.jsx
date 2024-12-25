'use client';

import React from 'react';
import { Box, Button, Typography } from '@mui/material';
const IdentificationPage = ({ handleLogin }) => {
    return (
        <Box
            width={'100%'}
            height={'70vh'}
            display={'flex'}
            justifyContent={'centet'}
            alignItems={'center'}
        >
            <Box textAlign={'center'} width={'100%'}>
                <Typography
                    variant='body1'
                    sx={{
                        mt: 2,
                    }}
                >
                    Please verify your identity using your wallet.
                </Typography>

                <Button
                    variant='contained'
                    sx={{
                        mt: 3,
                    }}
                    onClick={handleLogin}
                    data-testid='verify-identity-button'
                >
                    Verify your identity
                </Button>
            </Box>
        </Box>
    );
};

export default IdentificationPage;
