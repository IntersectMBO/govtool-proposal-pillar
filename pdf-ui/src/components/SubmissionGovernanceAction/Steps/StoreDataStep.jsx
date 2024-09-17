'use client';

import React, { useState } from 'react';

import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { openInNewTab } from '../../../lib/utils';
import CancelGovActionSubmissionModal from '../Modals/CancelGovActionSubmissionModal';

const StoreDataStep = ({ setStep }) => {
    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);
    const [openCancelGASubmissionModal, setOpenCancelGASubmissionModal] =
        useState(false);

    const openLink = () =>
        openInNewTab(
            'https://docs.gov.tools/using-govtool/govtool-functions/storing-information-offline'
        );

    return (
        <>
            <Box
                display='flex'
                flexDirection='column'
                data-testid='store-data-step'
            >
                <Box>
                    <Card>
                        <CardContent
                            sx={{
                                ml: {
                                    xs: 0,
                                    sm: 5,
                                    md: 5,
                                    lg: 15,
                                },
                                mr: {
                                    xs: 0,
                                    sm: 5,
                                    md: 5,
                                    lg: 15,
                                },
                                mt: {
                                    xs: 0,
                                    sm: 2,
                                    md: 2,
                                    lg: 4,
                                },
                                mb: {
                                    xs: 0,
                                    sm: 2,
                                    md: 2,
                                    lg: 4,
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    mt: 2,
                                }}
                                display={'flex'}
                                flexDirection={'column'}
                                alignItems={'center'}
                            >
                                <Typography
                                    variant='h4'
                                    component={'h2'}
                                    gutterBottom
                                >
                                    Store and Maintain the Data Yourself
                                </Typography>

                                <Button
                                    variant='text'
                                    sx={{ mt: 2 }}
                                    onClick={openLink}
                                    data-testid='storing-information-link'
                                >
                                    Learn more about storing information
                                </Button>

                                <FormControlLabel
                                    id='registration-label1'
                                    sx={{
                                        my: 2,
                                        mx: 0,
                                        alignItems: 'center',
                                        width: '100%',
                                    }}
                                    control={
                                        <Checkbox
                                            id='submission-checkbox'
                                            name='agreeTerms'
                                            color='primary'
                                            onChange={(e) =>
                                                setChecked((prev) => !prev)
                                            }
                                            data-testid='agree-checkbox'
                                        />
                                    }
                                    label={
                                        <Typography
                                            variant='caption'
                                            sx={{ ml: 0.5 }}
                                        >
                                            I agree to store correctly this
                                            information and to maintain them
                                            over the years
                                        </Typography>
                                    }
                                />
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mt: 4,
                                }}
                            >
                                <Button
                                    variant='outlined'
                                    sx={{ float: 'left' }}
                                    onClick={() =>
                                        setOpenCancelGASubmissionModal(true)
                                    }
                                    data-testid='cancel-button'
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant='contained'
                                    onClick={() => setStep(2)}
                                    disabled={!checked}
                                    data-testid='continue-button'
                                >
                                    Continue
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
            <CancelGovActionSubmissionModal
                open={openCancelGASubmissionModal}
                onClose={() => setOpenCancelGASubmissionModal(false)}
            />
        </>
    );
};

export default StoreDataStep;
