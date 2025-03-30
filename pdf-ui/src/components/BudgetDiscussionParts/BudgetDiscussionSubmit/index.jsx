import { Box, Card, CardContent, Typography, FormControlLabel, Checkbox} from "@mui/material"
import { useEffect } from 'react';

import { StepperActionButtons } from '../../BudgetDiscussionParts';

const BudgetDiscussionSubmit = ({ setStep, step, currentBudgetDiscussionData, setBudgetDiscussionData, onClose,  selectedDraftId, handleSaveDraft }) => {
   
    const handleDataChange = (e, dataName) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setBudgetDiscussionData({
             ...currentBudgetDiscussionData,
                               ...currentBudgetDiscussionData,
                  [dataName]: value
             })
   };

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