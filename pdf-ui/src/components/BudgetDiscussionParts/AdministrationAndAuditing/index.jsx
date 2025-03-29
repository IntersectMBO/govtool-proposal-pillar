import { Box, Card, CardContent, Button, Typography, List, ListItem, TextField, MenuItem, Grid, Link } from "@mui/material"
import { useEffect, useState } from 'react';
import { getAllCurrencies } from '../../../lib/api';
import { StepperActionButtons } from '../../BudgetDiscussionParts';

const AdministrationAndAuditing = ({ setStep, step, currentBudgetDiscussionData, setBudgetDiscussionData, onClose, setSelectedDraftId, selectedDraftId, handleSaveDraft, errors, setErrors }) => {
    const handleDataChange = (e, dataName) => {
        setBudgetDiscussionData({
             ...currentBudgetDiscussionData,
            
                  ...currentBudgetDiscussionData,
                  [dataName]: e.target.value
             })
   };
    useEffect(() => {}, []);
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
                                Section 7: Administration and Auditing
                            </Typography>
                            <Box color={(theme) => theme.palette.text.grey}>
                                <Typography variant='body1' gutterBottom mb={2}>
                                    A successful proposal requires an Administrator. To ensure transparency and accuracy, audits may also be undertaken.
                                </Typography>
                                <Typography variant='body1' gutterBottom mb={2}>
                                    Intersect's role as an administrator, through our committees and internal operational function, would consist of the following:
                                    <List sx={{
                                        listStyleType: 'disc',
                                        marginLeft: 2,
                                        textAlign: 'justify',
                                        marginBottom: 0,
                                    }}>
                                        <ListItem sx={{textAlign: 'justify', display: 'list-item', paddingY: 0, marginY: 0 }}>
                                            <Typography variant='body1' gutterBottom >
                                                Contract management
                                            </Typography>
                                        </ListItem>
                                        <ListItem sx={{textAlign: 'justify', display: 'list-item', paddingY: 0, marginY: 0 }}>
                                            <Typography variant='body1' gutterBottom >
                                                Delivery assurance and Communications
                                            </Typography>
                                        </ListItem>
                                        <ListItem sx={{textAlign: 'justify', display: 'list-item', paddingY: 0, marginY: 0 }}>
                                            <Typography variant='body1' gutterBottom >
                                                Fund management
                                            </Typography>
                                        </ListItem>
                                        <ListItem sx={{textAlign: 'justify', display: 'list-item', paddingY: 0, marginY: 0 }}>
                                            <Typography variant='body1' gutterBottom >
                                                Fiat conversion
                                            </Typography>
                                        </ListItem>
                                        <ListItem sx={{textAlign: 'justify', display: 'list-item', paddingY: 0, marginY: 0 }}>
                                            <Typography variant='body1' gutterBottom >
                                                Legal
                                            </Typography>
                                        </ListItem>
                                        <ListItem sx={{textAlign: 'justify', display: 'list-item', paddingY: 0, marginY: 0 }}>
                                            <Typography variant='body1' gutterBottom >
                                                KYC / KYB
                                            </Typography>
                                        </ListItem>
                                        <ListItem sx={{textAlign: 'justify', display: 'list-item', paddingY: 0, marginY: 0 }}>
                                            <Typography variant='body1' gutterBottom >
                                                Dispute resolution
                                            </Typography>
                                        </ListItem>
                                        <ListItem sx={{textAlign: 'justify', display: 'list-item', paddingY: 0, marginY: 0 }}>
                                            <Typography variant='body1' gutterBottom >
                                                Technical and Financial auditing
                                            </Typography>
                                        </ListItem>
                                    </List>
                                </Typography>
                                
                                <TextField
                                        select
                                        name='Intersect named Administrator'
                                        label='Would you like Intersect to be your named Administrator, including acting as the auditor, as per the Cardano Constitution?*'
                                        value={currentBudgetDiscussionData?.intersect_named_administrator === undefined 
                                              ? "" : currentBudgetDiscussionData?.intersect_named_administrator
                                          }
                                        required
                                        fullWidth
                                        onChange={(e) => handleDataChange(e, 'intersect_named_administrator')}
                                        helperText={errors['intersect_named_administrator']?.trim()}
                                        error={!!errors['intersect_named_administrator']?.trim()}
                                        SelectProps={{
                                                SelectDisplayProps: {
                                                    'data-testid': 'itersect-named-administrator', 
                                                },
                                        }}
                                        sx={{ mb: 4 }}
                                        >
                                            <MenuItem value="" disabled data-testid="please-select-option">Please select</MenuItem>
                                            <MenuItem key={1} value={true} data-testid={`true-button`} >Yes</MenuItem>
                                            <MenuItem key={2} value={false} data-testid={`false-button`} >No</MenuItem>
                                    </TextField>
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
export default AdministrationAndAuditing;