import { Box, Card, CardContent, Button, Typography, List, ListItem, TextField, MenuItem, Grid, Link } from "@mui/material"
import { useEffect, useState } from 'react';
import { getContractTypeList } from '../../../lib/api';
import { StepperActionButtons } from '../../BudgetDiscussionParts';

const ProposalDetails = ({ setStep, step, currentBudgetDiscussionData, setBudgetDiscussionData, onClose, setSelectedDraftId, selectedDraftId, handleSaveDraft, errors, setErrors }) => {

    const [allContractTypes, setAllContractTypes] = useState([]);
    const proposalDescriptionMaxLength = 2500;
    const keyDependenciesMaxLength = 2500;
    const resourcingDurationEstimatesMaxLength = 2500;
    const keyProposalDeliverablesMaxLength = 2500;

    const supplementaryEndorsementMaxLength = 2500;
    useEffect(() => {
        const fetchData = async () => {
            try {
                 if (!allContractTypes.length) {
                      const allContractTypesResponse = await getContractTypeList();
                      setAllContractTypes(allContractTypesResponse?.data || []);
                 }
               }
            catch (error) {
                 console.error("Error fetching data:", error);
            }
       };
       fetchData();
     }, []);
     const handleDataChange = (e, dataName) => {
        setBudgetDiscussionData({
             ...currentBudgetDiscussionData,
             budget_discussion_proposal_details: {
                 ...currentBudgetDiscussionData?.budget_discussion_proposal_details,
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
                            Section 4: Proposal Detils
                        </Typography>
                        <Box color={(theme) => theme.palette.text.grey}>
                            <Typography variant='body1' gutterBottom mb={2}>
                            This section looks to gather key details of the proposal.
                            </Typography>
                        </Box>
                    </Box>
                    <TextField
                        name='Name of proposal'
                        label='What is your proposed name to be used to reference this proposal publicly?'
                        value={currentBudgetDiscussionData?.budget_discussion_proposal_details?.proposal_name || ''}
                        required
                        fullWidth
                        onChange={(e) => handleDataChange(e, 'proposal_name')}
                        sx={{ mb: 2 }}
                        helperText='Ideally this should give an indication of the work being done or project goal.'
                    />
                    <TextField
                        size='large'
                        name='Proposal Description'
                        label='Proposal Description'
                        rows={4}
                        sx={{ mb: 4 }}
                        fullWidth
                        multiline
                        value={currentBudgetDiscussionData?.budget_discussion_proposal_details?.proposal_description || ''}
                        onChange={(e) => handleDataChange(e, 'proposal_description')}
                        helperText={(
                                <>
                                    <Typography
                                        variant='caption'
                                        data-testid='proposal-description-helper-text'
                                    >
                                        * Please provide a high-level description / abstract of the proposal (2500 words max).
                                    </Typography>
                                    <Typography
                                        variant='caption'
                                        sx={{ float: 'right' }}
                                        data-testid='proposal-description-helper-character-count'
                                    >
                                        {`${
                                            currentBudgetDiscussionData?.budget_discussion_proposal_details?.proposal_description?.length || 0
                                        }/${proposalDescriptionMaxLength}`}
                                    </Typography>
                                </>
                            )
                        }
                        InputProps={{
                            inputProps: {
                                maxLength: proposalDescriptionMaxLength,
                                'data-testid': 'proposal-description-input',
                            },
                        }}
                        error={errors?.budget_discussion_proposal_details?.proposal_description}
                        FormHelperTextProps={{
                            'data-testid': errors?.budget_discussion_proposal_details?.proposal_description
                                ? 'proposal-description-helper-error'
                                : 'proposal-description-helper',
                        }}
                    />
                    <TextField
                        size='large'
                        name='Key dependencies'
                        label='Please list any key dependencies (if any) for this proposal?'
                        rows={4}
                        sx={{ mb: 4 }}
                        multiline
                        fullWidth
                        value={currentBudgetDiscussionData?.budget_discussion_proposal_details?.key_dependencies || ''}
                        onChange={(e) => handleDataChange(e, 'key_dependencies')}
                        helperText={(
                            <>
                                <Typography
                                    variant='caption'
                                    data-testid='key-dependencies-helper-text'
                                >
                                    * These can be internal or external to the proposal. What else needs to be done for this proposal to begin or be completed.
                                </Typography>
                                <Typography
                                    variant='caption'
                                    sx={{ float: 'right' }}
                                    data-testid='key-dependencies-helper-character-count'
                                >
                                    {`${
                                        currentBudgetDiscussionData?.budget_discussion_proposal_details?.key_dependencies?.length || 0
                                    }/${keyDependenciesMaxLength}`}
                                </Typography>
                            </>
                        )}
                        InputProps={{
                            inputProps: {
                                maxLength: keyDependenciesMaxLength,
                                'data-testid': 'key-dependencies-input',
                            },
                        }}
                        error={errors?.budget_discussion_proposal_details?.key_dependencies}
                        FormHelperTextProps={{
                            'data-testid': errors?.budget_discussion_proposal_details?.key_dependencies
                                ? 'key-dependencies-helper-error'
                                : 'key-dependencies-helper',
                        }}
                    />
                    <TextField
                        name='Maintain and support'
                        label='How will this proposal be maintained and supported after initial development?'
                        rows={4}
                        multiline
                        value={currentBudgetDiscussionData?.budget_discussion_proposal_details?.maintain_and_support || ''}
                        required
                        fullWidth
                        onChange={(e) => handleDataChange(e, 'maintain_and_support')}
                        sx={{ mb: 2 }}
                      />
                    <TextField
                        size='large'
                        name='Key Proposal Deliverable(s) and Definition of Done:'
                        label='What tangible milestones or outcomes are to be delivered and what will the community ultimately receive?'
                        rows={4}
                        sx={{ mb: 4 }}
                        fullWidth
                        multiline
                        value={currentBudgetDiscussionData?.budget_discussion_proposal_details?.key_proposal_deliverables || ''}
                        onChange={(e) => handleDataChange(e, 'key_proposal_deliverables')}
                        helperText={(
                                <>
                                    <Typography
                                        variant='caption'
                                        data-testid='key-proposal-deliverables-helper-text'
                                    >
                                        * Keeping in mind sometimes proposals are multi-phased, what would be the target state of this tranche of the proposal or body of work.
                                    </Typography>
                                    <Typography
                                        variant='caption'
                                        sx={{ float: 'right' }}
                                        data-testid='key-proposal-deliverables-helper-character-count'
                                    >
                                        {`${
                                            currentBudgetDiscussionData?.budget_discussion_proposal_details?.key_proposal_deliverables?.length || 0
                                        }/${keyProposalDeliverablesMaxLength}`}
                                    </Typography>
                                </>
                            )
                        }
                        InputProps={{
                            inputProps: {
                                maxLength: keyProposalDeliverablesMaxLength,
                                'data-testid': 'key-proposal-deliverables-input',
                            },
                        }}
                        error={errors?.budget_discussion_proposal_details?.key_proposal_deliverables}
                        FormHelperTextProps={{
                            'data-testid': errors?.budget_discussion_proposal_details?.key_proposal_deliverables
                                ? 'key-proposal-deliverables-helper-error'
                                : 'key-proposal-deliverables-helper',
                        }}
                    />
                    <TextField
                        size='large'
                        name='Resourcing & Duration Estimates'
                        label='Please provide estimates of team size and duration to achieve the Key Proposal Deliverables outlined above.'
                        rows={4}
                        sx={{ mb: 4 }}
                        fullWidth
                        multiline
                        value={currentBudgetDiscussionData?.budget_discussion_proposal_details?.resourcing_duration_estimates || ''}
                        onChange={(e) => handleDataChange(e, 'resourcing_duration_estimates')}
                        helperText={(
                                <>
                                    <Typography
                                        variant='caption'
                                        data-testid='resourcing-duration-estimates-helper-text'
                                    >
                                        * If not known estimates can be provided.
                                    </Typography>
                                    <Typography
                                        variant='caption'
                                        sx={{ float: 'right' }}
                                        data-testid='resourcing-duration-estimates-helper-character-count'
                                    >
                                        {`${
                                            currentBudgetDiscussionData?.budget_discussion_proposal_details?.resourcing_duration_estimates?.length || 0
                                        }/${resourcingDurationEstimatesMaxLength}`}
                                    </Typography>
                                </>
                            )
                        }
                        InputProps={{
                            inputProps: {
                                maxLength: resourcingDurationEstimatesMaxLength,
                                'data-testid': 'resourcing-duration-estimates-input',
                            },
                        }}
                        error={errors?.budget_discussion_proposal_details?.resourcing_duration_estimates}
                        FormHelperTextProps={{
                            'data-testid': errors?.budget_discussion_proposal_details?.resourcing_duration_estimates
                                ? 'resourcing-duration-estimates-helper-error'
                                : 'resourcing-duration-estimates-helper',
                        }}
                    />
                    <TextField
                        name='Experience'
                        label='Please provide previous experience relevant to complete this project.'
                        value={currentBudgetDiscussionData?.budget_discussion_proposal_details?.experience || ''}
                        required
                        multiline
                        rows={4}
                        fullWidth
                        onChange={(e) => handleDataChange(e, 'experience')}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        select
                        name='Contract Types'
                        label='Contracting: Please describe how you expect to be contracted.'
                        //helperText={(<> {'Please click'} <Link href="">here</Link> {'to see details of Intersect Committees.'}</>)}
                        value={currentBudgetDiscussionData?.budget_discussion_proposal_details?.contract_type_name || ''}
                        required
                        fullWidth
                        onChange={(e) => handleDataChange(e, 'contract_type_name')}
                        SelectProps={{
                                SelectDisplayProps: {
                                    'data-testid': 'contract-type-name', 
                                },
                        }}
                        sx={{ mb: 4 }}
                        >
                        {allContractTypes?.map((option) => (
                            <MenuItem 
                                        key={option?.id} 
                                        value={option?.id}
                                        data-testid={`${option?.attributes.contract_type_name?.toLowerCase()}-button`} 
                                    >
                                    {option?.attributes.contract_type_name}
                            </MenuItem>
                       ))}
                    </TextField>
                    <StepperActionButtons onClose={onClose} onSaveDraft={handleSaveDraft} onContinue={setStep}
                            onBack={setStep} selectedDraftId={selectedDraftId} nextStep={step+1} backStep={step-1}
                     />
                </CardContent>
            </Card>
        </Box>
    </Box>
);
}
export default ProposalDetails;