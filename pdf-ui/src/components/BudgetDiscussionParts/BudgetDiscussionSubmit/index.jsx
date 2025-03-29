import { Box, Card, CardContent, Button, Typography, List, ListItem, TextField, MenuItem, Grid, Link, FormControlLabel, Checkbox} from "@mui/material"
import { useEffect, useState } from 'react';
import { getAllCurrencies } from '../../../lib/api';
import { StepperActionButtons } from '../../BudgetDiscussionParts';

const BudgetDiscussionSubmit = ({ setStep, step, currentBudgetDiscussionData, setBudgetDiscussionData, onClose, setSelectedDraftId, selectedDraftId, handleSaveDraft, errors, setErrors }) => {
   
    const handleDataChange = (e, dataName) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setBudgetDiscussionData({
             ...currentBudgetDiscussionData,
                               ...currentBudgetDiscussionData,
                  [dataName]: value
             })
   };
   const hadleSubmit = () => {
    console.log(currentBudgetDiscussionData);
    alert("Submit");
   }
    useEffect(() => {
        
        if(currentBudgetDiscussionData?.confidentiality === false)
            setBudgetDiscussionData({
                ...currentBudgetDiscussionData,
                                  ...currentBudgetDiscussionData,
                     confidentiality_description: ''
                })
    }, [currentBudgetDiscussionData]);
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
                                    Submit
                                </Typography>
                                <Box color={(theme) => theme.palette.text.grey}>
                                    {/* <TextField
                                        select
                                        name='Confidentiality'
                                        label='Confidentiality: Is there any reason why your proposal should be kept confidential?'
                                        value={typeof currentBudgetDiscussionData?.confidentiality === 'boolean' ? currentBudgetDiscussionData.confidentiality : ''}
                                        required
                                        fullWidth
                                        onChange={(e) => handleDataChange(e, 'confidentiality')}
                                        SelectProps={{
                                                SelectDisplayProps: {
                                                    'data-testid': 'itersect-named-administrator', 
                                                },
                                        }}
                                        sx={{ mb: 4 }}
                                        >
                                            <MenuItem key={1} value={true} data-testid={`true-button`} >Yes</MenuItem>
                                            <MenuItem key={2} value={false} data-testid={`false-button`} >No</MenuItem>
                                    </TextField>
                                    <TextField
                                        name='Confidential description'
                                        label='Which aspects of the proposal would you like to keep confidential and why?'
                                        rows={4}
                                        multiline
                                        value={currentBudgetDiscussionData?.confidentiality_description || ''}
                                        required
                                        fullWidth
                                        disabled={currentBudgetDiscussionData?.confidentiality !== true}
                                        onChange={(e) => handleDataChange(e, 'confidentiality_description')}
                                        sx={{ mb: 2 }}
                                    /> */}
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                            checked={currentBudgetDiscussionData?.privacy_policy}
                                            onChange={(e) => handleDataChange(e, 'privacy_policy')}
                                            />
                                        }
                                        label={
                                            <Typography variant="body2">
                                            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                                                I consent to the public sharing of all information provided in this form, except for Section 1 (Participant Details), in accordance with the Privacy Policy and Terms of Use.
                                            </a>
                                            </Typography>
                                        }
                                        />
                                </Box>
                            </Box>
                            <StepperActionButtons onClose={onClose} onSaveDraft={handleSaveDraft} onContinue={setStep}
                                   onBack={setStep} selectedDraftId={selectedDraftId} nextStep={step+1} backStep={step-1}
                            />
                        </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
export default BudgetDiscussionSubmit;