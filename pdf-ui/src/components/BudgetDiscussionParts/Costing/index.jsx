import {
    Box,
    Card,
    CardContent,
    Button,
    Typography,
    List,
    ListItem,
    TextField,
    MenuItem,
    Grid,
    Link,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getAllCurrencies } from '../../../lib/api';
import { StepperActionButtons } from '../../BudgetDiscussionParts';

const Costing = ({
    setStep,
    step,
    currentBudgetDiscussionData,
    setBudgetDiscussionData,
    onClose,
    setSelectedDraftId,
    selectedDraftId,
    handleSaveDraft,
    errors,
    setErrors,
    validateSection,
}) => {
    const [allCurrencyList, setAllCurrencyList] = useState([]);
    const costBreakdownMaxLength = 15000;
    const [touched, setTouched] = useState({
        ada_amount: false,
        usd_to_ada_conversion_rate: false,
        amount_in_preferred_currency: false,
    });
    const handleDataChange = (e, dataName) => {
        setBudgetDiscussionData({
            ...currentBudgetDiscussionData,
            bd_costing: {
                ...currentBudgetDiscussionData?.bd_costing,
                [dataName]: e.target.value,
            },
        });
        setTouched({
            ...touched,
            dataName: false,
        });
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!allCurrencyList.length) {
                    const allCurrenciesResponse = await getAllCurrencies();
                    setAllCurrencyList(allCurrenciesResponse?.data || []);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        validateSection('bd_costing');
    }, [currentBudgetDiscussionData?.bd_costing]);
    return (
        <Box display='flex' flexDirection='column'>
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
                        }}
                    >
                        <Box
                            sx={{
                                align: 'center',
                                textAlign: 'center',
                                mt: 2,
                            }}
                        >
                            <Typography variant='h4' gutterBottom mb={2}>
                                Section 4: Costing
                            </Typography>
                            <Box
                                sx={{ mt: 1, mb: 4 }}
                                display={'flex'}
                                alignItems={'center'}
                                justifyContent={'center'}
                                gap={0.5}
                            >
                                <Typography
                                    variant='body1'
                                    fontWeight={500}
                                    color={'text.black'}
                                >
                                    4
                                </Typography>
                                <Typography
                                    variant='body1'
                                    fontWeight={500}
                                    color={'text.black'}
                                >
                                    /
                                </Typography>
                                <Typography
                                    variant='body1'
                                    fontWeight={300}
                                    color={'text.black'}
                                >
                                    6
                                </Typography>
                            </Box>
                            <Box color={(theme) => theme.palette.text.grey}>
                                <Typography variant='body1' gutterBottom mb={2}>
                                    Please provide requested cost of this
                                    proposal
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        name='ADA Amount'
                                        label='ADA Amount'
                                        value={
                                            currentBudgetDiscussionData
                                                ?.bd_costing?.ada_amount || ''
                                        }
                                        required
                                        //changed to string from number to allow entering letters for error notifications
                                        type='string'
                                        fullWidth
                                        onChange={(e) =>
                                            handleDataChange(e, 'ada_amount')
                                        }
                                        sx={{ mb: 2 }}
                                        onBlur={() => {
                                            if (!touched.ada_amount) {
                                                setTouched({
                                                    ...touched,
                                                    ada_amount: true,
                                                });
                                            }
                                        }}
                                        InputProps={{
                                            inputProps: {
                                                'data-testid':
                                                    'ada-amount-input',
                                            },
                                        }}
                                        helperText={
                                            touched.ada_amount &&
                                            errors[
                                                'bd_costing.ada_amount'
                                            ]?.trim()
                                        }
                                        error={
                                            touched.ada_amount &&
                                            !!errors[
                                                'bd_costing.ada_amount'
                                            ]?.trim()
                                        }
                                        FormHelperTextProps={{
                                            ...(errors[
                                                'bd_costing.ada_amount'
                                            ]?.trim() && {
                                                'data-testid':
                                                    'ada-amount-error',
                                            }),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        name='USD to ADA Conversion Rate'
                                        label='USD to ADA Conversion Rate'
                                        value={
                                            currentBudgetDiscussionData
                                                ?.bd_costing
                                                ?.usd_to_ada_conversion_rate ||
                                            ''
                                        }
                                        required
                                        fullWidth
                                        type='string'
                                        onBlur={() => {
                                            setTouched({
                                                ...touched,
                                                usd_to_ada_conversion_rate: true,
                                            });
                                        }}
                                        helperText={
                                            (touched.usd_to_ada_conversion_rate &&
                                                errors[
                                                    'bd_costing.usd_to_ada_conversion_rate'
                                                ]?.trim()) ||
                                            'The rate you used to budget for this proposal'
                                        }
                                        error={
                                            touched.usd_to_ada_conversion_rate &&
                                            !!errors[
                                                'bd_costing.usd_to_ada_conversion_rate'
                                            ]?.trim()
                                        }
                                        onChange={(e) =>
                                            handleDataChange(
                                                e,
                                                'usd_to_ada_conversion_rate'
                                            )
                                        }
                                        sx={{ mb: 2 }}
                                        InputProps={{
                                            inputProps: {
                                                'data-testid':
                                                    'usd-ada-conversion-input',
                                            },
                                        }}
                                        FormHelperTextProps={{
                                            ...(errors[
                                                'bd_costing.ada_amount'
                                            ]?.trim() && {
                                                'data-testid':
                                                    'usd-to-ada-converson-error',
                                            }),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        select
                                        name='Preferred currency'
                                        label='Preferred currency'
                                        value={
                                            currentBudgetDiscussionData
                                                ?.bd_costing
                                                ?.preferred_currency || ''
                                        }
                                        required
                                        fullWidth
                                        // helperText={errors[
                                        //     'bd_costing.preferred_currency'
                                        // ]?.trim()}
                                        // error={
                                        //     !!errors[
                                        //         'bd_costing.preferred_currency'
                                        //     ]?.trim()
                                        // }
                                        onChange={(e) =>
                                            handleDataChange(
                                                e,
                                                'preferred_currency'
                                            )
                                        }
                                        SelectProps={{
                                            SelectDisplayProps: {
                                                'data-testid':
                                                    'preferred-currency',
                                            },
                                        }}
                                        sx={{ mb: 4 }}
                                    >
                                        {allCurrencyList?.map((option) => (
                                            <MenuItem
                                                key={option?.id}
                                                value={option?.id}
                                                data-testid={`${option?.attributes.currency_name?.toLowerCase()}-button`}
                                            >
                                                {
                                                    option?.attributes
                                                        ?.currency_name
                                                }{' '}
                                                (
                                                {
                                                    option?.attributes
                                                        ?.currency_letter_code
                                                }
                                                )
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        name='Amount in preferred currency'
                                        label='Amount in preferred currency'
                                        value={
                                            currentBudgetDiscussionData
                                                ?.bd_costing
                                                ?.amount_in_preferred_currency ||
                                            ''
                                        }
                                        required
                                        type='string'
                                        helperText={
                                            touched.amount_in_preferred_currency &&
                                            errors[
                                                'bd_costing.amount_in_preferred_currency'
                                            ]?.trim()
                                        }
                                        onBlur={(e) => {
                                            setTouched({
                                                ...touched,
                                                amount_in_preferred_currency: true,
                                            });
                                        }}
                                        error={
                                            touched.amount_in_preferred_currency &&
                                            !!errors[
                                                'bd_costing.amount_in_preferred_currency'
                                            ]?.trim()
                                        }
                                        fullWidth
                                        onChange={(e) =>
                                            handleDataChange(
                                                e,
                                                'amount_in_preferred_currency'
                                            )
                                        }
                                        sx={{ mb: 2 }}
                                        InputProps={{
                                            inputProps: {
                                                'data-testid':
                                                    'preferred-currency-amount-input',
                                            },
                                        }}
                                        FormHelperTextProps={{
                                            ...(errors[
                                                'bd_costing.amount_in_preferred_currency'
                                            ]?.trim() && {
                                                'data-testid':
                                                    'preferred-currency-error',
                                            }),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                        <TextField
                            size='large'
                            name='Cost breakdown'
                            label='Cost breakdown'
                            required
                            rows={4}
                            sx={{ mb: 4 }}
                            fullWidth
                            multiline
                            value={
                                currentBudgetDiscussionData?.bd_costing
                                    ?.cost_breakdown || ''
                            }
                            onChange={(e) =>
                                handleDataChange(e, 'cost_breakdown')
                            }
                            helperText={
                                <>
                                    <Typography
                                        variant='caption'
                                        data-testid='cost-breakdown-helper-text'
                                    >
                                        Based on your preferred contract type
                                        and cost estimate, please provide a cost
                                        breakdown in ada and in USD.
                                    </Typography>
                                    <Typography
                                        variant='caption'
                                        sx={{ float: 'right' }}
                                        data-testid='cost-breakdown-helper-character-count'
                                    >
                                        {`${
                                            currentBudgetDiscussionData
                                                ?.bd_costing?.cost_breakdown
                                                ?.length || 0
                                        }/${costBreakdownMaxLength}`}
                                    </Typography>
                                </>
                            }
                            InputProps={{
                                inputProps: {
                                    maxLength: costBreakdownMaxLength,
                                    'data-testid': 'cost-breakdown-input',
                                },
                            }}
                            // error={
                            //     !!errors['bd_costing.cost_breakdown']?.trim()
                            // }
                            FormHelperTextProps={{
                                'data-testid': errors?.bd_costing
                                    ?.cost_breakdown
                                    ? 'cost-breakdown-helper-error'
                                    : 'cost-breakdown-helper',
                            }}
                        />
                        <StepperActionButtons
                            onClose={onClose}
                            onSaveDraft={handleSaveDraft}
                            onContinue={setStep}
                            onBack={setStep}
                            selectedDraftId={selectedDraftId}
                            nextStep={step + 1}
                            backStep={step - 1}
                            errors={errors}
                            showSaveDraft={
                                !currentBudgetDiscussionData?.master_id
                            }
                        />
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};
export default Costing;
