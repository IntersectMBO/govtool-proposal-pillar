import { useTheme } from '@emotion/react';
import {
    IconChatAlt,
    IconCheveronLeft,
    IconDotsVertical,
    IconLink,
    IconPencilAlt,
    IconReply,
    IconShare,
    IconSort,
    IconTrash,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import {
    Badge,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    TextField,
    Tooltip,
    Typography,
    alpha,
} from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CommentCard,
    BudgetDiscussionPoll,
    DeleteProposalModal,
    BudgetDiscussionInfoSegment,
    CreateBudgetDiscussionDialog,
} from '../../../components';
import { useAppContext } from '../../../context/context';
import {
    createComment,
    deleteBudgetDiscussion,
    getComments,
    getBudgetDiscussion,
    getBudgetDiscussionPoll,
} from '../../../lib/api';
import { formatIsoDate, openInNewTab } from '../../../lib/utils';
import ProposalOwnModal from '../../../components/ProposalOwnModal';
import BudgetDiscussionReviewVersions from '../../../components/BudgetDiscussionReviewVersions';

const SingleBudgetDiscussion = ({ id }) => {
    const MAX_COMMENT_LENGTH = 2500;
    const navigate = useNavigate();
    const openLink = (link) => openInNewTab(link);

    const { user, setLoading, setOpenUsernameModal, walletAPI } =
        useAppContext();

    const theme = useTheme();
    const [proposal, setProposal] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [commentsList, setCommentsList] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [reviewVersionsOpen, setReviewVersionsOpen] = useState(false);
    const [commentsPageCount, setCommentsPageCount] = useState(0);
    const [commentsCurrentPage, setCommentsCurrentPage] = useState(1);
    const [commentsSortType, setCommentsSortType] = useState('desc');
    const [proposalLink, setProposalLink] = useState('');
    const [disableShare, setDisableShare] = useState(false);
    const [ownProposalModal, setOwnProposalModal] = useState(false);
    const [activePoll, setActivePoll] = useState(null);
    const [showCreateBDDialog, setShowCreateBDDialog] = useState(false);

    const targetRef = useRef();
    const menuRef = useRef();

    useEffect(() => {
        let domain = new URL(window.location.href);
        let origin = domain.origin;
        setProposalLink(`${origin}/budget_discussion/`);
    }, [proposalLink]);

    const disableShareClick = () => {
        setDisableShare(true);
        setTimeout(() => {
            setDisableShare(false);
        }, 2000);
    };

    function copyToClipboard(value) {
        navigator.clipboard.writeText(value);
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = () => {
        setAnchorEl(menuRef?.current);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [shareAnchorEl, setShareAnchorEl] = useState(null);
    const openShare = Boolean(shareAnchorEl);
    const handleShareClick = (event) => {
        setShareAnchorEl(event.currentTarget);
    };

    const handleShareClose = () => {
        setShareAnchorEl(null);
    };

    const handleEditProposal = () => {
        setOpenEditDialog(true);
        setAnchorEl(null);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setAnchorEl(null);
    };

    const handleOpenDeleteModal = () => {
        setOpenDeleteModal(true);
        handleClose();
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
    };

    const handleOpenReviewVersions = () => setReviewVersionsOpen(true);
    const handleCloseReviewVersions = () => setReviewVersionsOpen(false);

    const handleDeleteProposal = async () => {
        setLoading(true);
        try {
            const response = await deleteBudgetDiscussion(proposal?.id);
            if (!response) return;

            handleCloseDeleteModal();
            navigate('/budget_discussion');
        } catch (error) {
            console.error('Failed to delete proposal:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProposal = async (id) => {
        setLoading(true);
        let query = `populate[0]=creator&populate[1]=bd_costing.preferred_currency&populate[2]=bd_proposal_detail.contract_type_name&populate[3]=bd_further_information.proposal_links&populate[4]=bd_psapb.type_name&populate[5]=bd_psapb.roadmap_name&populate[6]=bd_psapb.committee_name&populate[7]=bd_proposal_ownership.be_country`;
        try {
            const response = await getBudgetDiscussion({
                id: id,
                query: query,
            });
            if (!response) return;

            setProposal(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async (page = 1) => {
        setLoading(true);
        try {
            const query = `filters[$and][0][bd_proposal_id]=${id}&filters[$and][1][comment_parent_id][$null]=true&sort[createdAt]=${commentsSortType}&pagination[page]=${page}&pagination[pageSize]=25&populate[comments_reports][populate][reporter][fields][0]=username&populate[comments_reports][populate][maintainer][fields][0]=username`;
            const { comments, pgCount } = await getComments(query);
            if (!comments) return;
            setCommentsPageCount(pgCount);

            if (page > commentsCurrentPage) {
                setCommentsList((prev) => [...prev, ...comments]);
            } else {
                if (page === 1) {
                    setCommentsCurrentPage(1);
                }
                setCommentsList(comments);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateComment = async () => {
        setLoading(true);
        try {
            const newComment = await createComment({
                bd_proposal_id: id,
                comment_text: newCommentText,
            });

            if (!newComment) return;
            setNewCommentText('');
            fetchProposal(id);
            fetchComments(1);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            //  event.preventDefault();
        }
    };
    const handleBlur = (event) => {
        const cleanedValue = event.target.value
            .replace(/[^\S\n]+/g, ' ')
            .trim();
        setNewCommentText(cleanedValue);
    };
    const handleChange = (event) => {
        let value = event.target.value;

        if (value.startsWith(' ')) {
            value = value.trimStart();
        }

        // value = value.replace(/  +/g, ' ');

        if (value.length <= MAX_COMMENT_LENGTH) {
            setNewCommentText(value);
        }
    };

    const fetchActivePoll = async () => {
        try {
            const query = `filters[$and][0][bd_proposal_id][$eq]=${proposal?.id}&filters[$and][1][is_poll_active]=true&pagination[page]=1&pagination[pageSize]=1&sort[createdAt]=desc`;
            const { polls, pgCount, total } = await getBudgetDiscussionPoll({
                query: query,
            });
            if (!polls?.length === 0) return;
            setActivePoll(polls[0]);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!mounted) {
            setMounted(true);
        } else {
            fetchProposal(id);
            fetchComments(1);
        }
    }, [id, mounted]);

    useEffect(() => {
        if (mounted) {
            fetchComments(1);
        }
    }, [commentsSortType]);
    useEffect(() => {
        if (!proposal?.id) return;
        fetchActivePoll();
    }, [proposal]);

    return !proposal ? null : proposal?.attributes?.content?.attributes
          ?.is_draft ? null : (
        <>
            <Typography>
                {openEditDialog ? (
                    <CreateBudgetDiscussionDialog
                        open={openEditDialog}
                        onClose={() => setOpenEditDialog(false)}
                        current_bd_id={proposal.id}
                    />
                ) : (
                    <Box>
                        <Box mt={3}>
                            <Button
                                startIcon={
                                    <IconCheveronLeft
                                        width='18'
                                        height='18'
                                        fill={theme.palette.primary.main}
                                    />
                                }
                                onClick={() => navigate(`/budget_discussion`)}
                            >
                                Show all
                            </Button>
                        </Box>

                        <Box mt={4}>
                            <Card>
                                <CardContent>
                                    <Grid container>
                                        <Grid item xs={10}>
                                            <Typography
                                                variant='h4'
                                                component='h2'
                                                data-testid='title-content'
                                            >
                                                {
                                                    proposal?.attributes
                                                        ?.content?.attributes
                                                        ?.prop_name
                                                }
                                            </Typography>
                                            <Typography
                                                variant='body2'
                                                component={'h5'}
                                                sx={{
                                                    color: (theme) =>
                                                        theme?.palette?.text
                                                            ?.black,
                                                    mt: 1,
                                                }}
                                            >
                                                @
                                                {
                                                    proposal?.attributes
                                                        ?.creator?.data
                                                        ?.attributes
                                                        .govtool_username
                                                }
                                            </Typography>
                                        </Grid>

                                        {/* SHARE BUTTON */}
                                        <Grid
                                            item
                                            xs={2}
                                            display='flex'
                                            justifyContent='flex-end'
                                        >
                                            <Tooltip
                                                title={
                                                    <span
                                                        style={{
                                                            whiteSpace:
                                                                'pre-line',
                                                        }}
                                                    >
                                                        {`Share proposal\n\nClick to share this proposal on social media.`}
                                                    </span>
                                                }
                                            >
                                                <IconButton
                                                    id='share-button'
                                                    data-testid='share-button'
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                    }}
                                                    aria-controls={
                                                        openShare
                                                            ? 'share-menu'
                                                            : undefined
                                                    }
                                                    aria-haspopup='true'
                                                    aria-expanded={
                                                        openShare
                                                            ? 'true'
                                                            : undefined
                                                    }
                                                    onClick={handleShareClick}
                                                >
                                                    <IconShare
                                                        width='24'
                                                        height='24'
                                                        fill={
                                                            openShare
                                                                ? theme?.palette
                                                                      ?.primary
                                                                      ?.main
                                                                : theme?.palette
                                                                      ?.primary
                                                                      ?.icons
                                                                      ?.black
                                                        }
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                            <Menu
                                                id='share-menu'
                                                anchorEl={shareAnchorEl}
                                                open={openShare}
                                                onClose={handleShareClose}
                                                MenuListProps={{
                                                    'aria-labelledby':
                                                        'share-button',
                                                    sx: {
                                                        width: '155px',
                                                        height: '135px',
                                                        maxWidth: '155px',
                                                        maxHeight: '135px',
                                                        py: 1.5,
                                                    },
                                                }}
                                                slotProps={{
                                                    paper: {
                                                        elevation: 4,
                                                        sx: {
                                                            overflow: 'visible',
                                                            mt: 1,
                                                            width: '155px',
                                                            height: '135px',
                                                            maxWidth: '155px',
                                                            maxHeight: '135px',
                                                        },
                                                    },
                                                }}
                                                transformOrigin={{
                                                    horizontal: 'right',
                                                    vertical: 'top',
                                                }}
                                                anchorOrigin={{
                                                    horizontal: 'right',
                                                    vertical: 'bottom',
                                                }}
                                            >
                                                <Stack
                                                    direction={'column'}
                                                    spacing={2}
                                                    px={3}
                                                    gap={2}
                                                >
                                                    <Typography
                                                        variant='h6'
                                                        component={'p'}
                                                    >
                                                        Share
                                                    </Typography>
                                                    <Stack
                                                        direction={'column'}
                                                        alignItems={'center'}
                                                        sx={{
                                                            marginTop:
                                                                '0 !important',
                                                        }}
                                                    >
                                                        <IconButton
                                                            onClick={() => {
                                                                copyToClipboard(
                                                                    `${proposalLink}${id}`
                                                                ),
                                                                    disableShareClick();
                                                            }}
                                                            color='primary'
                                                            disabled={
                                                                disableShare
                                                            }
                                                            data-testid='copy-link'
                                                        >
                                                            <IconLink
                                                                fill={
                                                                    !disableShare
                                                                        ? theme
                                                                              ?.palette
                                                                              ?.primary
                                                                              ?.main
                                                                        : theme
                                                                              ?.palette
                                                                              ?.primary
                                                                              ?.icons
                                                                              ?.grey
                                                                }
                                                                height={24}
                                                                width={24}
                                                            />
                                                        </IconButton>
                                                        <Typography
                                                            variant='caption'
                                                            component={'p'}
                                                            sx={{
                                                                color: (
                                                                    theme
                                                                ) =>
                                                                    theme
                                                                        .palette
                                                                        .text
                                                                        .darkPurple,
                                                            }}
                                                            data-testid='copy-link-text'
                                                        >
                                                            {disableShare
                                                                ? 'Link copied'
                                                                : 'Click to copy link'}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </Menu>

                                            {user &&
                                                user?.user?.id?.toString() ===
                                                    proposal?.attributes?.creator?.data?.id?.toString() && (
                                                    <Box
                                                        display='flex'
                                                        justifyContent='flex-end'
                                                    >
                                                        <IconButton
                                                            id='menu-button'
                                                            sx={{
                                                                width: 40,
                                                                height: 40,
                                                            }}
                                                            aria-controls={
                                                                open
                                                                    ? 'proposal-menu'
                                                                    : undefined
                                                            }
                                                            aria-haspopup='true'
                                                            aria-expanded={
                                                                open
                                                                    ? 'true'
                                                                    : undefined
                                                            }
                                                            ref={menuRef}
                                                            onClick={() => {
                                                                handleClick();
                                                            }}
                                                            data-testid='menu-button'
                                                        >
                                                            <IconDotsVertical
                                                                width='24'
                                                                height='24'
                                                                fill={
                                                                    open
                                                                        ? theme
                                                                              ?.palette
                                                                              ?.primary
                                                                              ?.main
                                                                        : theme
                                                                              ?.palette
                                                                              ?.primary
                                                                              ?.icons
                                                                              ?.black
                                                                }
                                                            />
                                                        </IconButton>
                                                        <Menu
                                                            id='proposal-menu'
                                                            anchorEl={anchorEl}
                                                            open={open}
                                                            onClose={
                                                                handleClose
                                                            }
                                                            MenuListProps={{
                                                                'aria-labelledby':
                                                                    'menu-button',
                                                            }}
                                                            slotProps={{
                                                                paper: {
                                                                    elevation: 4,
                                                                    sx: {
                                                                        overflow:
                                                                            'visible',
                                                                        mt: 1,
                                                                    },
                                                                },
                                                            }}
                                                            transformOrigin={{
                                                                horizontal:
                                                                    'right',
                                                                vertical: 'top',
                                                            }}
                                                            anchorOrigin={{
                                                                horizontal:
                                                                    'right',
                                                                vertical:
                                                                    'bottom',
                                                            }}
                                                            data-testid='proposal-menu'
                                                        >
                                                            <MenuItem
                                                                onClick={() =>
                                                                    handleEditProposal()
                                                                }
                                                                data-testid='edit-proposal'
                                                            >
                                                                <Stack
                                                                    direction={
                                                                        'row'
                                                                    }
                                                                    spacing={2}
                                                                    alignItems={
                                                                        'center'
                                                                    }
                                                                >
                                                                    <IconPencilAlt
                                                                        color={
                                                                            theme
                                                                                .palette
                                                                                .primary
                                                                                .icons
                                                                                .black
                                                                        }
                                                                        height={
                                                                            24
                                                                        }
                                                                        width={
                                                                            24
                                                                        }
                                                                    />
                                                                    <Typography variant='body1'>
                                                                        Edit
                                                                        Proposal
                                                                    </Typography>
                                                                </Stack>
                                                            </MenuItem>
                                                            <MenuItem
                                                                onClick={() =>
                                                                    handleOpenDeleteModal()
                                                                }
                                                                data-testid='delete-proposal'
                                                            >
                                                                <Stack
                                                                    direction={
                                                                        'row'
                                                                    }
                                                                    spacing={2}
                                                                    alignItems={
                                                                        'center'
                                                                    }
                                                                >
                                                                    <IconTrash
                                                                        color={
                                                                            theme
                                                                                .palette
                                                                                .primary
                                                                                .icons
                                                                                .black
                                                                        }
                                                                        height={
                                                                            24
                                                                        }
                                                                        width={
                                                                            24
                                                                        }
                                                                    />
                                                                    <Typography variant='body1'>
                                                                        Delete
                                                                        Proposal
                                                                    </Typography>
                                                                </Stack>
                                                            </MenuItem>
                                                        </Menu>
                                                    </Box>
                                                )}
                                        </Grid>
                                    </Grid>

                                    <Box mt={2}>
                                        <Typography
                                            variant='caption'
                                            sx={{
                                                color: (theme) =>
                                                    theme?.palette?.text?.grey,
                                            }}
                                        >
                                            Budget category
                                        </Typography>
                                        <Typography
                                            variant='body2'
                                            data-testid='governance-action-type-content'
                                        >
                                            {
                                                proposal?.attributes?.bd_psapb
                                                    ?.data?.attributes
                                                    ?.type_name?.data
                                                    ?.attributes?.type_name
                                            }
                                        </Typography>
                                    </Box>

                                    <Box
                                        mt={2}
                                        display='flex'
                                        alignItems='center'
                                        justifyContent='space-between'
                                    >
                                        <Typography
                                            variant='caption'
                                            sx={{
                                                color: (theme) =>
                                                    theme?.palette?.text?.grey,
                                            }}
                                        >
                                            {`Last Edit: ${formatIsoDate(
                                                proposal?.attributes?.createdAt
                                            )}`}
                                        </Typography>
                                        {user?.user?.id?.toString() ===
                                            proposal?.attributes?.creator?.data?.id?.toString() && (
                                            <Box>
                                                <Button
                                                    variant='outlined'
                                                    startIcon={
                                                        <IconLink
                                                            fill={
                                                                theme.palette
                                                                    .primary
                                                                    .main
                                                            }
                                                            width='18'
                                                            height='18'
                                                        />
                                                    }
                                                    onClick={() =>
                                                        handleOpenReviewVersions()
                                                    }
                                                    data-testid='review-version'
                                                >
                                                    Review Versions
                                                </Button>

                                                <BudgetDiscussionReviewVersions
                                                    open={reviewVersionsOpen}
                                                    onClose={
                                                        handleCloseReviewVersions
                                                    }
                                                    id={id}
                                                />
                                            </Box>
                                        )}
                                    </Box>

                                    <Box
                                        sx={{
                                            mt: 4,
                                        }}
                                    >
                                        <Typography
                                            variant='h5'
                                            sx={{
                                                mb: 2,
                                            }}
                                        >
                                            Proposal Ownership
                                        </Typography>

                                        <BudgetDiscussionInfoSegment
                                            question={
                                                'Proposal Public Champion: Who would you like to be the public proposal champion?'
                                            }
                                            answer={
                                                proposal?.attributes
                                                    ?.bd_proposal_ownership
                                                    ?.data?.attributes
                                                    ?.proposal_public_champion
                                            }
                                        />

                                        <BudgetDiscussionInfoSegment
                                            question={
                                                'What social handles would you like to be used? E.g. Github, X'
                                            }
                                            answer={
                                                proposal?.attributes
                                                    ?.bd_proposal_ownership
                                                    ?.data?.attributes
                                                    ?.social_handles
                                            }
                                        />
                                    </Box>

                                    <Box
                                        sx={{
                                            mt: 4,
                                        }}
                                    >
                                        <Typography
                                            variant='h5'
                                            sx={{
                                                mb: 2,
                                            }}
                                        >
                                            Problem Statements and Proposal
                                            Benefits
                                        </Typography>

                                        <BudgetDiscussionInfoSegment
                                            question={'Problem Statement'}
                                            answer={
                                                proposal?.attributes?.bd_psapb
                                                    ?.data?.attributes
                                                    ?.problem_statement
                                            }
                                        />

                                        <BudgetDiscussionInfoSegment
                                            question={'Proposal Benefit'}
                                            answer={
                                                proposal?.attributes?.bd_psapb
                                                    ?.data?.attributes
                                                    ?.proposal_benefit
                                            }
                                        />

                                        <BudgetDiscussionInfoSegment
                                            question={
                                                'Does this proposal align to the Product Roadmap and Roadmap Goals?'
                                            }
                                            answer={
                                                proposal?.attributes?.bd_psapb
                                                    ?.data?.attributes
                                                    ?.roadmap_name?.data
                                                    ?.attributes?.roadmap_name
                                            }
                                        />

                                        <BudgetDiscussionInfoSegment
                                            question={
                                                'Does your proposal align to any of the budget categories?'
                                            }
                                            answer={
                                                proposal?.attributes?.bd_psapb
                                                    ?.data?.attributes
                                                    ?.type_name?.data
                                                    ?.attributes?.type_name
                                            }
                                        />

                                        <BudgetDiscussionInfoSegment
                                            question={
                                                'Does your proposal align with any of the Intersect Committees?'
                                            }
                                            answer={
                                                proposal?.attributes?.bd_psapb
                                                    ?.data?.attributes
                                                    ?.committee_name?.data
                                                    ?.attributes?.committee_name
                                            }
                                        />

                                        <BudgetDiscussionInfoSegment
                                            question={
                                                'If possible provide evidence of wider community endorsement for this proposal?'
                                            }
                                            answer={
                                                proposal?.attributes?.bd_psapb
                                                    ?.attributes
                                                    ?.supplementary_endorsement
                                            }
                                        />
                                    </Box>

                                    <Box
                                        sx={{
                                            mt: 4,
                                        }}
                                    >
                                        <Typography
                                            variant='h5'
                                            sx={{
                                                mb: 2,
                                            }}
                                        >
                                            Proposal Details
                                        </Typography>

                                        <BudgetDiscussionInfoSegment
                                            question={
                                                'What is your proposed name to be used to reference this proposal publicly?'
                                            }
                                            answer={
                                                proposal?.attributes
                                                    ?.bd_proposal_detail?.data
                                                    ?.attributes?.proposal_name
                                            }
                                        />

                                        <BudgetDiscussionInfoSegment
                                            question={'Proposal Description'}
                                            answer={
                                                proposal?.attributes
                                                    ?.bd_proposal_detail?.data
                                                    ?.attributes
                                                    ?.proposal_description
                                            }
                                        />

                                        <BudgetDiscussionInfoSegment
                                            question={
                                                'Please list any key dependencies (if any) for this proposal?'
                                            }
                                            answer={
                                                proposal?.attributes
                                                    ?.bd_proposal_detail?.data
                                                    ?.attributes
                                                    ?.key_dependencies
                                            }
                                        />

                                        <BudgetDiscussionInfoSegment
                                            question={
                                                'Key Proposal Deliverable(s) and Definition of Done: What tangible milestones or outcomes are to be delivered and what will the community ultimately receive?'
                                            }
                                            answer={
                                                proposal?.attributes
                                                    ?.bd_proposal_detail?.data
                                                    ?.attributes
                                                    ?.key_proposal_deliverables
                                            }
                                        />

                                        <BudgetDiscussionInfoSegment
                                            question={
                                                'Resourcing & Duration Estimates: Please provide estimates of team size and duration to achieve the Key Proposal Deliverables outlined above.'
                                            }
                                            answer={
                                                proposal?.attributes
                                                    ?.bd_proposal_detail?.data
                                                    ?.attributes
                                                    ?.resourcing_duration_estimates
                                            }
                                        />

                                        <BudgetDiscussionInfoSegment
                                            question={
                                                'Experience: Please provide previous experience relevant to complete this project.'
                                            }
                                            answer={
                                                proposal?.attributes
                                                    ?.bd_proposal_detail?.data
                                                    ?.attributes?.experience
                                            }
                                        />

                                        <BudgetDiscussionInfoSegment
                                            question={
                                                'Contracting: Please describe how you expect to be contracted.'
                                            }
                                            answer={
                                                proposal?.attributes
                                                    ?.bd_proposal_detail?.data
                                                    ?.attributes
                                                    ?.contract_type_name?.data
                                                    ?.attributes
                                                    ?.contract_type_name
                                            }
                                        />
                                    </Box>

                                    <Box
                                        sx={{
                                            mt: 4,
                                        }}
                                    >
                                        <Typography
                                            variant='h5'
                                            sx={{
                                                mb: 2,
                                            }}
                                        >
                                            Costing
                                        </Typography>

                                        <BudgetDiscussionInfoSegment
                                            question={'ADA Amount'}
                                            answer={
                                                proposal?.attributes?.bd_costing
                                                    ?.data?.attributes
                                                    ?.ada_amount
                                            }
                                        />

                                        <BudgetDiscussionInfoSegment
                                            question={
                                                'ADA to USD Conversion Rate'
                                            }
                                            answer={
                                                proposal?.attributes?.bd_costing
                                                    ?.data?.attributes
                                                    ?.usd_to_ada_conversion_rate
                                            }
                                        />

                                        <BudgetDiscussionInfoSegment
                                            question={'Preferred currency'}
                                            answer={
                                                proposal?.attributes?.bd_costing
                                                    ?.data?.attributes
                                                    ?.preferred_currency?.data
                                                    ?.attributes?.currency_name
                                            }
                                        />

                                        <BudgetDiscussionInfoSegment
                                            question={
                                                'Amount in preferred currency'
                                            }
                                            answer={
                                                proposal?.attributes?.bd_costing
                                                    ?.data?.attributes
                                                    ?.amount_in_preferred_currency
                                            }
                                        />

                                        <BudgetDiscussionInfoSegment
                                            question={'Cost breakdown'}
                                            answer={
                                                proposal?.attributes?.bd_costing
                                                    ?.data?.attributes
                                                    ?.cost_breakdown
                                            }
                                        />
                                    </Box>

                                    <Box
                                        sx={{
                                            mt: 4,
                                        }}
                                    >
                                        <Typography
                                            variant='h5'
                                            sx={{
                                                mb: 2,
                                            }}
                                        >
                                            Further information
                                        </Typography>
                                        {proposal?.attributes
                                            ?.bd_further_information?.data
                                            ?.attributes?.proposal_links
                                            ?.length > 0 && (
                                            <Box mt={4}>
                                                <Typography
                                                    variant='caption'
                                                    sx={{
                                                        color: (theme) =>
                                                            theme?.palette?.text
                                                                ?.grey,
                                                    }}
                                                >
                                                    Supporting links
                                                </Typography>

                                                <Box>
                                                    {proposal?.attributes?.bd_further_information?.data?.attributes?.proposal_links?.map(
                                                        (item, index) => (
                                                            <Button
                                                                key={index}
                                                                sx={{
                                                                    marginRight: 2,
                                                                    marginBottom: 2,
                                                                }}
                                                                startIcon={
                                                                    <IconLink
                                                                        width='18'
                                                                        height='18'
                                                                        fill={
                                                                            theme
                                                                                .palette
                                                                                .primary
                                                                                .main
                                                                        }
                                                                    />
                                                                }
                                                                onClick={() =>
                                                                    openLink(
                                                                        item?.prop_link
                                                                    )
                                                                }
                                                                data-testid={
                                                                    'link-${index}-text-content'
                                                                }
                                                            >
                                                                <Typography
                                                                    component={
                                                                        'p'
                                                                    }
                                                                    variant='body2'
                                                                    style={{
                                                                        margin: 0,
                                                                    }}
                                                                    data-testid={`link-${index}-text-content`}
                                                                >
                                                                    {
                                                                        item?.prop_link_text
                                                                    }
                                                                </Typography>
                                                            </Button>
                                                        )
                                                    )}
                                                </Box>
                                            </Box>
                                        )}
                                    </Box>

                                    <Box
                                        sx={{
                                            mt: 4,
                                        }}
                                    >
                                        <Typography
                                            variant='h5'
                                            sx={{
                                                mb: 2,
                                            }}
                                        >
                                            Administration and Auditing
                                        </Typography>

                                        <BudgetDiscussionInfoSegment
                                            question={
                                                'Would you like Intersect to be your named Administrator, including acting as the auditor, as per the Cardano Constitution?*'
                                            }
                                            answer={
                                                proposal?.attributes
                                                    ?.intersect_named_administrator
                                                    ? 'Yes'
                                                    : 'No'
                                            }
                                        />
                                    </Box>
                                    <Box
                                        mt={4}
                                        display={'flex'}
                                        flexDirection={'row'}
                                        justifyContent={'space-between'}
                                    >
                                        <Tooltip title='Total comments number'>
                                            <span>
                                                <Box
                                                    display={'flex'}
                                                    alignItems={'center'}
                                                >
                                                    <IconButton disabled>
                                                        <Badge
                                                            slotProps={{
                                                                badge: {
                                                                    'data-testid':
                                                                        'comment-count',
                                                                },
                                                            }}
                                                            badgeContent={
                                                                proposal
                                                                    ?.attributes
                                                                    ?.prop_comments_number ||
                                                                0
                                                            }
                                                            aria-label='proposal comments'
                                                            showZero
                                                            sx={{
                                                                transform:
                                                                    'translate(30px, -20px)',
                                                                '& .MuiBadge-badge':
                                                                    {
                                                                        color: 'white',
                                                                        backgroundColor:
                                                                            (
                                                                                theme
                                                                            ) =>
                                                                                theme
                                                                                    .palette
                                                                                    .badgeColors
                                                                                    .primary,
                                                                    },
                                                            }}
                                                        ></Badge>
                                                        <IconChatAlt />
                                                    </IconButton>
                                                </Box>
                                            </span>
                                        </Tooltip>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>

                        <Box
                            mt={4}
                            display='flex'
                            alignItems='center'
                            justifyContent='space-between'
                        >
                            <Typography variant='h4' component='h3'>
                                Comments
                            </Typography>

                            <IconButton
                                sx={{
                                    width: 40,
                                    height: 40,
                                }}
                                onClick={() =>
                                    proposal?.attributes
                                        ?.prop_comments_number === 0
                                        ? null
                                        : setCommentsSortType((prev) =>
                                              prev === 'desc' ? 'asc' : 'desc'
                                          )
                                }
                                data-testid='sort-comments'
                            >
                                <IconSort
                                    width='24'
                                    height='24'
                                    fill={theme.palette.primary.main}
                                />
                            </IconButton>
                        </Box>

                        {activePoll && (
                            <Box mt={4}>
                                <BudgetDiscussionPoll
                                    proposalUserId={
                                        proposal?.attributes?.creator?.data?.id
                                    }
                                    proposalAuthorUsername={
                                        proposal?.attributes
                                            ?.user_govtool_username
                                    }
                                    poll={activePoll}
                                    fetchActivePoll={fetchActivePoll}
                                />
                            </Box>
                        )}

                        {proposal?.attributes?.content?.attributes
                            ?.prop_submitted ? null : (
                            <Box mt={4}>
                                <Card>
                                    <CardContent>
                                        <Typography variant='subtitle1'>
                                            Submit a comment
                                        </Typography>

                                        <TextField
                                            fullWidth
                                            margin='normal'
                                            variant='outlined'
                                            multiline={true}
                                            maxRows={5}
                                            helperText={
                                                <Typography
                                                    variant='caption'
                                                    sx={{
                                                        float: 'right',
                                                        mr: 2,
                                                        color: (theme) =>
                                                            newCommentText?.length ===
                                                                MAX_COMMENT_LENGTH &&
                                                            theme?.palette
                                                                ?.error?.main,
                                                    }}
                                                >
                                                    {`${
                                                        newCommentText?.length ||
                                                        0
                                                    }/${MAX_COMMENT_LENGTH}`}
                                                </Typography>
                                            }
                                            value={newCommentText || ''}
                                            onChange={(e) => handleChange(e)}
                                            inputProps={{
                                                maxLength: MAX_COMMENT_LENGTH,
                                                onKeyDown: handleKeyDown,
                                                onBlur: handleBlur,
                                                spellCheck: 'false',
                                                autoCorrect: 'off',
                                                autoCapitalize: 'none',
                                                autoComplete: 'off',
                                                'data-testid': 'comment-input',
                                            }}
                                        />

                                        <Box
                                            mt={2}
                                            display='flex'
                                            justifyContent={'flex-end'}
                                            flexDirection={{
                                                xs: 'column',
                                                sm: 'row',
                                            }}
                                            gap={2}
                                            ref={targetRef}
                                        >
                                            <Button
                                                variant='contained'
                                                onClick={() =>
                                                    user?.user?.govtool_username
                                                        ? handleCreateComment()
                                                        : setOpenUsernameModal({
                                                              open: true,
                                                              callBackFn:
                                                                  () => {},
                                                          })
                                                }
                                                disabled={
                                                    !newCommentText ||
                                                    !walletAPI?.address
                                                }
                                                endIcon={
                                                    <IconReply
                                                        height={18}
                                                        width={18}
                                                        fill={
                                                            !newCommentText ||
                                                            !walletAPI?.address
                                                                ? 'rgba(0,0,0, 0.26)'
                                                                : 'white'
                                                        }
                                                    />
                                                }
                                                data-testid='comment-button'
                                            >
                                                Comment
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                        )}
                        {proposal?.attributes?.prop_comments_number === 0 ? (
                            <Card
                                variant='outlined'
                                sx={{
                                    backgroundColor: alpha('#FFFFFF', 0.3),
                                    my: 3,
                                }}
                            >
                                <CardContent>
                                    <Stack
                                        display={'flex'}
                                        direction={'column'}
                                        alignItems={'center'}
                                        justifyContent={'center'}
                                        gap={1}
                                    >
                                        <Typography
                                            variant='h6'
                                            color='text.black'
                                            fontWeight={600}
                                        >
                                            No Comments yet
                                        </Typography>
                                        <Typography
                                            variant='body1'
                                            color='text.black'
                                        >
                                            Be the first to share your thoughts
                                            on this proposal.
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        ) : null}

                        {commentsList?.map((comment, index) => (
                            <Box mt={4} key={index}>
                                <CommentCard
                                    comment={comment}
                                    proposal={proposal}
                                    fetchComments={fetchComments}
                                />
                            </Box>
                        ))}
                        {commentsCurrentPage < commentsPageCount && (
                            <Box
                                marginY={2}
                                display={'flex'}
                                justifyContent={'flex-end'}
                            >
                                <Button
                                    onClick={() => {
                                        fetchComments(commentsCurrentPage + 1);
                                        setCommentsCurrentPage(
                                            (prev) => prev + 1
                                        );
                                    }}
                                >
                                    Load more comments
                                </Button>
                            </Box>
                        )}

                        <DeleteProposalModal
                            open={openDeleteModal}
                            onClose={handleCloseDeleteModal}
                            handleDeleteProposal={handleDeleteProposal}
                        />

                        <ProposalOwnModal
                            open={ownProposalModal}
                            onClose={() => setOwnProposalModal(false)}
                        />
                    </Box>
                )}
            </Typography>
        </>
    );
};

export default SingleBudgetDiscussion;
