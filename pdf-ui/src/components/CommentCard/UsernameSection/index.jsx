import React from 'react';

import { Box, Chip, Link, Typography } from '@mui/material';
import ValidationCheckmark from '../../../assets/svg/ValidationCheckmark';
const UsernameSection = ({ drepData, comment }) => {
    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                <Typography variant='h6'>
                    @{comment?.attributes?.user_govtool_username || ''}
                </Typography>
                {comment?.attributes?.user_is_validated === true ? (
                    <ValidationCheckmark />
                ) : null}
                {drepData?.view && <Chip data-testid='dRep-tag' label='DRep' />}
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                {drepData?.givenName && (
                    <Link
                        href={'/connected/drep_directory/' + drepData?.view}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Typography
                            variant='caption'
                            data-testid='dRep-given-name'
                        >
                            {drepData?.givenName || ''}
                        </Typography>
                    </Link>
                )}

                {drepData?.view && (
                    <Link
                        href={'/connected/drep_directory/' + drepData?.view}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Typography variant='caption' data-testid='dRep-id'>
                            {drepData?.view?.slice(0, 26) + '...' || ''}
                        </Typography>
                    </Link>
                )}
            </Box>
        </Box>
    );
};

export default UsernameSection;
