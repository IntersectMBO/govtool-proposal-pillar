import { useTheme } from '@emotion/react';
import { IconPlus, IconX } from '@intersect.mbo/intersectmbo.org-icons-set';
import { Box, Button, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { isRewardAddress, numberValidation } from '../../lib/utils';

const WithdrawalsManager = ({
    maxWithdrawals = 10,
    proposalData,
    setProposalData,
    withdrawalsErrors,
    setWithdrawalsErrors
   
}) => {
    const theme = useTheme();

    const handleWithdrawalChange = async (index, field, value) => {
        const newWithdrawal = proposalData?.proposal_withdrawals?.map((proposal_withdrawal, i) => {
                if (i === index) {
                    return { ...proposal_withdrawal, [field]: value };
                }
                return proposal_withdrawal;
            });
            setProposalData({
                ...proposalData,
                proposal_withdrawals: newWithdrawal,
            });
            // If the prop_receiving_address is empty, remove the error
            if (field === 'prop_' && value === '') {
                return setWithdrawalsErrors((prev) => {
                    const { [index]: removed, ...rest } = prev;
                    return rest;
                });
            }
            // Validate prop_receiving_address
            
            if (field === 'prop_receiving_address') {
            const validationResult = await isRewardAddress(value);
            setWithdrawalsErrors((prev) => ({
                ...prev,
                [index]: {
                    ...prev[index],
                    prop_receiving_address: validationResult===true ? '' : validationResult,
                },
            }));
            }
            if (field === 'prop_amount') {
                const validationResult = numberValidation(value);
                setWithdrawalsErrors((prev) => ({
                    ...prev,
                    [index]: {
                        ...prev[index],
                        prop_amount: validationResult===true ? '' : validationResult,
                    },
                }));
            }
        
    };


    const handleAddWithdrawal = () => {
        if (proposalData?.proposal_withdrawals?.length < maxWithdrawals) {
            setProposalData({
                ...proposalData,
                proposal_withdrawals: [
                    ...proposalData?.proposal_withdrawals, { prop_receiving_address: null, prop_amount: null }, 
                  ],
            });
        }
    };

    const handleRemoveWithdrawal = (index) => {
        let newWithdrawal = proposalData?.proposal_withdrawals?.filter(
            (_, i) => i !== index
        );
        setProposalData({
            ...proposalData,
            proposal_withdrawals: newWithdrawal,
        });

        // Remove errors for removed link
        setWithdrawalsErrors((prev) => {
            const { [index]: removed, ...rest } = prev;
            return rest;
        });
    };
    return (
        <Box>
            {proposalData?.proposal_withdrawals?.map((withdrawal, index) => (                
                <Box
                    key={index}
                    display='flex'
                    flexDirection='row'
                    mb={2}
                    backgroundColor={index>0?(theme) => theme.palette.primary.lightGray:""}
                    position='relative'
                >
                    <Box display='flex' flexDirection='column' flexGrow={1}>
                    {index === 0 ? null : (  
                        <Box display={'flex'} justifyContent={'flex-end'}>
                            <IconButton
                                onClick={() => handleRemoveWithdrawal(index)}
                                data-testid='withdrawal-wrapper-remove-address-button'
                            >
                                <IconX width='16px' height='16px' />
                            </IconButton>
                        </Box>
                        )}

                        <TextField
                                margin='normal'
                                label={`Receiving stake address ${index + 1}`}
                                variant='outlined'
                                placeholder='e.g. stake1...'
                                value={withdrawal.prop_receiving_address || ''}
                                fullWidth
                                onChange={(e) => {
                                            handleWithdrawalChange(
                                                index,
                                                'prop_receiving_address',
                                                e.target.value
                                    )}}
                                required
                                inputProps={{
                                    'data-testid': `receiving-address-${index}-input`,
                                }}
                                error={!!withdrawalsErrors[index]?.prop_receiving_address}
                                helperText={withdrawalsErrors[index]?.prop_receiving_address}
                                FormHelperTextProps={{
                                    sx: {
                                        backgroundColor: 'transparent',
                                    },
                                    'data-testid': `receiving-address-${index}-input`,
                                }}
                            />
                        <TextField
                                margin='normal'
                                label={`Amount ${index + 1}`}
                                type='tel'
                                variant='outlined'
                                placeholder='e.g. 2000 ada'
                                value={withdrawal?.prop_amount || ''}
                                fullWidth
                                onChange={ (e) =>
                                    handleWithdrawalChange(
                                        index,
                                        'prop_amount',
                                        e.target.value
                                    )}
                                required
                                inputProps={{
                                    'data-testid': `amount-${index}-input`,
                                }}
                                error={!!withdrawalsErrors[index]?.prop_amount}
                                helperText={withdrawalsErrors[index]?.prop_amount}
                                FormHelperTextProps={{
                                    sx: {
                                        backgroundColor: 'transparent',
                                    },
                                    'data-testid': `amount-${index}-input`,
                                }}
                        />
                    </Box>
                </Box>
            ))}
            {proposalData?.proposal_withdrawals?.length < maxWithdrawals && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 2,
                    }}
                >
                    <Button
                        variant='text'
                        mt={2}
                        startIcon={
                            <IconPlus fill={theme.palette.primary.main} />
                        }
                        onClick={handleAddWithdrawal}
                        data-testid='add-withdrawal-link-button'
                    >
                        Add withdrawal address
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default WithdrawalsManager;
