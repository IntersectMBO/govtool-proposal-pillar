import { Box, Card, CardContent, Button, Typography, List, ListItem, TextField, MenuItem, Grid, Link } from "@mui/material"
import { useEffect, useState } from 'react';
import { getBudgetDiscussionRoadMapList , getBudgetDiscussionTypes, getBudgetDiscussionIntersectCommittee } from '../../../lib/api';
import { StepperActionButtons } from '../../BudgetDiscussionParts';

const ProblemStatementsAndProposalBenefits = ({ setStep, step, currentBudgetDiscussionData, setBudgetDiscussionData, onClose, setSelectedDraftId, selectedDraftId, handleSaveDraft, errors, setErrors }) => {

    const problemStatementMaxLength = 2500;
    const proposalBenefitMaxLength = 2500;
    const supplementaryEndorsementMaxLength = 2500;
    const [allRoadMaps, setAllRoadMaps] = useState([]);
    const [allBDTypes, setAllBDTypes] = useState([]);
    const [allCommittees, setAllCommittees] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                 if (!allRoadMaps.length) {
                      const allRoadMapsResponse = await getBudgetDiscussionRoadMapList();
                      setAllRoadMaps(allRoadMapsResponse?.data || []);
                 }
                 if (!allBDTypes.length) {
                      const allBDTypesResponse = await getBudgetDiscussionTypes();
                      setAllBDTypes(allBDTypesResponse?.data || []);
                 }
                 if (!allCommittees.length) {
                    const allCommitteesResponse = await getBudgetDiscussionIntersectCommittee();
                    setAllCommittees(allCommitteesResponse?.data || []);
               }
            } catch (error) {
                 console.error("Error fetching data:", error);
            }
       };
       fetchData();
     }, []);
     const handleDataChange = (e, dataName) => {
        setBudgetDiscussionData({
             ...currentBudgetDiscussionData,
             budget_discussion_problem_statements_and_proposal_benefits: {
                 ...currentBudgetDiscussionData?.budget_discussion_problem_statements_and_proposal_benefits,
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
                                Section 3: Problem Statements and Proposal Benefits
                            </Typography>
                            <Box color={(theme) => theme.palette.text.grey}>
                                <Typography variant='body1' gutterBottom mb={2}>
                                    This section focuses on understanding the drivers behind the proposed project. E.g., Why should this project be undertaken?
                                </Typography>
                            </Box>
                        </Box>
                        <TextField
                            size='large'
                            name='Problem Statement'
                            label='Problem Statement'
                            rows={4}
                            sx={{ mb: 4 }}
                            fullWidth
                            multiline
                            value={currentBudgetDiscussionData?.budget_discussion_problem_statements_and_proposal_benefits?.problem_statement || ''}
                            onChange={(e) => handleDataChange(e, 'problem_statement')}
                            helperText={(
                                    <>
                                        <Typography
                                            variant='caption'
                                            data-testid='problem-statement-helper-text'
                                        >
                                            * 'What problem does this proposal seek to address?'
                                        </Typography>
                                        <Typography
                                            variant='caption'
                                            sx={{ float: 'right' }}
                                            data-testid='problem-statement-helper-character-count'
                                        >
                                            {`${
                                                currentBudgetDiscussionData?.budget_discussion_problem_statements_and_proposal_benefits?.problem_statement?.length || 0
                                            }/${problemStatementMaxLength}`}
                                        </Typography>
                                    </>
                                )
                            }
                            InputProps={{
                                inputProps: {
                                    maxLength: problemStatementMaxLength,
                                    'data-testid': 'problem-statement-input',
                                },
                            }}
                            error={errors?.budget_discussion_problem_statements_and_proposal_benefits?.problem_statement}
                            FormHelperTextProps={{
                                'data-testid': errors?.budget_discussion_problem_statements_and_proposal_benefits?.problem_statement
                                    ? 'problem-statement-helper-error'
                                    : 'problem-statement-helper',
                            }}
                        />
                        <TextField
                            size='large'
                            name='Proposal Benefit'
                            label='Proposal Benefit'
                            rows={4}
                            sx={{ mb: 4 }}
                            multiline
                            fullWidth
                            value={currentBudgetDiscussionData?.budget_discussion_problem_statements_and_proposal_benefits?.proposal_benefit || ''}
                            onChange={(e) => handleDataChange(e, 'proposal_benefit')}
                            helperText={(
                                <>
                                    <Typography
                                        variant='caption'
                                        data-testid='proposal-benefit-helper-text'
                                    >
                                        * 'If implemented, what would be the benefit and to which parts of the community? Please include the demonstrated value or return on investment to the Cardano Community.'
                                    </Typography>
                                    <Typography
                                        variant='caption'
                                        sx={{ float: 'right' }}
                                        data-testid='proposal-benefit-helper-character-count'
                                    >
                                        {`${
                                            currentBudgetDiscussionData?.budget_discussion_problem_statements_and_proposal_benefits?.proposal_benefit?.length || 0
                                        }/${proposalBenefitMaxLength}`}
                                    </Typography>
                                </>
                            )}
                            InputProps={{
                                inputProps: {
                                    maxLength: proposalBenefitMaxLength,
                                    'data-testid': 'proposal-benefit-input',
                                },
                            }}
                            error={errors?.budget_discussion_problem_statements_and_proposal_benefits?.proposal_benefit}
                            FormHelperTextProps={{
                                'data-testid': errors?.budget_discussion_problem_statements_and_proposal_benefits?.proposal_benefit
                                    ? 'proposal-benefit-helper-error'
                                    : 'proposal-benefit-helper',
                            }}
                        />
                        <TextField
                            select
                            name='Product Roadmap'
                            label='Product Roadmap'
                            helperText='Does this proposal align to the Product Roadmap and Roadmap Goals?'
                            value={currentBudgetDiscussionData?.budget_discussion_problem_statements_and_proposal_benefits?.roadmap_name || ''}
                            required
                            fullWidth
                            onChange={(e) => handleDataChange(e, 'roadmap_name')}
                            SelectProps={{
                                    SelectDisplayProps: {
                                        'data-testid': 'roadmap-name', 
                                    },
                            }}
                            sx={{ mb: 4 }}
                            >
                            {allRoadMaps?.map((option) => (
                                <MenuItem 
                                            key={option?.id} 
                                            value={option?.id} 
                                            data-testid={`${option?.attributes.roadmap_name?.toLowerCase()}-button`} 
                                        >
                                        {option?.attributes.roadmap_name}
                                </MenuItem>
                        ))}
                        
                        </TextField>
                        <TextField
                            select
                            name='budget_discussion_type'
                            label='Budget discussion type'
                            helperText={(<> {'Please click'} <Link href="">here</Link> {'to see details of Intersect Committees.'}</>)}
                            value={currentBudgetDiscussionData?.budget_discussion_problem_statements_and_proposal_benefits?.budget_discussion_type_name || ''}
                            required
                            fullWidth
                            onChange={(e) => handleDataChange(e, 'budget_discussion_type_name')}
                            SelectProps={{
                                    SelectDisplayProps: {
                                        'data-testid': 'budget-discussion-type-name', 
                                    },
                            }}
                            sx={{ mb: 4 }}
                            >
                            {allBDTypes?.map((option) => (
                                <MenuItem 
                                            key={option?.id} 
                                            value={option?.id} 
                                            data-testid={`${option?.attributes.budget_discussion_type_name?.toLowerCase()}-button`} 
                                        >
                                        {option?.attributes.budget_discussion_type_name}
                                </MenuItem>
                        ))}
                        
                        </TextField>
                        <TextField
                            select
                            name='Committee Alignment'
                            label='Committee Alignment: Which of the Intersect Committees does your proposal align to?'
                            helperText={(<> {'Please click'} <Link href="">here</Link> {'to see details of Intersect Committees.'}</>)}
                            value={currentBudgetDiscussionData?.budget_discussion_problem_statements_and_proposal_benefits?.committee_name || ''}
                            required
                            fullWidth
                            onChange={(e) => handleDataChange(e, 'committee_name')}
                            SelectProps={{
                                    SelectDisplayProps: {
                                        'data-testid': 'committee-alignment-type', 
                                    },
                            }}
                            sx={{ mb: 4 }}
                            >
                            {allCommittees?.map((option) => (
                                <MenuItem 
                                            key={option?.id} 
                                            value={option?.id} 
                                            data-testid={`${option?.attributes.committee_name?.toLowerCase()}-button`} 
                                        >
                                        {option?.attributes.committee_name}
                                </MenuItem>
                        ))}
                        </TextField>
                        <TextField
                            size='large'
                            name='Supplementary Endorsement'
                            label='If possible provide evidence of wider community endorsement for this proposal?'
                            rows={4}
                            fullWidth
                            multiline
                            value={currentBudgetDiscussionData?.budget_discussion_problem_statements_and_proposal_benefits?.supplementary_endorsement || ''}
                            onChange={(e) => handleDataChange(e, 'supplementary_endorsement')}
                            helperText={(
                                    <>
                                        <Typography
                                            variant='caption'
                                            data-testid='supplementary-endorsement-helper-text'
                                        >
                                            * E.g., CIP/CPS discussion, Technical Working Group, Special Interest Group, draft committee budget code, or other forum where comments and consensus have been made to date.
                                            Please share any links you have available.
                                        </Typography>
                                        <Typography
                                            variant='caption'
                                            sx={{ float: 'right' }}
                                            data-testid='supplementary-endorsement-helper-character-count'
                                        >
                                            {`${
                                                currentBudgetDiscussionData?.budget_discussion_problem_statements_and_proposal_benefits?.supplementary_endorsement?.length || 0
                                            }/${supplementaryEndorsementMaxLength}`}
                                        </Typography>
                                    </>
                                )
                            }
                            InputProps={{
                                inputProps: {
                                    maxLength: supplementaryEndorsementMaxLength,
                                    'data-testid': 'supplementary-endorsement-input',
                                },
                            }}
                            error={errors?.budget_discussion_problem_statements_and_proposal_benefits?.supplementary_endorsement}
                            FormHelperTextProps={{
                                'data-testid': errors?.budget_discussion_problem_statements_and_proposal_benefits?.supplementary_endorsement
                                    ? 'supplementary-endorsement-helper-error'
                                    : 'supplementary-endorsement-helper',
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
export default ProblemStatementsAndProposalBenefits;