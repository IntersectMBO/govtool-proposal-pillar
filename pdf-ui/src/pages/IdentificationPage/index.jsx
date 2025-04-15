'use client';

import React from 'react';
import { Box, Button, Typography } from '@mui/material';
const IdentificationPage = ({ handleLogin, isDRep = false }) => {
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
                    {isDRep
                        ? 'Please verify your dRep identity using your wallet.'
                        : 'Please verify your identity using your wallet.'}
                </Typography>

                <Button
                    variant='contained'
                    sx={{
                        mt: 3,
                    }}
                    onClick={() =>
                        isDRep ? handleLogin(true, isDRep) : handleLogin(true)
                    }
                    data-testid='verify-identity-button'
                >
                    {isDRep
                        ? 'Verify your DRep identity'
                        : 'Verify your identity'}
                </Button>
            </Box>
        </Box>
    );
};

export default IdentificationPage;
