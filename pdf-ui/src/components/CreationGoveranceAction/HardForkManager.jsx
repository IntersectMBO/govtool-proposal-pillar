import { Box, minor, TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { getHardForkData } from '../../lib/api';
import { numberValidation } from '../../lib/utils';

const HardForkManager = ({
    proposalData,
    setProposalData,
    hardForkErrors,
    setHardForkErrors,
    isEdit = null, // Flag to indicate if the component is in edit mode
}) => {
        const fetchAndSetHardForkData = async () => {
        try {
            const resp = await getHardForkData();
            const data = resp.data;

            if (data) {
                setProposalData((prevData) => ({
                    ...prevData,
                    proposal_hard_fork_content: {
                        ...prevData.proposal_hard_fork_content,
                        previous_ga_hash: data.hash,
                        previous_ga_id: data.id,
                    },
                }));
            }
        } catch (error) {
            console.error('Error fetching hard fork data:', error);
        }
    };

  useEffect(() => {    
        if (isEdit === false) 
        fetchAndSetHardForkData();
        
    }, []);
    useEffect(() => {   
        if (isEdit === true)
        {
            if(proposalData?.proposal_hard_fork_content?.data?.attributes) 
            {
                let temp = proposalData?.proposal_hard_fork_content?.data?.attributes;
            
                setProposalData((prevData) => ({
                ...prevData,
                proposal_hard_fork_content: {
                        previous_ga_hash: temp?.previous_ga_hash,
                        previous_ga_id: temp?.previous_ga_id,
                        major: temp?.major,
                        minor: temp?.minor,
            
        }}))
        }}
    }, [proposalData?.proposal_hard_fork_content?.data?.attributes]);
        const handleHardForkDataChange = (field, value) => {
        setProposalData((prevData) => ({
            ...prevData,
            proposal_hard_fork_content: {
                ...prevData.proposal_hard_fork_content,
                [field]: value,
            },
        }));
        const validationError = validateNumberInput(value);
        if (!validationError.value) {
            setHardForkErrors((prevErrors) => {
                const { [field]: removed, ...rest } = prevErrors;
                return rest;
            });
        } else {
            setHardForkErrors((prevErrors) => ({
                ...prevErrors,
                [field]: validationError.text,
            }));
        }
    };

    const validateNumberInput = (value) => {
        if (isNaN(value) || value === '') {
            return { value: true, text: 'Please enter a valid number' };
        } else if (value < 0) {
            return { value: true, text: 'Number cannot be negative' };
        } else {
            return { value: false, text: '' };
        }
    };
    return (
        <>
            <Box display='flex' flexDirection='column' flexGrow={1}>
                <TextField
                    margin='normal'
                    label={`Previous Gov Action Hash`}
                    variant='outlined'
                    placeholder='txHash#index'
                    value={
                        proposalData?.proposal_hard_fork_content
                            ?.previous_ga_hash || ''
                    }
                    fullWidth
                    onChange={() => {}}
                    // required
                    disabled
                    inputProps={{
                        'data-testid': `previous-ga-hash-input`,
                    }}
                    error={!!hardForkErrors?.previous_ga_hash}
                    helperText={hardForkErrors?.previous_ga_hash}
                    FormHelperTextProps={{
                        sx: {
                            backgroundColor: 'transparent',
                        },
                        'data-testid': `previous-ga-hash-error`,
                    }}
                />
            </Box>
            <Box display='flex' flexDirection='column' flexGrow={1}>
                <TextField
                    margin='normal'
                    label={`Previous Gov Action ID`}
                    variant='outlined'
                    placeholder='txHash#index'
                    disabled
                    value={
                        proposalData?.proposal_hard_fork_content
                            ?.previous_ga_id || ''
                    }
                    fullWidth
                    onChange={() => {}}
                    // required
                    inputProps={{
                        'data-testid': `previous-ga-id-input`,
                    }}
                    error={!!hardForkErrors?.previous_ga_id}
                    helperText={hardForkErrors?.previous_ga_id}
                    FormHelperTextProps={{
                        sx: {
                            backgroundColor: 'transparent',
                        },
                        'data-testid': `previous-ga-id-error`,
                    }}
                />
            </Box>

            <Box display='flex' flexDirection='column' flexGrow={1}>
                <TextField
                    margin='normal'
                    label={`Major version`}
                    variant='outlined'
                    placeholder=''
                    value={
                        proposalData?.proposal_hard_fork_content?.major || ''
                    }
                    fullWidth
                    onChange={(e) => {
                        handleHardForkDataChange('major', e.target.value);
                    }}
                    required
                    inputProps={{
                        'data-testid': `major-input`,
                    }}
                    error={!!hardForkErrors?.major}
                    helperText={hardForkErrors?.major}
                    FormHelperTextProps={{
                        sx: {
                            backgroundColor: 'transparent',
                        },
                        'data-testid': `major-error`,
                    }}
                />
            </Box>
            <Box display='flex' flexDirection='column' flexGrow={1}>
                <TextField
                    margin='normal'
                    label={`Minor version`}
                    variant='outlined'
                    placeholder=''
                    value={
                        proposalData?.proposal_hard_fork_content?.minor || ''
                    }
                    fullWidth
                    onChange={(e) => {
                        handleHardForkDataChange('minor', e.target.value);
                    }}
                    required
                    inputProps={{
                        'data-testid': `minor-input`,
                    }}
                    error={!!hardForkErrors?.minor}
                    helperText={hardForkErrors?.minor}
                    FormHelperTextProps={{
                        sx: {
                            backgroundColor: 'transparent',
                        },
                        'data-testid': `minor-error`,
                    }}
                />
            </Box>
        </>
    );
};
export default HardForkManager;