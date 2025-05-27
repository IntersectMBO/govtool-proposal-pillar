import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    MenuItem,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { StepperActionButtons } from '../../BudgetDiscussionParts';
import { getCountryList } from '../../../lib/api';

const ProposalOwnership = ({
    setStep,
    step,
    currentBudgetDiscussionData,
    setBudgetDiscussionData,
    onClose,
    errors,
    setErrors,
    setSelectedDraftId,
    selectedDraftId,
    handleSaveDraft,
    validateSection,
}) => {
    const [allCountries, setAllCountries] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!allCountries.length) {
                    const countriesResponse = await getCountryList();
                    setAllCountries(countriesResponse?.data || []);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        validateSection('bd_proposal_ownership');
    }, [currentBudgetDiscussionData?.bd_proposal_ownership]);

    const handleDataChange = (e, dataName) => {
        const value =
            e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        setBudgetDiscussionData({
            ...currentBudgetDiscussionData,
            bd_proposal_ownership: {
                ...currentBudgetDiscussionData?.bd_proposal_ownership,
                [dataName]: value,
            },
        });
    };
    const handleSubmitedOnBehalfChange = (e) => {
        setBudgetDiscussionData({
            ...currentBudgetDiscussionData,
            bd_proposal_ownership: {
                ...currentBudgetDiscussionData?.bd_proposal_ownership,
                submited_on_behalf: e.target.value,
                company_name: '',
                company_domain_name: '',
                be_country: null,
                group_name: '',
                type_of_group: '',
                key_info_to_identify_group: '',
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
                            <Typography
                                variant='h4'
                                gutterBottom
                                sx={{ mb: 2 }}
                            >
                                Section 1: Proposal Ownership
                            </Typography>
                        </Box>
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
                                1
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
                        <Box>
                            <TextField
                                select
                                label='Is this proposal being submitted on behalf of an individual (the beneficiary), company, or some other group?'
                                value={
                                    currentBudgetDiscussionData
                                        ?.bd_proposal_ownership
                                        ?.submited_on_behalf || 'Please Choose'
                                }
                                required
                                fullWidth
                                onChange={(e) => {
                                    handleSubmitedOnBehalfChange(e);
                                }}
                                // SelectProps={{
                                //     SelectDisplayProps: {
                                //         'data-testid': '',
                                //     },
                                // }}
                                InputProps={{
                                    inputProps: {
                                        'data-testid': 'proposal-committee',
                                    },
                                }}
                                helperText='If you are submitting on behalf of an Intersect Committee, please select Group. The Group Name would be the “Name of the Committee (e.g. MCC, TSC)”. The Type of Group would be “Intersect Committee”. The Key Information to Identify the Group would be the names of the Voting members of the Committee.'
                                sx={{ mb: 2 }}
                            >
                                <MenuItem key={'1'} value={'Individual'}>
                                    Individual
                                </MenuItem>
                                <MenuItem key={'2'} value={'Company'}>
                                    Company
                                </MenuItem>
                                <MenuItem key={'3'} value={'Group'}>
                                    Group
                                </MenuItem>
                            </TextField>
                            {currentBudgetDiscussionData.bd_proposal_ownership
                                ?.submited_on_behalf === 'Company' ? (
                                <Box>
                                    <TextField
                                        name='Company Name*'
                                        label='Company Name'
                                        value={
                                            currentBudgetDiscussionData
                                                ?.bd_proposal_ownership
                                                ?.company_name || ''
                                        }
                                        required
                                        fullWidth
                                        onChange={(e) =>
                                            handleDataChange(e, 'company_name')
                                        }
                                        // helperText={errors[
                                        //     'bd_proposal_ownership.company_name'
                                        // ]?.trim()}
                                        // error={
                                        //     !!errors[
                                        //         'bd_proposal_ownership.company_name'
                                        //     ]?.trim()
                                        // }
                                        sx={{ mb: 2 }}
                                        InputProps={{
                                            inputProps: {
                                                'data-testid':
                                                    'company-name-input',
                                            },
                                        }}
                                    />
                                    <TextField
                                        name='Company Domain Name'
                                        label='Company Domain Name'
                                        value={
                                            currentBudgetDiscussionData
                                                ?.bd_proposal_ownership
                                                ?.company_domain_name || ''
                                        }
                                        required
                                        fullWidth
                                        helperText={
                                            //     errors[
                                            //         'bd_proposal_ownership.company_domain_name'
                                            //     ]?.trim() ||
                                            'Example of domain format to input: intersectmbo.org'
                                        }
                                        // error={
                                        //     !!errors[
                                        //         'bd_proposal_ownership.company_domain_name'
                                        //     ]?.trim()
                                        // }
                                        onChange={(e) =>
                                            handleDataChange(
                                                e,
                                                'company_domain_name'
                                            )
                                        }
                                        sx={{ mb: 2 }}
                                        InputProps={{
                                            inputProps: {
                                                'data-testid':
                                                    'company-domain-input',
                                            },
                                        }}
                                    />
                                    <TextField
                                        select
                                        label='Country of Incorporation'
                                        value={
                                            currentBudgetDiscussionData
                                                ?.bd_proposal_ownership
                                                ?.be_country || ''
                                        }
                                        required
                                        fullWidth
                                        // helperText={errors[
                                        //     'bd_proposal_ownership.be_country'
                                        // ]?.trim()}
                                        // error={
                                        //     !!errors[
                                        //         'bd_proposal_ownership.be_country'
                                        //     ]?.trim()
                                        // }
                                        onChange={(e) =>
                                            handleDataChange(e, 'be_country')
                                        }
                                        // SelectProps={{
                                        //     SelectDisplayProps: {
                                        //         'data-testid':
                                        //             'country-of-incorporation',
                                        //     },
                                        // }}
                                        inputProps={{
                                            'data-testid':
                                                'country-of-incorporation',
                                        }}
                                        sx={{ mb: 2 }}
                                    >
                                        {allCountries.map((option) => (
                                            <MenuItem
                                                key={option?.id}
                                                value={option?.id}
                                                data-testid={`${option?.attributes.country_name?.replace(/\s+/g, '-').toLowerCase()}-country-of-incorporation-button`}
                                            >
                                                {
                                                    option?.attributes
                                                        .country_name
                                                }
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>
                            ) : (
                                ''
                            )}
                            {currentBudgetDiscussionData.bd_proposal_ownership
                                ?.submited_on_behalf === 'Group' ? (
                                <Box>
                                    <TextField
                                        name='Group Name*'
                                        label='Group Name'
                                        value={
                                            currentBudgetDiscussionData
                                                ?.bd_proposal_ownership
                                                ?.group_name || ''
                                        }
                                        required
                                        fullWidth
                                        onChange={(e) =>
                                            handleDataChange(e, 'group_name')
                                        }
                                        // helperText={errors[
                                        //     'bd_proposal_ownership.group_name'
                                        // ]?.trim()}
                                        // error={
                                        //     !!errors[
                                        //         'bd_proposal_ownership.group_name'
                                        //     ]?.trim()
                                        // }
                                        sx={{ mb: 2 }}
                                        InputProps={{
                                            inputProps: {
                                                'data-testid':
                                                    'group-name-input',
                                            },
                                        }}
                                    />
                                    <TextField
                                        name='Type of Group'
                                        label='Type of Group'
                                        value={
                                            currentBudgetDiscussionData
                                                ?.bd_proposal_ownership
                                                ?.type_of_group || ''
                                        }
                                        required
                                        fullWidth
                                        onChange={(e) =>
                                            handleDataChange(e, 'type_of_group')
                                        }
                                        // helperText={errors[
                                        //     'bd_proposal_ownership.type_of_group'
                                        // ]?.trim()}
                                        // error={
                                        //     !!errors[
                                        //         'bd_proposal_ownership.type_of_group'
                                        //     ]?.trim()
                                        // }
                                        sx={{ mb: 2 }}
                                        InputProps={{
                                            inputProps: {
                                                'data-testid':
                                                    'group-type-input',
                                            },
                                        }}
                                    />
                                    <TextField
                                        name='Key Information to Identify Group'
                                        label='Key Information to Identify Group'
                                        value={
                                            currentBudgetDiscussionData
                                                ?.bd_proposal_ownership
                                                ?.key_info_to_identify_group ||
                                            ''
                                        }
                                        required
                                        fullWidth
                                        nultiline
                                        rows={4}
                                        size='large'
                                        onChange={(e) =>
                                            handleDataChange(
                                                e,
                                                'key_info_to_identify_group'
                                            )
                                        }
                                        // helperText={errors[
                                        //     'bd_proposal_ownership.key_info_to_identify_group'
                                        // ]?.trim()}
                                        // error={
                                        //     !!errors[
                                        //         'bd_proposal_ownership.key_info_to_identify_group'
                                        //     ]?.trim()
                                        // }
                                        sx={{ mb: 4 }}
                                        InputProps={{
                                            inputProps: {
                                                'data-testid':
                                                    'group-identity-information-input',
                                            },
                                        }}
                                    />
                                </Box>
                            ) : (
                                ''
                            )}
                            {
                                /* <TextField
                                select
                                label='Proposal Public Champion: Who would you like to be the public proposal champion?'
                                value={
                                    currentBudgetDiscussionData
                                        ?.bd_proposal_ownership
                                        ?.proposal_public_champion || ''
                                }
                                required
                                fullWidth
                                onChange={(e) =>
                                    handleDataChange(
                                        e,
                                        'proposal_public_champion'
                                    )
                                }
                                helperText={
                                    //  errors[
                                    //      'bd_proposal_ownership.proposal_public_champion'
                                    //  ]?.trim() ||
                                    'A Proposal Champion is a formal advocate for the proposal. They are responsible for providing information on the proposal, answering queries and generally building support amongst DReps. To facilitate this, the preferred contact details will be shared publicly.'
                                }
                                SelectProps={{
                                    SelectDisplayProps: {
                                        'data-testid':
                                            'proposal-public-champion',
                                    },
                                }}
                                sx={{ mb: 2 }}
                            >
                                <MenuItem
                                    key={'1'}
                                    value={'Beneficiary listed above'}
                                    data-testid='beneficiary-listed-above'
                                >
                                    Beneficiary listed above

                                </MenuItem>
                                <MenuItem
                                    key={'2'}
                                    value={'Submission lead listed above'}
                                    data-testid='submission-lead-listed-above'
                                >
                                    Submission lead listed above
                                </MenuItem>
                            </TextField> */
                                <TextField
                                    label='Please provide your preferred contact details that will be shared publicly (e.g. email address, X handle, Discord handle, Github) ?'
                                    value={
                                        currentBudgetDiscussionData
                                            ?.bd_proposal_ownership
                                            ?.social_handles || ''
                                    }
                                    required
                                    fullWidth
                                    onChange={(e) =>
                                        handleDataChange(e, 'social_handles')
                                    }
                                    //   helperText={errors[
                                    //       'bd_proposal_ownership.social_handles'
                                    //   ]?.trim()}
                                    //   error={
                                    //       !!errors[
                                    //           'bd_proposal_ownership.social_handles'
                                    //       ]?.trim()
                                    //   }
                                    sx={{ mb: 2 }}
                                    InputProps={{
                                        inputProps: {
                                            'data-testid':
                                                'provide-preferred-input',
                                        },
                                    }}
                                />
                            }
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={Boolean(
                                            currentBudgetDiscussionData
                                                ?.bd_proposal_ownership?.agreed
                                        )}
                                        onChange={(e) =>
                                            handleDataChange(e, 'agreed')
                                        }
                                        inputProps={{
                                            'data-testid': 'agree-checkbox',
                                        }}
                                    />
                                }
                                label={
                                    <Typography variant='body2'>
                                        I agree to the information in section 1
                                        to be shared publicly
                                    </Typography>
                                }
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
                            showBack={!currentBudgetDiscussionData?.master_id}
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
export default ProposalOwnership;
