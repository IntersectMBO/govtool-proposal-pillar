import { Box, TextField } from '@mui/material';
import React from 'react';

const CommitteeManager = ({
    proposalData,
    setProposalData,
    committeeManagerErrors,
    setCommitteeManagerErrors,
}) => {
    return (
        <>
            <Box display='flex' flexDirection='column' flexGrow={1}>
                <TextField
                    margin='normal'
                    label={`Numerator`}
                    variant='outlined'
                    placeholder='Numerator'
                    value={
                        proposalData?.proposal_committee_content?.numerator ||
                        ''
                    }
                    fullWidth
                    onChange={() => {}}
                    required
                    inputProps={{
                        'data-testid': `numerator-input`,
                    }}
                    error={!!committeeManagerErrors?.numerator}
                    helperText={committeeManagerErrors?.numerator}
                    FormHelperTextProps={{
                        sx: {
                            backgroundColor: 'transparent',
                        },
                        'data-testid': `numerator-error`,
                    }}
                />
            </Box>
            <Box display='flex' flexDirection='column' flexGrow={1}>
                <TextField
                    margin='normal'
                    label={`Denominator`}
                    variant='outlined'
                    placeholder='Denominator'
                    value={
                        proposalData?.proposal_committee_content?.denominator ||
                        ''
                    }
                    fullWidth
                    onChange={() => {}}
                    required
                    inputProps={{
                        'data-testid': `denominator-input`,
                    }}
                    error={!!committeeManagerErrors?.denominator}
                    helperText={committeeManagerErrors?.denominator}
                    FormHelperTextProps={{
                        sx: {
                            backgroundColor: 'transparent',
                        },
                        'data-testid': `denominator-error`,
                    }}
                />
            </Box>
        </>
    );
};

export default CommitteeManager;
