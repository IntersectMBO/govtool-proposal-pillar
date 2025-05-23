import {
    Box,
    Card,
    CardContent,
    Typography,
    FormControlLabel,
    Checkbox,
} from '@mui/material';

import { StepperActionButtons } from '../../BudgetDiscussionParts';

const BudgetDiscussionSubmit = ({
    setStep,
    step,
    currentBudgetDiscussionData,
    setBudgetDiscussionData,
    onClose,
    selectedDraftId,
    handleSaveDraft,
    errors,
}) => {
    const handleDataChange = (e, dataName) => {
        const value =
            e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        setBudgetDiscussionData({
            ...currentBudgetDiscussionData,
            [dataName]: value,
        });
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
                                Privacy Policy & Terms of Use
                            </Typography>
                            <Box color={(theme) => theme.palette.text.grey}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                currentBudgetDiscussionData?.privacy_policy ===
                                                true
                                                    ? true
                                                    : false
                                            }
                                            onChange={(e) =>
                                                handleDataChange(
                                                    e,
                                                    'privacy_policy'
                                                )
                                            }
                                            inputProps={{
                                                'data-testid':
                                                    'submit-checkbox',
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography variant='body2'>
                                            I consent to the public sharing of
                                            all information provided in this
                                            form in accordance with the{' '}
                                            <span>
                                                <a
                                                    href='https://docs.intersectmbo.org/legal/policies-and-conditions/privacy-policy'
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                >
                                                    Privacy Policy
                                                </a>
                                            </span>{' '}
                                            and{' '}
                                            <span>
                                                <a
                                                    href='https://docs.intersectmbo.org/legal/policies-and-conditions/terms-of-use'
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                >
                                                    Terms of Use
                                                </a>
                                            </span>
                                            .
                                        </Typography>
                                    }
                                />
                            </Box>
                        </Box>
                        <StepperActionButtons
                            onClose={onClose}
                            onSaveDraft={handleSaveDraft}
                            onContinue={setStep}
                            onBack={setStep}
                            selectedDraftId={selectedDraftId}
                            nextStep={step + 1}
                            backStep={step - 1}
                            errors={
                                currentBudgetDiscussionData?.privacy_policy
                                    ? {}
                                    : { privacy_policy: 'Required' }
                            }
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
export default BudgetDiscussionSubmit;
