import { Box, Card, CardContent, Button, Typography, List, ListItem, TextField, MenuItem, Grid, Link } from "@mui/material"
import { useEffect, useState } from 'react';
import { getAllCurrencies } from '../../../lib/api';
import { StepperActionButtons } from '../../BudgetDiscussionParts';

const Costing = ({ setStep, step, currentBudgetDiscussionData, setBudgetDiscussionData, onClose, setSelectedDraftId, selectedDraftId, handleSaveDraft, errors, setErrors }) => {
    const [allCurrencyList, setAllCurrencyList] = useState([]);
    const costBreakdownMaxLength = 256;
    const handleDataChange = (e, dataName) => {
        setBudgetDiscussionData({
             ...currentBudgetDiscussionData,
             budget_discussion_costing: {
                  ...currentBudgetDiscussionData?.budget_discussion_costing,
                  [dataName]: e.target.value
             }})
   };
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!allCurrencyList.length) {
                    const allCurrenciesResponse = await getAllCurrencies();
                    setAllCurrencyList(allCurrenciesResponse?.data || []);
                   }
            } catch (error) {
                 console.error("Error fetching data:", error);
            }
       };
       fetchData();
    }, []);
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
                                Section 5: Costing
                            </Typography>
                            <Box color={(theme) => theme.palette.text.grey}>
                                <Typography variant='body1' gutterBottom mb={2}>
                                    Please provide requested cost of this proposal
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2}} >
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        name='ADA Amount'
                                        label='ADA Amount'
                                        value={currentBudgetDiscussionData?.budget_discussion_costing?.ada_amount || ''}
                                        required
                                        fullWidth
                                        onChange={(e) => handleDataChange(e, 'ada_amount')}
                                        sx={{ mb: 2 }}
                                     />    
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        name='USD to ADA Conversion Rate'
                                        label='USD to ADA Conversion Rate'
                                        value={currentBudgetDiscussionData?.budget_discussion_costing?.usd_to_ada_conversion_rate || ''}
                                        required
                                        fullWidth
                                        helperText={"The rate you used to budget for this proposal"}
                                        onChange={(e) => handleDataChange(e, 'usd_to_ada_conversion_rate')}
                                        sx={{ mb: 2 }}
                                     />  
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        select
                                        name='Preferred currency'
                                        label='Preferred currency'
                                        value={currentBudgetDiscussionData?.budget_discussion_costing?.preferred_currency || ''}
                                        required
                                        fullWidth
                                        onChange={(e) => handleDataChange(e, 'preferred_currency')}
                                        SelectProps={{
                                                SelectDisplayProps: {
                                                    'data-testid': 'preferred-currency', 
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
                                                    {option?.attributes?.currency_name} ({option?.attributes?.currency_letter_code})
                                            </MenuItem>
                                    ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        name='Amount in preferred currency'
                                        label='Amount in preferred currency'
                                        value={currentBudgetDiscussionData?.budget_discussion_costing?.amount_in_preferred_currency || ''}
                                        required
                                        fullWidth
                                        onChange={(e) => handleDataChange(e, 'amount_in_preferred_currency')}
                                        sx={{ mb: 2 }}
                                     />  
                                </Grid>
                            </Grid>
                        </Box>
                        <TextField
                            size='large'
                            name='Cost breakdown'
                            label='Cost breakdown'
                            rows={4}
                            sx={{ mb: 4 }}
                            fullWidth
                            multiline
                            value={currentBudgetDiscussionData?.budget_discussion_costing?.cost_breakdown || ''}
                            onChange={(e) => handleDataChange(e, 'cost_breakdown')}
                            helperText={(
                                    <>
                                        <Typography
                                            variant='caption'
                                            data-testid='cost-breakdown-helper-text'
                                        >
                                            * Based on your preferred contract type and cost estimate, please provide a cost breakdown in ada and in USD.
                                        </Typography>
                                        <Typography
                                            variant='caption'
                                            sx={{ float: 'right' }}
                                            data-testid='cost-breakdown-helper-character-count'
                                        >
                                            {`${
                                                currentBudgetDiscussionData?.budget_discussion_costing?.cost_breakdown?.length || 0
                                            }/${costBreakdownMaxLength}`}
                                        </Typography>
                                    </>
                                )
                            }
                            InputProps={{
                                inputProps: {
                                    maxLength: costBreakdownMaxLength,
                                    'data-testid': 'cost-breakdown-input',
                                },
                            }}
                            error={errors?.budget_discussion_costing?.cost_breakdown}
                            FormHelperTextProps={{
                                'data-testid': errors?.budget_discussion_costing?.cost_breakdown
                                    ? 'cost-breakdown-helper-error'
                                    : 'cost-breakdown-helper',
                            }}
                        />
                        <StepperActionButtons onClose={onClose} onSaveDraft={handleSaveDraft} onContinue={setStep}
                            onBack={setStep} selectedDraftId={selectedDraftId} nextStep={step+1} backStep={step-1}
                         />
                        </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
export default Costing;