import {
    Box,
    Button,
    Card,
    CardContent,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { LinkManager, WithdrawalsManager, ConstitutionManager } from '.';
import { useAppContext } from '../../context/context';
import { getGovernanceActionTypes } from '../../lib/api';
import { containsString, maxLengthCheck } from '../../lib/utils';
import { set } from 'date-fns';
const Step2 = ({
    setStep,
    proposalData,
    setProposalData,
    handleSaveDraft,
    governanceActionTypes,
    setGovernanceActionTypes,
    isSmallScreen,
    isContinueDisabled,
    errors,
    setErrors,
    helperText,
    setHelperText,
    linksErrors,
    setLinksErrors,
    withdrawalsErrors,
    setWithdrawalsErrors,
    constitutionErrors,
    setConstitutionErrors,
}) => {
    const titleMaxLength = 80;
    const abstractMaxLength = 2500;
    const motivationRationaleMaxLength = 12000;
    const { setLoading } = useAppContext();
    const [selectedGovActionName, setSelectedGovActionName] = useState(
        governanceActionTypes.find(
            (option) => option?.value === +proposalData?.gov_action_type_id
        )?.label || ''
    );
    const [selectedGovActionId, setSelectedGovActionId] = useState(
        proposalData?.attributes?.content?.attributes?.gov_action_type?.id ||
            null
    );
    const [isDraftDisabled, setIsDraftDisabled] = useState(true);
    const handleChange = (e) => {
        const selectedValue = e.target.value;
        const selectedLabel = governanceActionTypes.find(
            (option) => option?.value === selectedValue
        )?.label;

        setProposalData((prev) => ({
            ...prev,
            gov_action_type_id: selectedValue,
            proposal_withdrawals: [
                { prop_receiving_address: null, prop_amount: null },
            ],
        }));
        if (selectedValue != 3) {
            //cleanup fields co
            setProposalData((prev) => ({
                ...prev,
                proposal_constitution_content: {},
            }));
        }
        setSelectedGovActionId(selectedValue);
        setSelectedGovActionName(selectedLabel);
    };

    const fetchGovernanceActionTypes = async () => {
        setLoading(true);
        try {
            const governanceActionTypeList = await getGovernanceActionTypes();
            const mappedData = governanceActionTypeList?.data?.map((item) => ({
                value: item?.id,
                label: item?.attributes?.gov_action_type_name,
            }));
            setGovernanceActionTypes(mappedData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleTextAreaChange = (event, field, errorField) => {
        const value = event?.target?.value;

        setProposalData((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (value === '') {
            setHelperText((prev) => ({
                ...prev,
                [errorField]: '',
            }));
            setErrors((prev) => ({
                ...prev,
                [errorField]: false,
            }));
            return;
        }

        let errorMessage = '';
        errorMessage = containsString(value);

        if (errorMessage === true && field === 'prop_name') {
            errorMessage = maxLengthCheck(value, titleMaxLength);
        }

        setHelperText((prev) => ({
            ...prev,
            [errorField]: errorMessage === true ? '' : errorMessage,
        }));

        setErrors((prev) => ({
            ...prev,
            [errorField]: errorMessage === true ? false : true,
        }));
    };

    useEffect(() => {
        fetchGovernanceActionTypes();
    }, []);

    useEffect(() => {
        setSelectedGovActionName(
            governanceActionTypes.find(
                (option) => option?.value === +proposalData?.gov_action_type_id
            )?.label || ''
        );
        setSelectedGovActionId(+proposalData?.gov_action_type_id);
    }, [governanceActionTypes]);

    useEffect(() => {
        if (linksErrors && typeof linksErrors === 'object') {
            const hasLinkError = Object.values(linksErrors).some(
                (err) =>
                    (typeof err?.url === 'string' && err.url.trim() !== '') ||
                    (typeof err?.text === 'string' && err.text.trim() !== '')
            );
            console.log('🚀 ~ useEffect ~ hasLinkError:', hasLinkError);
            if (hasLinkError) {
                setIsDraftDisabled(true);
                return;
            }
        }
        setIsDraftDisabled(false);
        if (
            proposalData?.gov_action_type_id &&
            proposalData?.prop_name?.length !== 0
        ) {
            setIsDraftDisabled(false);
        } else {
            setIsDraftDisabled(true);
        }
        if (
            proposalData?.proposal_constitution_content
                ?.prop_have_guardrails_script
        ) {
            if (
                proposalData.proposal_constitution_content
                    .prop_guardrails_script_url &&
                proposalData.proposal_constitution_content
                    .prop_guardrails_script_hash
            ) {
                setIsDraftDisabled(false);
            } else setIsDraftDisabled(true);
        }
    }, [proposalData, linksErrors]);

    return (
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
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
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
                            variant='subtitle2'
                            color={(theme) => theme.palette.text.orange}
                            gutterBottom
                        >
                            REQUIRED
                        </Typography>

                        <Typography variant='h4' gutterBottom>
                            Proposal Details
                        </Typography>
                    </Box>

                    <TextField
                        select
                        label='Governance Action Type'
                        value={proposalData?.gov_action_type_id || ''}
                        required
                        fullWidth
                        onChange={handleChange}
                        SelectProps={{
                            SelectDisplayProps: {
                                'data-testid': 'governance-action-type',
                            },
                        }}
                    >
                        {governanceActionTypes?.map((option, index) => (
                            <MenuItem
                                key={option?.value}
                                value={option?.value}
                                data-testid={`${option?.label?.toLowerCase()}-button`}
                            >
                                {option?.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label='Title'
                        variant='outlined'
                        value={proposalData?.prop_name || ''}
                        fullWidth
                        onChange={(e) =>
                            handleTextAreaChange(e, 'prop_name', 'name')
                        }
                        required
                        inputProps={{
                            'data-testid': 'title-input',
                        }}
                        error={errors?.name}
                        helperText={helperText?.name}
                        FormHelperTextProps={{
                            'data-testid': 'title-input-error',
                        }}
                    />

                    <TextField
                        size='large'
                        name='Abstract'
                        label='Abstract'
                        multiline
                        rows={isSmallScreen ? 10 : 4}
                        value={proposalData?.prop_abstract || ''}
                        onChange={(e) =>
                            handleTextAreaChange(e, 'prop_abstract', 'abstract')
                        }
                        required
                        helperText={
                            helperText?.abstract ? (
                                helperText?.abstract
                            ) : (
                                <>
                                    <Typography
                                        variant='caption'
                                        data-testid='abstract-helper-text'
                                    >
                                        * A short summary of your proposal
                                    </Typography>
                                    <Typography
                                        variant='caption'
                                        sx={{ float: 'right' }}
                                        data-testid='abstract-helper-character-count'
                                    >
                                        {`${
                                            proposalData?.prop_abstract
                                                ?.length || 0
                                        }/${abstractMaxLength}`}
                                    </Typography>
                                </>
                            )
                        }
                        InputProps={{
                            inputProps: {
                                maxLength: abstractMaxLength,
                                'data-testid': 'abstract-input',
                            },
                        }}
                        error={errors?.abstract}
                        FormHelperTextProps={{
                            'data-testid': errors?.abstract
                                ? 'abstract-helper-error'
                                : 'abstract-helper',
                        }}
                    />

                    <TextField
                        size='large'
                        name='Motivation'
                        label='Motivation'
                        placeholder='This is a problem because...'
                        multiline
                        rows={isSmallScreen ? 10 : 4}
                        value={proposalData?.prop_motivation || ''}
                        onChange={(e) =>
                            handleTextAreaChange(
                                e,
                                'prop_motivation',
                                'motivation'
                            )
                        }
                        required
                        helperText={
                            helperText?.motivation ? (
                                helperText?.motivation
                            ) : (
                                <>
                                    <Typography
                                        variant='caption'
                                        data-testid='motivation-helper-text'
                                    >
                                        * What problem is your proposal solving?
                                    </Typography>
                                    <Typography
                                        variant='caption'
                                        sx={{ float: 'right' }}
                                        data-testid='motivation-helper-character-count'
                                    >
                                        {`${
                                            proposalData?.prop_motivation
                                                ?.length || 0
                                        }/${motivationRationaleMaxLength}`}
                                    </Typography>
                                </>
                            )
                        }
                        InputProps={{
                            inputProps: {
                                maxLength: motivationRationaleMaxLength,
                                'data-testid': 'motivation-input',
                            },
                        }}
                        error={errors?.motivation}
                        FormHelperTextProps={{
                            'data-testid': errors?.motivation
                                ? 'motivation-helper-error'
                                : 'motivation-helper',
                        }}
                    />

                    <TextField
                        size='large'
                        name='Rationale'
                        label='Rationale'
                        placeholder='This problem is solved by...'
                        multiline
                        rows={isSmallScreen ? 10 : 4}
                        value={proposalData?.prop_rationale || ''}
                        onChange={(e) =>
                            handleTextAreaChange(
                                e,
                                'prop_rationale',
                                'rationale'
                            )
                        }
                        required
                        helperText={
                            helperText?.rationale ? (
                                helperText?.rationale
                            ) : (
                                <>
                                    <Typography
                                        variant='caption'
                                        data-testid='rationale-helper-text'
                                    >
                                        * How does the on-chain change solve the
                                        problem?
                                    </Typography>
                                    <Typography
                                        variant='caption'
                                        sx={{ float: 'right' }}
                                        data-testid='rationale-helper-character-count'
                                    >
                                        {`${
                                            proposalData?.prop_rationale
                                                ?.length || 0
                                        }/${motivationRationaleMaxLength}`}
                                    </Typography>
                                </>
                            )
                        }
                        InputProps={{
                            inputProps: {
                                maxLength: motivationRationaleMaxLength,
                                'data-testid': 'rationale-input',
                            },
                        }}
                        error={errors?.rationale}
                        FormHelperTextProps={{
                            'data-testid': errors?.rationale
                                ? 'rationale-helper-error'
                                : 'rationale-helper',
                        }}
                    />
                    {
                        /// Treasury
                        selectedGovActionId == 2 ? (
                            <>
                                <Box
                                    sx={{
                                        align: 'center',
                                        textAlign: 'center',
                                        mt: 2,
                                    }}
                                >
                                    <WithdrawalsManager
                                        proposalData={proposalData}
                                        setProposalData={setProposalData}
                                        withdrawalsErrors={withdrawalsErrors}
                                        setWithdrawalsErrors={
                                            setWithdrawalsErrors
                                        }
                                    />
                                </Box>
                            </>
                        ) : null
                    }
                    {
                        /// 'Constitution'
                        selectedGovActionId === 3 ? (
                            <ConstitutionManager
                                proposalData={proposalData}
                                setProposalData={setProposalData}
                                constitutionManagerErrors={constitutionErrors}
                                setConstitutionManagerErrors={
                                    setConstitutionErrors
                                }
                            ></ConstitutionManager>
                        ) : null
                    }
                    <Box
                        sx={{
                            align: 'center',
                            textAlign: 'center',
                            mt: 2,
                        }}
                    >
                        <Typography
                            variant='subtitle2'
                            color={(theme) => theme.palette.text.orange}
                            gutterBottom
                        >
                            OPTIONAL
                        </Typography>

                        <Typography variant='h5' gutterBottom>
                            References and Supporting Information
                        </Typography>

                        <Typography
                            variant='subtitle2'
                            color={(theme) => theme.palette.text.grey}
                            gutterBottom
                        >
                            Links to additional content or social media contacts
                            (up to 7 entries)
                        </Typography>
                    </Box>

                    <LinkManager
                        proposalData={proposalData}
                        setProposalData={setProposalData}
                        linksErrors={linksErrors}
                        setLinksErrors={setLinksErrors}
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: isSmallScreen ? 'column' : 'row',
                        justifyContent: 'space-between',
                        mt: 10,
                    }}
                >
                    <Box>
                        <Button
                            variant='outlined'
                            sx={{
                                mb: {
                                    xs: 2,
                                    md: 0,
                                },
                            }}
                            fullWidth={isSmallScreen}
                            onClick={() => setStep(1)}
                            data-testid='back-button'
                        >
                            Back
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 2,
                        }}
                    >
                        <Box
                            sx={{
                                whiteSpace: 'nowrap',
                                textTransform: 'none',
                                width: '100%',
                            }}
                        >
                            <Button
                                variant='text'
                                fullWidth
                                disabled={isDraftDisabled}
                                onClick={() => {
                                    handleSaveDraft(true);
                                }}
                                data-testid='save-draft-button'
                            >
                                Save Draft
                            </Button>
                        </Box>
                        <Box
                            sx={{
                                width: '100%',
                            }}
                        >
                            <Button
                                variant='contained'
                                fullWidth
                                disabled={isContinueDisabled}
                                onClick={() => setStep(3)}
                                data-testid='continue-button'
                            >
                                Continue
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default Step2;
