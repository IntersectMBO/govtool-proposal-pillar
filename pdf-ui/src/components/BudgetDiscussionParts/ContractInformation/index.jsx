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
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getCountryList } from '../../../lib/api';
import { StepperActionButtons } from '../../BudgetDiscussionParts';

const ContractInformation = ({
    setStep,
    step,
    onClose,
    currentBudgetDiscussionData,
    setBudgetDiscussionData,
    setSelectedDraftId,
    selectedDraftId,
    handleSaveDraft,
    errors,
    setErrors,
    validateSection,
}) => {
    const [allCountries, setAllCountries] = useState([]);
    //const [allNationalities, setAllNationalities] = useState([]);

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
        validateSection('bd_contact_information');
    }, [currentBudgetDiscussionData?.bd_contact_information]);

    const handleDataChange = (e, dataName) => {
        setBudgetDiscussionData({
            ...currentBudgetDiscussionData,
            bd_contact_information: {
                ...currentBudgetDiscussionData?.bd_contact_information,
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
                            <Typography variant='h4' gutterBottom>
                                Section 1: Contact Information
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
                                7
                            </Typography>
                        </Box>
                        <Box
                            color={(theme) => theme.palette.text.grey}
                            sx={{ mb: 2 }}
                        >
                            <Typography variant='body1' gutterBottom>
                                In order to process your proposal, Intersect
                                requires a few contact details. This section
                                will be kept confidential and will not be
                                publicly shared.
                            </Typography>
                            <Typography variant='body1' gutterBottom>
                                We will collect the contact details for two
                                individuals:
                            </Typography>
                            <List
                                sx={{
                                    listStyleType: 'disc',
                                    marginLeft: 2,
                                    textAlign: 'justify',
                                    marginBottom: 0,
                                }}
                            >
                                <ListItem
                                    sx={{
                                        textAlign: 'justify',
                                        display: 'list-item',
                                        paddingY: 0,
                                        marginY: 0,
                                    }}
                                >
                                    <Typography variant='body1' gutterBottom>
                                        The beneficiary of the project - the
                                        person responsible for signing the legal
                                        contract on behalf of a company / entity
                                        (if approved on-chain).
                                    </Typography>
                                </ListItem>
                                <ListItem
                                    sx={{
                                        textAlign: 'justify',
                                        display: 'list-item',
                                        paddingY: 0,
                                        marginY: 0,
                                    }}
                                >
                                    <Typography variant='body1' gutterBottom>
                                        The submission lead - the person
                                        submitting the proposal.
                                    </Typography>
                                </ListItem>
                            </List>
                            <Typography variant='body1' gutterBottom>
                                If you are submitting on behalf of an Intersect
                                Committee, the Committee Chair will be the
                                beneficiary and the Committee Secretary will be
                                the submission lead. Please submit the Intersect
                                Committee's email as the beneficiary email. The
                                same individual may fulfil both roles.
                                Additionally, the submission lead may also serve
                                as the proposal's public champion, as further
                                defined below.
                            </Typography>
                        </Box>
                        <Box>
                            <TextField
                                name='Beneficiary Full Name'
                                label='Beneficiary Full Name'
                                value={
                                    currentBudgetDiscussionData
                                        ?.bd_contact_information
                                        ?.be_full_name || ''
                                }
                                helperText={
                                    //  errors[
                                    //      'bd_contact_information.be_full_name'
                                    //  ]?.trim() ||
                                    'The person responsible for signing the legal contract on behalf of a company / entity (if approved on-chain).'
                                }
                                required
                                fullWidth
                                //   error={
                                //       !!errors[
                                //           'bd_contact_information.be_full_name'
                                //       ]?.trim()
                                //   }
                                onChange={(e) =>
                                    handleDataChange(e, 'be_full_name')
                                }
                                sx={{ mb: 2 }}
                                inputProps={{
                                    'data-testid':
                                        'beneficiary-full-name-input',
                                }}
                            />
                            <TextField
                                name='Beneficiary e-mail'
                                label='Beneficiary e-mail'
                                value={
                                    currentBudgetDiscussionData
                                        ?.bd_contact_information?.be_email || ''
                                }
                                required
                                helperText={
                                    currentBudgetDiscussionData
                                        ?.bd_contact_information?.be_email &&
                                    errors[
                                        'bd_contact_information.be_email'
                                    ]?.trim()
                                }
                                error={
                                    currentBudgetDiscussionData
                                        ?.bd_contact_information?.be_email &&
                                    !!errors[
                                        'bd_contact_information.be_email'
                                    ]?.trim()
                                }
                                type='email'
                                fullWidth
                                onChange={(e) =>
                                    handleDataChange(e, 'be_email')
                                }
                                sx={{ mb: 2 }}
                                inputProps={{
                                    'data-testid': 'beneficiary-email-input',
                                }}
                                FormHelperTextProps={{
                                    ...(errors[
                                        'bd_contact_information.be_email'
                                    ]?.trim() && {
                                        'data-testid':
                                            'beneficiary-email-error',
                                    }),
                                }}
                            />
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            select
                                            label='Beneficiary Country of Residence'
                                            value={
                                                currentBudgetDiscussionData
                                                    ?.bd_contact_information
                                                    ?.be_country_of_res || ''
                                            }
                                            //     helperText={errors[
                                            //         'bd_contact_information.be_country_of_res'
                                            //     ]?.trim()}
                                            //     error={
                                            //         !!errors[
                                            //             'bd_contact_information.be_country_of_res'
                                            //         ]?.trim()
                                            //     }
                                            required
                                            fullWidth
                                            onChange={(e) =>
                                                handleDataChange(
                                                    e,
                                                    'be_country_of_res'
                                                )
                                            }
                                            SelectProps={{
                                                SelectDisplayProps: {
                                                    'data-testid':
                                                        'beneficiary-country-of-residence',
                                                },
                                            }}
                                            sx={{ mb: 2 }}
                                        >
                                            {allCountries.map((option) => (
                                                <MenuItem
                                                    key={option?.id}
                                                    value={option?.id}
                                                    data-testid={`${option?.attributes.country_name?.replace(/\s/g, '-').toLowerCase()}-button`}
                                                >
                                                    {
                                                        option?.attributes
                                                            .country_name
                                                    }
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            select
                                            label='Beneficiary Nationality'
                                            value={
                                                currentBudgetDiscussionData
                                                    ?.bd_contact_information
                                                    ?.be_nationality || ''
                                            }
                                            required
                                            fullWidth
                                            //     helperText={errors[
                                            //         'bd_contact_information.be_nationality'
                                            //     ]?.trim()}
                                            //     error={
                                            //         !!errors[
                                            //             'bd_contact_information.be_nationality'
                                            //         ]?.trim()
                                            //     }
                                            onChange={(e) =>
                                                handleDataChange(
                                                    e,
                                                    'be_nationality'
                                                )
                                            }
                                            SelectProps={{
                                                SelectDisplayProps: {
                                                    'data-testid':
                                                        'beneficiary-nationality',
                                                },
                                            }}
                                            sx={{ mb: 2 }}
                                        >
                                            {allCountries?.map((option) => (
                                                <MenuItem
                                                    key={option?.id}
                                                    value={option?.id}
                                                    data-testid={`${option?.attributes.country_name?.replace(/\s/g, '-').toLowerCase()}-button`}
                                                >
                                                    {
                                                        option?.attributes
                                                            .country_name
                                                    }
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>
                            </Box>
                            <TextField
                                name='*Submission Lead Full Name'
                                label='Submission Lead Full Name'
                                value={
                                    currentBudgetDiscussionData
                                        ?.bd_contact_information
                                        ?.submission_lead_full_name || ''
                                }
                                required
                                fullWidth
                                helperText={
                                    //  errors[
                                    //      'bd_contact_information.submission_lead_full_name'
                                    //  ]?.trim() ||
                                    'The person submitting the proposal'
                                }
                                //   error={
                                //       !!errors[
                                //           'bd_contact_information.submission_lead_full_name'
                                //       ]?.trim()
                                //   }
                                onChange={(e) =>
                                    handleDataChange(
                                        e,
                                        'submission_lead_full_name'
                                    )
                                }
                                sx={{ mb: 2 }}
                                inputProps={{
                                    'data-testid':
                                        'submission-lead-full-name-input',
                                }}
                            />
                            <TextField
                                name='*Submission Lead Email'
                                label='Submission Lead Email'
                                value={
                                    currentBudgetDiscussionData
                                        ?.bd_contact_information
                                        ?.submission_lead_email || ''
                                }
                                required
                                fullWidth
                                helperText={
                                    currentBudgetDiscussionData
                                        ?.bd_contact_information
                                        ?.submission_lead_email &&
                                    errors[
                                        'bd_contact_information.submission_lead_email'
                                    ]?.trim()
                                }
                                error={
                                    currentBudgetDiscussionData
                                        ?.bd_contact_information
                                        ?.submission_lead_email &&
                                    !!errors[
                                        'bd_contact_information.submission_lead_email'
                                    ]?.trim()
                                }
                                onChange={(e) =>
                                    handleDataChange(e, 'submission_lead_email')
                                }
                                sx={{ mb: 2 }}
                                inputProps={{
                                    'data-testid':
                                        'submission-lead-email-input',
                                }}
                                FormHelperTextProps={{
                                    ...(errors[
                                        'bd_contact_information.submission_lead_email'
                                    ]?.trim() && {
                                        'data-testid':
                                            'submission-lead-email-error',
                                    }),
                                }}
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
};

export default ContractInformation;
