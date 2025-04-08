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
import { getContractTypeList } from '../../../lib/api';
import { StepperActionButtons } from '../../BudgetDiscussionParts';

const ProposalDetails = ({
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
    const [allContractTypes, setAllContractTypes] = useState([]);

    const proposalDescriptionMaxLength = 15000;
    const keyDependenciesMaxLength = 15000;
    const resourcingDurationEstimatesMaxLength = 15000;
    const keyProposalDeliverablesMaxLength = 15000;

    const supplementaryEndorsementMaxLength = 15000;
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!allContractTypes.length) {
                    const allContractTypesResponse =
                        await getContractTypeList();
                    setAllContractTypes(allContractTypesResponse?.data || []);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);
    useEffect(() => {
        validateSection('bd_proposal_detail');
    }, [currentBudgetDiscussionData?.bd_proposal_detail]);
    const handleDataChange = (e, dataName) => {
        setBudgetDiscussionData({
            ...currentBudgetDiscussionData,
            bd_proposal_detail: {
                ...currentBudgetDiscussionData?.bd_proposal_detail,
                [dataName]: e.target.value,
            },
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
                                Section 3: Proposal Details
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
                                    3
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
                                    This section looks to gather key details of
                                    the proposal.
                                </Typography>
                            </Box>
                        </Box>
                        <TextField
                            name='Name of proposal'
                            label='What is your proposed name to be used to reference this proposal publicly?'
                            value={
                                currentBudgetDiscussionData?.bd_proposal_detail
                                    ?.proposal_name || ''
                            }
                            required
                            fullWidth
                            onChange={(e) =>
                                handleDataChange(e, 'proposal_name')
                            }
                            // helperText={
                            //     errors[
                            //         'bd_proposal_detail.proposal_name'
                            //     ]?.trim() ||
                            //     'Ideally this should give an indication of the work being done or project goal.'
                            // }
                            // error={
                            //     !!errors[
                            //         'bd_proposal_detail.proposal_name'
                            //     ]?.trim()
                            // }
                            sx={{ mb: 2 }}
                            data-testid='proposal-name-input'
                        />
                        <TextField
                            size='large'
                            name='Proposal Description'
                            label='Proposal Description'
                            rows={4}
                            sx={{ mb: 4 }}
                            fullWidth
                            multiline
                            required
                            value={
                                currentBudgetDiscussionData?.bd_proposal_detail
                                    ?.proposal_description || ''
                            }
                            onChange={(e) =>
                                handleDataChange(e, 'proposal_description')
                            }
                            helperText={
                                <>
                                    <Typography
                                        variant='caption'
                                        data-testid='proposal-description-helper-text'
                                    >
                                        * Please provide a high-level
                                        description / abstract of the proposal
                                        (2500 words max).
                                    </Typography>
                                    <Typography
                                        variant='caption'
                                        sx={{ float: 'right' }}
                                        data-testid='proposal-description-helper-character-count'
                                    >
                                        {`${
                                            currentBudgetDiscussionData
                                                ?.bd_proposal_detail
                                                ?.proposal_description
                                                ?.length || 0
                                        }/${proposalDescriptionMaxLength}`}
                                    </Typography>
                                </>
                            }
                            InputProps={{
                                inputProps: {
                                    maxLength: proposalDescriptionMaxLength,
                                    'data-testid': 'proposal-description-input',
                                },
                            }}
                            // error={errors[
                            //     'bd_proposal_detail.proposal_description'
                            // ]?.trim()}
                            FormHelperTextProps={{
                                'data-testid': errors?.bd_proposal_detail
                                    ?.proposal_description
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
                            required
                            value={
                                currentBudgetDiscussionData?.bd_proposal_detail
                                    ?.key_dependencies || ''
                            }
                            onChange={(e) =>
                                handleDataChange(e, 'key_dependencies')
                            }
                            helperText={
                                <>
                                    <Typography
                                        variant='caption'
                                        data-testid='key-dependencies-helper-text'
                                    >
                                        * These can be internal or external to
                                        the proposal. What else needs to be done
                                        for this proposal to begin or be
                                        completed.
                                    </Typography>
                                    <Typography
                                        variant='caption'
                                        sx={{ float: 'right' }}
                                        data-testid='key-dependencies-helper-character-count'
                                    >
                                        {`${
                                            currentBudgetDiscussionData
                                                ?.bd_proposal_detail
                                                ?.key_dependencies?.length || 0
                                        }/${keyDependenciesMaxLength}`}
                                    </Typography>
                                </>
                            }
                            InputProps={{
                                inputProps: {
                                    maxLength: keyDependenciesMaxLength,
                                    'data-testid': 'key-dependencies-input',
                                },
                            }}
                            // error={errors[
                            //     'bd_proposal_detail.key_dependencies'
                            // ]?.trim()}
                            FormHelperTextProps={{
                                'data-testid': errors?.bd_proposal_detail
                                    ?.key_dependencies
                                    ? 'key-dependencies-helper-error'
                                    : 'key-dependencies-helper',
                            }}
                        />
                        <TextField
                            name='Maintain and support'
                            label='How will this proposal be maintained and supported after initial development?'
                            rows={4}
                            multiline
                            value={
                                currentBudgetDiscussionData?.bd_proposal_detail
                                    ?.maintain_and_support || ''
                            }
                            required
                            fullWidth
                            // helperText={errors[
                            //     'bd_proposal_detail.maintain_and_support'
                            // ]?.trim()}
                            // error={
                            //     !!errors[
                            //         'bd_proposal_detail.maintain_and_support'
                            //     ]?.trim()
                            // }
                            onChange={(e) =>
                                handleDataChange(e, 'maintain_and_support')
                            }
                            sx={{ mb: 2 }}
                            data-testid='proposal-maintain-and-support-input'
                        />
                        <TextField
                            size='large'
                            name='Key Proposal Deliverable(s) and Definition of Done:'
                            label='What tangible milestones or outcomes are to be delivered and what will the community ultimately receive?'
                            rows={4}
                            sx={{ mb: 4 }}
                            fullWidth
                            multiline
                            required
                            value={
                                currentBudgetDiscussionData?.bd_proposal_detail
                                    ?.key_proposal_deliverables || ''
                            }
                            onChange={(e) =>
                                handleDataChange(e, 'key_proposal_deliverables')
                            }
                            helperText={
                                <>
                                    <Typography
                                        variant='caption'
                                        data-testid='key-proposal-deliverables-helper-text'
                                    >
                                        * Keeping in mind sometimes proposals
                                        are multi-phased, what would be the
                                        target state of this tranche of the
                                        proposal or body of work.
                                    </Typography>
                                    <Typography
                                        variant='caption'
                                        sx={{ float: 'right' }}
                                        data-testid='key-proposal-deliverables-helper-character-count'
                                    >
                                        {`${
                                            currentBudgetDiscussionData
                                                ?.bd_proposal_detail
                                                ?.key_proposal_deliverables
                                                ?.length || 0
                                        }/${keyProposalDeliverablesMaxLength}`}
                                    </Typography>
                                </>
                            }
                            InputProps={{
                                inputProps: {
                                    maxLength: keyProposalDeliverablesMaxLength,
                                    'data-testid':
                                        'key-proposal-deliverables-input',
                                },
                            }}
                            // error={
                            //     !!errors[
                            //         'bd_proposal_detail.key_proposal_deliverables'
                            //     ]?.trim()
                            // }
                            FormHelperTextProps={{
                                'data-testid': errors?.bd_proposal_detail
                                    ?.key_proposal_deliverables
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
                            required
                            multiline
                            value={
                                currentBudgetDiscussionData?.bd_proposal_detail
                                    ?.resourcing_duration_estimates || ''
                            }
                            onChange={(e) =>
                                handleDataChange(
                                    e,
                                    'resourcing_duration_estimates'
                                )
                            }
                            helperText={
                                <>
                                    <Typography
                                        variant='caption'
                                        data-testid='resourcing-duration-estimates-helper-text'
                                    >
                                        * If not known estimates can be
                                        provided.
                                    </Typography>
                                    <Typography
                                        variant='caption'
                                        sx={{ float: 'right' }}
                                        data-testid='resourcing-duration-estimates-helper-character-count'
                                    >
                                        {`${
                                            currentBudgetDiscussionData
                                                ?.bd_proposal_detail
                                                ?.resourcing_duration_estimates
                                                ?.length || 0
                                        }/${resourcingDurationEstimatesMaxLength}`}
                                    </Typography>
                                </>
                            }
                            InputProps={{
                                inputProps: {
                                    maxLength:
                                        resourcingDurationEstimatesMaxLength,
                                    'data-testid':
                                        'resourcing-duration-estimates-input',
                                },
                            }}
                            // error={
                            //     !!errors[
                            //         'bd_proposal_detail.resourcing_duration_estimates'
                            //     ]?.trim()
                            // }
                            FormHelperTextProps={{
                                'data-testid': errors?.bd_proposal_detail
                                    ?.resourcing_duration_estimates
                                    ? 'resourcing-duration-estimates-helper-error'
                                    : 'resourcing-duration-estimates-helper',
                            }}
                        />
                        <TextField
                            name='Experience'
                            label='Please provide previous experience relevant to complete this project.'
                            value={
                                currentBudgetDiscussionData?.bd_proposal_detail
                                    ?.experience || ''
                            }
                            required
                            multiline
                            rows={4}
                            fullWidth
                            onChange={(e) => handleDataChange(e, 'experience')}
                            // helperText={errors[
                            //     'bd_proposal_detail.experience'
                            // ]?.trim()}
                            // error={
                            //     !!errors[
                            //         'bd_proposal_detail.experience'
                            //     ]?.trim()
                            // }
                            sx={{ mb: 2 }}
                            data-testid='proposal-previous-experience-input'
                        />
                        <TextField
                            select
                            name='Contract Types'
                            label='Contracting: Please describe how you expect to be contracted.'
                            //helperText={(<> {'Please click'} <Link href="">here</Link> {'to see details of Intersect Committees.'}</>)}
                            value={
                                currentBudgetDiscussionData?.bd_proposal_detail
                                    ?.contract_type_name || ''
                            }
                            required
                            fullWidth
                            onChange={(e) =>
                                handleDataChange(e, 'contract_type_name')
                            }
                            // helperText={errors[
                            //     'bd_proposal_detail.contract_type_name'
                            // ]?.trim()}
                            // error={
                            //     !!errors[
                            //         'bd_proposal_detail.contract_type_name'
                            //     ]?.trim()
                            // }
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
                        {allContractTypes?.find(
                            (type) =>
                                type?.id ==
                                currentBudgetDiscussionData?.bd_proposal_detail
                                    ?.contract_type_name
                        )?.attributes?.contract_type_name === 'Other' ? (
                            <TextField
                                name='Other contract type'
                                label='Please describe what you have in mind.'
                                value={
                                    currentBudgetDiscussionData
                                        ?.bd_proposal_detail
                                        ?.other_contract_type || ''
                                }
                                required
                                multiline
                                rows={4}
                                fullWidth
                                onChange={(e) =>
                                    handleDataChange(e, 'other_contract_type')
                                }
                                helperText={errors[
                                    'bd_proposal_detail.other_contract_type'
                                ]?.trim()}
                                error={
                                    !!errors[
                                        'bd_proposal_detail.other_contract_type'
                                    ]?.trim()
                                }
                                sx={{ mb: 2 }}
                                data-testid='other-contract-description'
                            />
                        ) : (
                            ''
                        )}
                        <StepperActionButtons
                            onClose={onClose}
                            onSaveDraft={handleSaveDraft}
                            onContinue={setStep}
                            onBack={setStep}
                            selectedDraftId={selectedDraftId}
                            nextStep={step + 1}
                            backStep={step - 1}
                            errors={
                                allContractTypes?.find(
                                    (type) =>
                                        type?.id ==
                                        currentBudgetDiscussionData
                                            ?.bd_proposal_detail
                                            ?.contract_type_name
                                )?.attributes?.contract_type_name === 'Other'
                                    ? currentBudgetDiscussionData
                                          ?.bd_proposal_detail
                                          ?.other_contract_type
                                        ? {
                                              ...errors,
                                          }
                                        : {
                                              ...errors,
                                              other_contract_type:
                                                  'Field should be a valid string',
                                          }
                                    : { ...errors }
                            }
                        />
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};
export default ProposalDetails;
