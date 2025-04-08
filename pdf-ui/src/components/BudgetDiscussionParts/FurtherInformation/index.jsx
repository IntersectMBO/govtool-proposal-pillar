import { Box, Card, CardContent, Button, Typography, List, ListItem, TextField, MenuItem, Grid, Link } from "@mui/material"
import { useEffect, useState } from 'react';
import { BudgetDiscussionLinkManager, StepperActionButtons } from '../../BudgetDiscussionParts';
import { isValidURLFormat } from '../../../lib/utils';
import { useTheme } from '@mui/material/styles';

const FurtherInformation = ({ setStep, step, currentBudgetDiscussionData, setBudgetDiscussionData, onClose, setSelectedDraftId, selectedDraftId, handleSaveDraft, errors, setErrors }) => {
    const costBreakdownMaxLength = 256;
    
    const handleDataChange = (e, dataName) => {
        setBudgetDiscussionData({
             ...currentBudgetDiscussionData,
             bd_further_information: {
                  ...currentBudgetDiscussionData?.bd_further_information,
                  [dataName]: e.target.value
             }})
   };
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
                                Section 5: Further information
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
                                    5
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
                                    Please link your full proposal and any
                                    supplementary information on this proposal
                                    to help aid knowledge sharing. (E.g.,
                                    Specifications, Videos, Initiation, or
                                    Proposal Documents.)
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ align: 'center', mt: 2 }}>
                            <BudgetDiscussionLinkManager
                                budgetDiscussionData={
                                    currentBudgetDiscussionData
                                }
                                setBudgetDiscussionData={
                                    setBudgetDiscussionData
                                }
                                setLinksData={(links) =>
                                    handleDataChange(links, 'proposal_links')
                                }
                                errors={errors}
                                setErrors={setErrors}
                            />
                        </Box>
                        <StepperActionButtons
                            onClose={onClose}
                            onSaveDraft={handleSaveDraft}
                            onContinue={setStep}
                            onBack={setStep}
                            selectedDraftId={selectedDraftId}
                            nextStep={step + 1}
                            backStep={step - 1}
                            errors={errors}
                        />
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
export default FurtherInformation;