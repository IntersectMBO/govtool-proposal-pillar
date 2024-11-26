'use client';

import { useTheme } from '@emotion/react';
import {
    IconCheveronLeft,
    IconInformationCircle,
    IconPencil,
    IconTrash,
    IconX,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    Grid,
    IconButton,
    MenuItem,
    Modal,
    TextField,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/context';
import {
    createProposalContent,
    deleteProposal,
    getGovernanceActionTypes,
} from '../../lib/api';
import {
    containsString,
    formatIsoDate,
    isRewardAddress,
    maxLengthCheck,
    numberValidation,
} from '../../lib/utils';
import { LinkManager } from '../CreationGoveranceAction';
import { WithdrawalsManager } from '../CreationGoveranceAction';
import DeleteProposalModal from '../DeleteProposalModal';

import CreateGA2 from '../../assets/svg/CreateGA2.jsx';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
        xs: '90%',
        sm: '50%',
        md: '30%',
    },
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '20px',
};

const EditProposalDialog = ({
    proposal,
    openEditDialog,
    handleCloseEditDialog,
    setMounted,
    abstractMaxLength = 2500,
    motivationRationaleMaxLength = 12000,
    titleMaxLength = 80,
    onUpdate = false,
    setShouldRefresh = false,
}) => {
    const navigate = useNavigate();
    const { setLoading } = useAppContext();
    const theme = useTheme();
    const [draft, setDraft] = useState({});
    const [isSaveDisabled, setIsSaveDisabled] = useState(true);
    const [openSaveDraftModal, setOpenSaveDraftModal] = useState(false);
    const [openPublishModal, setOpenPublishModal] = useState(false);
    const [governanceActionTypes, setGovernanceActionTypes] = useState([]);
    const [openDeleteConfirmationModal, setOpenDeleteConfirmationModal] =
        useState(false);
    const [selectedGovActionName, setSelectedGovActionName] = useState(
        proposal?.attributes?.content?.attributes?.gov_action_type?.attributes
            ?.gov_action_type_name
    );
    const [showProposalDeleteModal, setShowProposalDeleteModal] =
        useState(false);

    const [errors, setErrors] = useState({
        name: false,
        abstract: false,
        motivation: false,
        rationale: false,
    });
    const [helperText, setHelperText] = useState({
        name: '',
        abstract: '',
        motivation: '',
        rationale: '',
    });

    const [linksErrors, setLinksErrors] = useState({});
    const [withdrawalsErrors, setWithdrawalsErrors] = useState({});


    const isSmallScreen = useMediaQuery((theme) =>
        theme.breakpoints.down('sm')
    );

    const handleIsSaveDisabled = () => {
        if (
            draft?.gov_action_type_id &&
            draft?.prop_name &&
            !errors?.name &&
            draft?.prop_abstract &&
            !errors?.abstract &&
            draft?.prop_motivation &&
            !errors?.motivation &&
            draft?.prop_rationale &&
            !errors?.rationale
        ) {
            if (draft?.proposal_links) {
                if (
                    draft?.proposal_links?.some(
                        (link) => !link.prop_link || !link.prop_link_text
                    ) ||
                    Object.values(linksErrors).some((error) => error.url)
                ) {
                    return setIsSaveDisabled(true);
                } else {
                    setIsSaveDisabled(false);
                }
            }
            if (draft?.proposal_withdrawals) {
                 if (
                     draft?.proposal_withdrawals?.some(
                         (proposal_withdrawal) => !proposal_withdrawal || !proposal_withdrawal.prop_receiving_address
                     ) ||
                     Object.values(withdrawalsErrors).some((error) => error.prop_receiving_address)
                 ) {
                     return setIsSaveDisabled(true);
                 } else {
                     setIsSaveDisabled(false);
                 }
             }
             const selectedLabel = governanceActionTypes.find(
                (option) => option?.value === draft?.gov_action_type_id
            )?.label;

            if (selectedLabel === 'Treasury') {
                if (
                    draft?.prop_receiving_address &&
                    !errors?.address &&
                    draft?.prop_amount &&
                    !errors?.amount
                ) {
                    setIsSaveDisabled(false);
                } else {
                    setIsSaveDisabled(true);
                }
            } else {
                setIsSaveDisabled(false);
            }
        } else {
            setIsSaveDisabled(true);
        }
    };
    const setDraftData = (proposalData) => {
        const draft = {
            proposal_id: proposalData?.id,
            gov_action_type_id:
                proposalData?.attributes?.content?.attributes
                    ?.gov_action_type_id,
            prop_abstract:
                proposalData?.attributes?.content?.attributes?.prop_abstract,
            prop_motivation:
                proposalData?.attributes?.content?.attributes?.prop_motivation,
            prop_name: proposalData?.attributes?.content?.attributes?.prop_name,
            prop_rationale:
                proposalData?.attributes?.content?.attributes?.prop_rationale,
            proposal_withdrawals:
                proposalData?.attributes?.content?.attributes?.proposal_withdrawals,
            proposal_links:
                proposalData?.attributes?.content?.attributes?.proposal_links,
        };
        return draft;
    };

    const handleDeleteProposal = async () => {
        setLoading(true);
        try {
            const response = await deleteProposal(proposal?.id);
            if (!response) return;

            setShowProposalDeleteModal(false);
            setOpenDeleteConfirmationModal(true);
        } catch (error) {
            console.error('Failed to delete proposal:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTextAreaChange = (event, field, errorField) => {
        const value = event?.target?.value;
        setDraft((prev) => ({
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

    const handleUpdatePorposal = async (isDraft = false) => {
        setLoading(true);

        let proposalConentObj = {};

        if (isDraft === true) {
            proposalConentObj.is_draft = true;
            proposalConentObj.prop_rev_active = true;
        } else {
            proposalConentObj.prop_rev_active = true;
        }

        try {
            const response = await createProposalContent({
                ...draft,
                ...proposalConentObj,
            });
            if (!response) return;

            if (onUpdate && !isDraft) {
                onUpdate();
            }
        } catch (error) {
            console.error('Failed to delete proposal:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenSaveDraftModal = () => {
        setOpenSaveDraftModal(true);
    };

    const handleCloseSaveDraftModal = () => {
        setOpenSaveDraftModal(false);
    };

    const handleOpenPublishModal = () => {
        setOpenPublishModal(true);
    };

    const handleClosePublishModal = () => {
        setOpenPublishModal(false);
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

    const handleChange = (e) => {
        const selectedValue = e.target.value;
        const selectedLabel = governanceActionTypes.find(
            (option) => option?.value === selectedValue
        )?.label;

        setDraft((prev) => ({
            ...prev,
            gov_action_type_id: selectedValue,
            prop_receiving_address: null,
            prop_amount: null,
        }));

        setSelectedGovActionName(selectedLabel);
    };

    useEffect(() => {
        fetchGovernanceActionTypes();
    }, []);
    useEffect(() => {
        setDraft(setDraftData(proposal));
    }, [proposal]);
    useEffect(() => {
        handleIsSaveDisabled();
    }, [draft, errors, linksErrors]);

    return (
        <Dialog
            fullScreen
            open={openEditDialog}
            onClose={handleCloseEditDialog}
            data-testid='edit-proposal-dialog'
        >
            <Box height={'100%'} position={'relative'}>
                <Grid
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        overflow: 'auto',
                        minHeight: 0,
                    }}
                >
                    <Grid
                        item
                        sx={{
                            borderBottom: `1px solid ${theme.palette.border.gray}`,
                            pl: 4,
                            mt: 2,
                        }}
                    >
                        <Typography variant='h4' component='h1' gutterBottom>
                            Edit Proposal
                        </Typography>
                    </Grid>
                    <Grid item m={2} zIndex={10}>
                        <Button
                            size='small'
                            startIcon={
                                <IconCheveronLeft
                                    width='18'
                                    height='18'
                                    fill={theme.palette.primary.main}
                                />
                            }
                            onClick={() => {
                                handleCloseEditDialog();
                            }}
                        >
                            Back
                        </Button>
                    </Grid>
                    <Grid
                        xs={12}
                        item
                        display='flex'
                        justifyContent='center'
                        alignContent='center'
                        m={2}
                        zIndex={10}
                    >
                        <Grid
                            xs={11}
                            md={5}
                            item
                            zIndex={1}
                            maxWidth='910px'
                            width='100%'
                        >
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
                                                color={(theme) =>
                                                    theme.palette.text.orange
                                                }
                                                gutterBottom
                                            >
                                                REQUIRED
                                            </Typography>

                                            <Typography
                                                variant='h4'
                                                gutterBottom
                                            >
                                                Proposal Details
                                            </Typography>

                                            <Box>
                                                <Button
                                                    variant='outlined'
                                                    sx={{
                                                        mt: 2,
                                                        mb: 2,
                                                        color: 'black',
                                                        borderColor: (theme) =>
                                                            theme.palette
                                                                .primary
                                                                .lightGray,
                                                        '&:hover': {
                                                            backgroundColor:
                                                                'rgba(0, 0, 0, 0.08)',
                                                            borderColor:
                                                                'black',
                                                            color: 'black',
                                                        },
                                                    }}
                                                    startIcon={
                                                        <IconTrash
                                                            width='18'
                                                            height='18'
                                                        />
                                                    }
                                                    onClick={() =>
                                                        setShowProposalDeleteModal(
                                                            true
                                                        )
                                                    }
                                                    data-testid='delete-proposal-button'
                                                >
                                                    Delete Proposal
                                                </Button>
                                            </Box>
                                        </Box>

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                textAlign: 'center',
                                                mb: 2,
                                            }}
                                        >
                                            {/* <Box>
                                                <Typography
                                                    variant='body2'
                                                    component='p'
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent:
                                                            'center',
                                                        alignItems: 'center',
                                                        borderTopLeftRadius:
                                                            '8px',
                                                        borderTopRightRadius:
                                                            '8px',
                                                        borderBottomLeftRadius: 0,
                                                        borderBottomRightRadius: 0,
                                                        gap: 1,
                                                        backgroundColor:
                                                            '#B8CDFF',
                                                        color: 'text.black',
                                                    }}
                                                >
                                                    <IconInformationCircle />
                                                    {`Submit: ${formatIsoDate(
                                                        proposal?.attributes
                                                            ?.createdAt
                                                    )}`}
                                                </Typography>
                                            </Box> */}
                                            <Box>
                                                <Typography
                                                    variant='body2'
                                                    component='p'
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent:
                                                            'center',
                                                        alignItems: 'center',
                                                        borderRadius: '8px',
                                                        gap: 1,
                                                        backgroundColor:
                                                            '#F3F4F8',
                                                        color: 'text.black',
                                                    }}
                                                >
                                                    <IconInformationCircle />
                                                    {`Last Edit: ${
                                                        proposal?.attributes
                                                            ?.updatedAt
                                                            ? formatIsoDate(
                                                                  proposal
                                                                      ?.attributes
                                                                      ?.updatedAt
                                                              )
                                                            : '--'
                                                    }`}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <TextField
                                            select
                                            label='Governance Action Type'
                                            fullWidth
                                            required
                                            value={
                                                draft?.gov_action_type_id || ''
                                            }
                                            onChange={handleChange}
                                            SelectProps={{
                                                SelectDisplayProps: {
                                                    'data-testid':
                                                        'governance-action-type',
                                                },
                                            }}
                                        >
                                            {governanceActionTypes?.map(
                                                (option) => (
                                                    <MenuItem
                                                        key={option?.value}
                                                        value={option?.value}
                                                        data-testid={`${option?.label?.toLowerCase()}-button`}
                                                    >
                                                        {option?.label}
                                                    </MenuItem>
                                                )
                                            )}
                                        </TextField>

                                        <TextField
                                            label='Title'
                                            variant='outlined'
                                            value={draft?.prop_name || ''}
                                            fullWidth
                                            onChange={(e) =>
                                                handleTextAreaChange(
                                                    e,
                                                    'prop_name',
                                                    'name'
                                                )
                                            }
                                            required
                                            inputProps={{
                                                'data-testid': 'title-input',
                                            }}
                                            error={errors?.name}
                                            helperText={helperText?.name}
                                            FormHelperTextProps={{
                                                'data-testid':
                                                    'title-input-error',
                                            }}
                                        />

                                        <TextField
                                            size='large'
                                            name='Abstract'
                                            label='Abstract'
                                            placeholder='Summary...'
                                            multiline
                                            rows={isSmallScreen ? 10 : 4}
                                            value={draft?.prop_abstract || ''}
                                            onChange={(e) =>
                                                handleTextAreaChange(
                                                    e,
                                                    'prop_abstract',
                                                    'abstract'
                                                )
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
                                                            * A short summary of
                                                            your proposal
                                                        </Typography>
                                                        <Typography
                                                            variant='caption'
                                                            sx={{
                                                                float: 'right',
                                                            }}
                                                            data-testid='abstract-helper-character-count'
                                                        >
                                                            {`${
                                                                draft
                                                                    ?.prop_abstract
                                                                    ?.length ||
                                                                0
                                                            }/${abstractMaxLength}`}
                                                        </Typography>
                                                    </>
                                                )
                                            }
                                            InputProps={{
                                                inputProps: {
                                                    maxLength:
                                                        abstractMaxLength,
                                                    'data-testid':
                                                        'abstract-input',
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
                                            value={draft?.prop_motivation || ''}
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
                                                            * What problem is
                                                            your proposal
                                                            solving?
                                                        </Typography>
                                                        <Typography
                                                            variant='caption'
                                                            sx={{
                                                                float: 'right',
                                                            }}
                                                            data-testid='motivation-helper-character-count'
                                                        >
                                                            {`${
                                                                draft
                                                                    ?.prop_motivation
                                                                    ?.length ||
                                                                0
                                                            }/${motivationRationaleMaxLength}`}
                                                        </Typography>
                                                    </>
                                                )
                                            }
                                            InputProps={{
                                                inputProps: {
                                                    maxLength:
                                                        motivationRationaleMaxLength,
                                                    'data-testid':
                                                        'motivation-input',
                                                },
                                            }}
                                            error={errors?.motivation}
                                            FormHelperTextProps={{
                                                'data-testid':
                                                    errors?.motivation
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
                                            value={draft?.prop_rationale || ''}
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
                                                            * How does the
                                                            on-chain change
                                                            solve the problem?
                                                        </Typography>
                                                        <Typography
                                                            variant='caption'
                                                            sx={{
                                                                float: 'right',
                                                            }}
                                                            data-testid='rationale-helper-character-count'
                                                        >
                                                            {`${
                                                                draft
                                                                    ?.prop_rationale
                                                                    ?.length ||
                                                                0
                                                            }/${motivationRationaleMaxLength}`}
                                                        </Typography>
                                                    </>
                                                )
                                            }
                                            InputProps={{
                                                inputProps: {
                                                    maxLength:
                                                        motivationRationaleMaxLength,
                                                    'data-testid':
                                                        'rationale-input',
                                                },
                                            }}
                                            error={errors?.rationale}
                                            FormHelperTextProps={{
                                                'data-testid': errors?.rationale
                                                    ? 'rationale-helper-error'
                                                    : 'rationale-helper',
                                            }}
                                        />

                                        {selectedGovActionName ===
                                        'Treasury' ? (
                                            <>
                                            <WithdrawalsManager
                                                proposalData={draft}
                                                setProposalData={setDraft}
                                                withdrawalsErrors={withdrawalsErrors}
                                                setWithdrawalsErrors={setWithdrawalsErrors}
                                            />
                                                {/* <TextField
                                                    fullWidth
                                                    margin='normal'
                                                    label='Receiving stake address'
                                                    placeholder='e.g. stake1...'
                                                    variant='outlined'
                                                    value={
                                                        draft?.prop_receiving_address ||
                                                        ''
                                                    }
                                                    onChange={
                                                        handleAddressChange
                                                    }
                                                    required
                                                    inputProps={{
                                                        'data-testid':
                                                            'receiving-address-input',
                                                    }}
                                                    error={errors?.address}
                                                    helperText={
                                                        helperText?.address
                                                    }
                                                    FormHelperTextProps={{
                                                        'data-testid':
                                                            'receiving-address-text-error',
                                                    }}
                                                />

                                                <TextField
                                                    fullWidth
                                                    margin='normal'
                                                    label='Amount'
                                                    type='tel'
                                                    variant='outlined'
                                                    placeholder='e.g. 2000 ada'
                                                    value={
                                                        draft?.prop_amount || ''
                                                    }
                                                    onChange={
                                                        handleAmountChange
                                                    }
                                                    required
                                                    inputProps={{
                                                        'data-testid':
                                                            'amount-input',
                                                    }}
                                                    error={errors?.amount}
                                                    helperText={
                                                        helperText?.amount
                                                    }
                                                    FormHelperTextProps={{
                                                        'data-testid':
                                                            'amount-text-error',
                                                    }}
                                                /> */}
                                            </>
                                        ) : null}

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                mt: 2,
                                            }}
                                        >
                                            <Typography
                                                variant='subtitle2'
                                                color={(theme) =>
                                                    theme.palette.text.orange
                                                }
                                                gutterBottom
                                            >
                                                OPTIONAL
                                            </Typography>

                                            <Typography
                                                variant='h5'
                                                textAlign='center'
                                                gutterBottom
                                            >
                                                References and Supporting
                                                Information
                                            </Typography>

                                            <Typography
                                                variant='subtitle2'
                                                textAlign='center'
                                                color={(theme) =>
                                                    theme.palette.text.grey
                                                }
                                                gutterBottom
                                            >
                                                Links to additional content or
                                                social media contacts (up to 7
                                                entries)
                                            </Typography>
                                        </Box>
                                        <LinkManager
                                            proposalData={draft}
                                            setProposalData={setDraft}
                                            linksErrors={linksErrors}
                                            setLinksErrors={setLinksErrors}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: isSmallScreen
                                                ? 'column'
                                                : 'row',
                                            justifyContent: 'space-between',
                                            mt: 10,
                                        }}
                                    >
                                        <Box>
                                            <Button
                                                variant='outlined'
                                                startIcon={
                                                    <IconPencil
                                                        fill={
                                                            theme.palette
                                                                .primary.main
                                                        }
                                                    />
                                                }
                                                sx={{
                                                    mb: { xs: 2, md: 0 },
                                                }}
                                                fullWidth={isSmallScreen}
                                                onClick={() => {
                                                    handleCloseEditDialog();
                                                }}
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
                                                width: isSmallScreen
                                                    ? '100%'
                                                    : 'auto',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    mr: 2,
                                                }}
                                            >
                                                <Button
                                                    variant='text'
                                                    fullWidth
                                                    disabled={isSaveDisabled}
                                                    onClick={async () => {
                                                        await handleUpdatePorposal(
                                                            true
                                                        );
                                                        handleOpenSaveDraftModal();
                                                        setMounted(false);
                                                    }}
                                                    data-testid='save-draft-button'
                                                >
                                                    Save Draft
                                                </Button>
                                            </Box>
                                            <Box
                                                sx={{
                                                    flexGrow: 1,
                                                }}
                                            >
                                                <Button
                                                    variant='contained'
                                                    sx={{
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                    fullWidth
                                                    disabled={isSaveDisabled}
                                                    onClick={() => {
                                                        handleOpenPublishModal();
                                                    }}
                                                    data-testid='publish-with-new-edits-button'
                                                >
                                                    Publish with new edits
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
                <Modal
                    open={openSaveDraftModal}
                    onClose={handleCloseSaveDraftModal}
                >
                    <Box sx={style}>
                        <Box
                            pt={2}
                            pl={2}
                            pr={2}
                            pb={1}
                            borderBottom={1}
                            borderColor={(theme) =>
                                theme.palette.border.lightGray
                            }
                        >
                            <Box
                                display='flex'
                                flexDirection='row'
                                justifyContent='space-between'
                                alignItems={'center'}
                            >
                                <Typography variant='h6' component='h2'>
                                    Proposal saved to drafts
                                </Typography>
                                <IconButton
                                    onClick={() => {
                                        handleCloseSaveDraftModal();
                                        handleCloseEditDialog();

                                        setMounted(false);
                                    }}
                                >
                                    <IconX width='24px' height='24px' />
                                </IconButton>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                p: 2,
                                display: 'flex',
                                justifyContent: 'center',
                                alignContent: 'center',
                            }}
                        >
                            <Button
                                variant='contained'
                                fullWidth
                                onClick={() => {
                                    handleCloseSaveDraftModal();
                                    handleCloseEditDialog();
                                }}
                            >
                                Close
                            </Button>
                        </Box>
                    </Box>
                </Modal>
                <Modal
                    open={openPublishModal}
                    onClose={handleClosePublishModal}
                >
                    <Box sx={style}>
                        <Box
                            pt={2}
                            pl={2}
                            pr={2}
                            pb={1}
                            borderBottom={1}
                            borderColor={(theme) =>
                                theme.palette.border.lightGray
                            }
                        >
                            <Box
                                display='flex'
                                flexDirection='row'
                                justifyContent='space-between'
                                alignItems={'center'}
                            >
                                <Typography variant='h6' component='h2'>
                                    Please confirm applied changes
                                </Typography>
                                <IconButton
                                    onClick={() => {
                                        handleClosePublishModal();
                                    }}
                                >
                                    <IconX width='24px' height='24px' />
                                </IconButton>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignContent: 'center',
                                gap: 2,
                            }}
                        >
                            <Button
                                variant='contained'
                                fullWidth
                                onClick={async () => {
                                    await handleUpdatePorposal(false);
                                    handleCloseSaveDraftModal();
                                    handleCloseEditDialog();
                                    setMounted(false);
                                }}
                                data-testid='confirm-button'
                            >
                                Confirm
                            </Button>
                            <Button
                                variant='outlined'
                                fullWidth
                                onClick={() => {
                                    handleClosePublishModal();
                                }}
                                data-testid='cancel-button'
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Modal>
                <Modal
                    open={openDeleteConfirmationModal}
                    onClose={() => {
                        handleCloseEditDialog();
                        navigate('/proposal_discussion');
                        if (setShouldRefresh) {
                            setShouldRefresh(true);
                        }
                    }}
                >
                    <Box sx={style}>
                        <Box
                            pt={2}
                            pl={2}
                            pr={2}
                            pb={1}
                            borderBottom={1}
                            borderColor={(theme) =>
                                theme.palette.border.lightGray
                            }
                        >
                            <Box
                                display='flex'
                                flexDirection='row'
                                justifyContent='space-between'
                                alignItems={'center'}
                            >
                                <Typography variant='h6' component='h2'>
                                    Proposal Deleted
                                </Typography>
                                <IconButton
                                    onClick={() => {
                                        setOpenDeleteConfirmationModal(false);
                                        handleCloseEditDialog();
                                        navigate('/proposal_discussion');
                                        if (setShouldRefresh) {
                                            setShouldRefresh(true);
                                        }
                                    }}
                                >
                                    <IconX width='24px' height='24px' />
                                </IconButton>
                            </Box>
                            <Typography
                                mt={2}
                                color={(theme) => theme.palette.text.grey}
                            >
                                The proposal has been deleted successfully.
                            </Typography>
                        </Box>
                        <Box display='flex' flexDirection='column' m={2}>
                            <Button
                                variant='contained'
                                fullWidth
                                onClick={() => {
                                    setOpenDeleteConfirmationModal(false);
                                    handleCloseEditDialog();
                                    navigate('/proposal_discussion');
                                    if (setShouldRefresh) {
                                        setShouldRefresh(true);
                                    }
                                }}
                            >
                                Go to Proposal Discussion
                            </Button>
                        </Box>
                    </Box>
                </Modal>

                <DeleteProposalModal
                    open={showProposalDeleteModal}
                    onClose={() => setShowProposalDeleteModal(false)}
                    handleDeleteProposal={handleDeleteProposal}
                />

                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1,
                    }}
                >
                    <CreateGA2 />
                </Box>
            </Box>
        </Dialog>
    );
};

export default EditProposalDialog;
