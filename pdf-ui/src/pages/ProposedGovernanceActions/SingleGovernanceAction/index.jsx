import { useTheme } from '@emotion/react';
import {
    IconChatAlt,
    IconCheveronLeft,
    IconDocumentSearch,
    IconDotsVertical,
    IconInformationCircle,
    IconLink,
    IconPencilAlt,
    IconReply,
    IconShare,
    IconSort,
    IconThumbDown,
    IconThumbUp,
    IconTrash,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import {
    Badge,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Modal,
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
    EditProposalDialog,
    Poll,
    ReviewVersions,
    ProposalSubmissionDialog,
    DeleteProposalModal,
} from '../../../components';
import { useAppContext } from '../../../context/context';
import {
    createComment,
    createProposalLikeOrDislike,
    deleteProposal,
    getComments,
    getSingleProposal,
    getUserProposalVote,
    updateProposalLikesOrDislikes,
    createPoll,
    getPolls,
} from '../../../lib/api';
import { formatIsoDate, openInNewTab } from '../../../lib/utils';
import ProposalOwnModal from '../../../components/ProposalOwnModal';
import ReactMarkdown from 'react-markdown';
import { loginUserToApp } from '../../../lib/helpers';

const SingleGovernanceAction = ({ id }) => {
    const MAX_COMMENT_LENGTH = 2500;
    const navigate = useNavigate();
    const openLink = (link) => openInNewTab(link);

    const {
        user,
        setLoading,
        setOpenUsernameModal,
        setUser,
        walletAPI,
        clearStates,
    } = useAppContext();

    const theme = useTheme();
    const [proposal, setProposal] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [commentsList, setCommentsList] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');
    const [userProposalVote, setUserProposalVote] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [reviewVersionsOpen, setReviewVersionsOpen] = useState(false);
    const [commentsPageCount, setCommentsPageCount] = useState(0);
    const [commentsCurrentPage, setCommentsCurrentPage] = useState(1);
    const [commentsSortType, setCommentsSortType] = useState('desc');
    const [proposalLink, setProposalLink] = useState('');
    const [disableShare, setDisableShare] = useState(false);
    const [openGASubmissionDialog, setOpenGASubmissionDialog] = useState(false);
    const [ownProposalModal, setOwnProposalModal] = useState(false);
    const [unactivePollList, setUnactivePollList] = useState([]);
    const [activePoll, setActivePoll] = useState(null);

    const targetRef = useRef();
    const menuRef = useRef();

    const scrollToComponent = () => {
        if (targetRef.current) {
            const top =
                targetRef.current.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top,
                behavior: 'smooth',
            });
        }
    };

    useEffect(() => {
        let domain = new URL(window.location.href);
        let origin = domain.origin;
        setProposalLink(`${origin}/proposal_discussion/`);
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
    // Read More / Show Less logic
    const [showFullText, setShowFullText] = useState(false);
    const [truncatedText, setTruncatedText] = useState(''); 
    const [totalCharLength, setTotalCharLength] = useState(0);
    const [AbstractMarkdownText, setAbstractMarkdownText] = useState('');
    const maxLength = 500;
    useEffect(() => {
        if (maxLength && AbstractMarkdownText.length > maxLength) {
            setTruncatedText(AbstractMarkdownText.slice(0, maxLength) + '...');
        } else {
            setTruncatedText(AbstractMarkdownText);
        }
    }, [AbstractMarkdownText, maxLength]);
    const handleShareClose = () => {
        setShareAnchorEl(null);
    };

    const handleEditProposal = () => {
        setOpenEditDialog(true);
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
            const response = await deleteProposal(proposal?.id);
            if (!response) return;

            handleCloseDeleteModal();
            navigate('/proposal_discussion');
        } catch (error) {
            console.error('Failed to delete proposal:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProposal = async (id) => {
        setLoading(true);
        try {
            const response = await getSingleProposal(id);
            if (!response) return;

            if (response?.attributes?.content?.attributes?.is_draft) {
                return navigate('/proposal_discussion');
            }
            setProposal(response);

            if(response?.attributes?.content?.attributes?.prop_abstract.length + response?.attributes?.content?.attributes?.prop_motivation.length + response?.attributes?.content?.attributes?.prop_rationale.length > 500)
            {
                setTotalCharLength(response?.attributes?.content?.attributes?.prop_abstract.length + response?.attributes?.content?.attributes?.prop_motivation.length + response?.attributes?.content?.attributes?.prop_rationale.length);    
                setAbstractMarkdownText(response?.attributes?.content?.attributes?.prop_abstract);
            }
        } catch (error) {
            if (
                error?.response?.data?.error?.details ===
                    'Proposal not found' ||
                error?.response?.data?.error?.details ===
                    'You can not access draft proposal details.'
            ) {
                return navigate('/proposal_discussion');
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProposalVote = async (id) => {
        setLoading(true);
        try {
            const response = await getUserProposalVote({ proposalID: id });
            setUserProposalVote(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async (page = 1) => {
        setLoading(true);
        try {
            const query = `filters[$and][0][proposal_id]=${id}&filters[$and][1][comment_parent_id][$null]=true&sort[createdAt]=${commentsSortType}&pagination[page]=${page}&pagination[pageSize]=25`;
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
                proposal_id: id,
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

    const updateLikesOrDislikes = async ({ like = true, loggedInUser }) => {
        setLoading(true);
        if (
            loggedInUser?.id?.toString() ===
            proposal?.attributes?.user_id?.toString()
        ) {
            return setOwnProposalModal(true);
        }

        try {
            let data = userProposalVote
                ? {
                      vote_result: !userProposalVote?.attributes?.vote_result,
                  }
                : {
                      proposal_id: id,
                      vote_result: like,
                  };

            const response = userProposalVote
                ? await updateProposalLikesOrDislikes({
                      proposalVoteID: userProposalVote?.id,
                      updateData: data,
                  })
                : await createProposalLikeOrDislike({ createData: data });

            if (!response) return;

            setUserProposalVote(response);
            fetchProposal(id);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };

    const handleChange = (event) => {
        let value = event.target.value;

        if (value.startsWith(' ')) {
            value = value.trimStart();
        }

        value = value.replace(/  +/g, ' ');

        if (value.length <= MAX_COMMENT_LENGTH) {
            setNewCommentText(value);
        }
    };

    const addPoll = async () => {
        try {
            const response = await createPoll({
                pollData: {
                    data: {
                        proposal_id: proposal?.id?.toString(),
                        poll_start_dt: new Date(),
                        is_poll_active: true,
                    },
                },
            });
            if (!response) return;
            fetchActivePoll();
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUnactivePolls = async () => {
        try {
            const query = `filters[$and][0][proposal_id][$eq]=${proposal?.id}&filters[$and][1][is_poll_active]=false&pagination[page]=1&pagination[pageSize]=1&sort[createdAt]=desc`;
            const { polls, pgCount, total } = await getPolls({ query: query });
            if (!polls) return;
            setUnactivePollList(polls);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchActivePoll = async () => {
        try {
            const query = `filters[$and][0][proposal_id][$eq]=${proposal?.id}&filters[$and][1][is_poll_active]=true&pagination[page]=1&pagination[pageSize]=1&sort[createdAt]=desc`;
            const { polls, pgCount, total } = await getPolls({
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
        if (proposal && mounted) {
            fetchActivePoll();
            fetchUnactivePolls();
        }
    }, [proposal]);

    useEffect(() => {
        if (mounted && user) {
            if (user) fetchProposalVote(id);
        }
    }, [user, mounted, id]);

    useEffect(() => {
        if (mounted) {
            fetchComments(1);
        }
    }, [commentsSortType]);

    return !proposal ? null : proposal?.attributes?.content?.attributes
          ?.is_draft ? null : (
        <>
        <Typography>
            {openEditDialog ? (
                <EditProposalDialog
                    proposal={proposal}
                    openEditDialog={openEditDialog}
                    handleCloseEditDialog={handleCloseEditDialog}
                    setMounted={setMounted}
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
                            onClick={() => navigate(`/proposal_discussion`)}
                        >
                            Show all
                        </Button>
                    </Box>

                    <Box mt={4}>
                        <Card
                            variant='outlined'
                            sx={{
                                backgroundColor: alpha('#FFFFFF', 0.3),
                            }}
                        >
                            <CardHeader
                                sx={{
                                    pt: 1,
                                    pb: 1,
                                    backgroundColor: alpha('#F2F4F8', 0.7),
                                }}
                                title={
                                    <Box
                                        display={'flex'}
                                        justifyContent={'center'}
                                        alignItems={'center'}
                                        flexDirection={'row'}
                                    >
                                        <Typography
                                            variant='caption'
                                            component='p'
                                        >
                                            {proposal?.attributes?.content
                                                ?.attributes?.prop_submitted
                                                ? `Submitted for vote on: ${formatIsoDate(proposal?.attributes?.content?.attributes?.prop_submission_date)}`
                                                : `Proposed on: ${formatIsoDate(
                                                      proposal?.attributes
                                                          ?.createdAt
                                                  )}`}
                                        </Typography>
                                        <Tooltip
                                            title={
                                                proposal?.attributes?.content
                                                    ?.attributes
                                                    ?.prop_submitted ? (
                                                    <span
                                                        style={{
                                                            whiteSpace:
                                                                'pre-line',
                                                        }}
                                                    >
                                                        {`Proposal Date\n\nThe date
                                                        when Proposal was
                                                        submitted as Governance
                                                        Action.`}
                                                    </span>
                                                ) : (
                                                    'Proposal Date'
                                                )
                                            }
                                        >
                                            <Box>
                                                <IconInformationCircle
                                                    width={16}
                                                    height={16}
                                                    fill={
                                                        theme?.palette?.primary
                                                            ?.icons?.grey
                                                    }
                                                />
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                }
                            ></CardHeader>
                            {
                                <CardContent>
                                    <Box
                                        display='flex'
                                        alignItems='center'
                                        justifyContent='space-between'
                                        flexDirection={{
                                            xs: 'column',
                                            md: 'row',
                                        }}
                                        gap={1}
                                    >
                                        <Box
                                            textAlign={{
                                                xs: 'center',
                                                md: 'left',
                                            }}
                                        >
                                            {proposal?.attributes?.content
                                                ?.attributes?.prop_submitted ? (
                                                <Typography
                                                    variant='caption'
                                                    sx={{ textWrap: 'balance' }}
                                                >
                                                    This proposal has been
                                                    submitted on-chain as a
                                                    Governance Action to get
                                                    voted on.
                                                </Typography>
                                            ) : (
                                                <>
                                                    <Typography variant='body2'>
                                                        Your Action:
                                                    </Typography>
                                                    <Typography
                                                        variant='caption'
                                                        sx={{
                                                            textWrap: 'balance',
                                                        }}
                                                    >
                                                        {user &&
                                                        user?.user?.id?.toString() ===
                                                            proposal?.attributes?.user_id?.toString()
                                                            ? `If your are ready, submit this proposal as a governance action to get voted on.`
                                                            : `Help make the proposal better by commenting`}
                                                    </Typography>
                                                </>
                                            )}
                                        </Box>

                                        <Box>
                                            {proposal?.attributes?.content
                                                ?.attributes?.prop_submitted ? (
                                                <Button
                                                    variant='outlined'
                                                    data-testid='review-and-vote-button'
                                                    onClick={() =>
                                                        navigate(
                                                            `/connected/governance_actions/${proposal?.attributes?.content?.attributes?.prop_submission_tx_hash}#0`
                                                        )
                                                    }
                                                    endIcon={
                                                        <IconDocumentSearch
                                                            width={18}
                                                            height={18}
                                                            fill={
                                                                theme.palette
                                                                    .primary
                                                                    .main
                                                            }
                                                        />
                                                    }
                                                    sx={{
                                                        width: 'max-content',
                                                    }}
                                                >
                                                    Review and Vote
                                                </Button>
                                            ) : user &&
                                              user?.user?.id?.toString() ===
                                                  proposal?.attributes?.user_id?.toString() ? (
                                                <Button
                                                    variant='outlined'
                                                    data-testid='submit-as-GA-button'
                                                    sx={{
                                                        width: 'max-content',
                                                    }}
                                                    onClick={async () =>
                                                        await loginUserToApp({
                                                            wallet: walletAPI,
                                                            setUser: setUser,
                                                            setOpenUsernameModal:
                                                                setOpenUsernameModal,
                                                            callBackFn: () =>
                                                                setOpenGASubmissionDialog(
                                                                    true
                                                                ),
                                                            clearStates:
                                                                clearStates,
                                                        })
                                                    }
                                                >
                                                    Submit as Governance Action
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant='outlined'
                                                    data-testid='proposal-details-header-comment-button'
                                                    onClick={() =>
                                                        scrollToComponent()
                                                    }
                                                    sx={{
                                                        width: 'max-content',
                                                    }}
                                                >
                                                    Comment
                                                </Button>
                                            )}
                                        </Box>
                                    </Box>
                                </CardContent>
                            }
                        </Card>
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
                                                proposal?.attributes?.content
                                                    ?.attributes?.prop_name
                                            }
                                        </Typography>
                                        <Typography
                                            variant='body2'
                                            component={'h5'}
                                            sx={{
                                                color: (theme) =>
                                                    theme?.palette?.text?.black,
                                                mt: 1,
                                            }}
                                        >
                                            @
                                            {
                                                proposal?.attributes
                                                    ?.user_govtool_username
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
                                                        whiteSpace: 'pre-line',
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
                                                                  ?.icons?.black
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
                                                        disabled={disableShare}
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
                                                            color: (theme) =>
                                                                theme.palette
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
                                                proposal?.attributes?.user_id?.toString() &&
                                            !proposal?.attributes?.content
                                                ?.attributes
                                                ?.prop_submitted && (
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
                                                        onClose={handleClose}
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
                                                            horizontal: 'right',
                                                            vertical: 'top',
                                                        }}
                                                        anchorOrigin={{
                                                            horizontal: 'right',
                                                            vertical: 'bottom',
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
                                                                    height={24}
                                                                    width={24}
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
                                                                    height={24}
                                                                    width={24}
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
                                        Governance Action Type
                                    </Typography>
                                    <Typography
                                        variant='body2'
                                        data-testid='governance-action-type-content'
                                    >
                                        {
                                            proposal?.attributes?.content
                                                ?.attributes?.gov_action_type
                                                ?.attributes
                                                ?.gov_action_type_name
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
                                            proposal?.attributes?.content
                                                ?.attributes?.createdAt
                                        )}`}
                                    </Typography>
                                    {user?.user?.id?.toString() ===
                                        proposal?.attributes?.user_id?.toString() && (
                                        <Box>
                                            <Button
                                                variant='outlined'
                                                startIcon={
                                                    <IconLink
                                                        fill={
                                                            theme.palette
                                                                .primary.main
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

                                            <ReviewVersions
                                                open={reviewVersionsOpen}
                                                onClose={
                                                    handleCloseReviewVersions
                                                }
                                                id={id}
                                            />
                                        </Box>
                                    )}
                                </Box>

                                <Box mt={4}>
                                    <Typography
                                        variant='caption'
                                        sx={{
                                            color: (theme) =>
                                                theme?.palette?.text?.grey,
                                        }}
                                    >
                                        Abstract
                                    </Typography>
                                    <ReactMarkdown>
                                        {showFullText || !maxLength ? AbstractMarkdownText : truncatedText}
                                    </ReactMarkdown>
                                    {!showFullText && maxLength && totalCharLength > maxLength && (
                                        <Button
                                            variant="text"
                                            onClick={() => setShowFullText(!showFullText)}
                                            sx={{
                                                textTransform: 'none',
                                                padding: '0',
                                                marginTop: '8px', 
                                                color: 'primary.main',
                                                fontWeight: 'bold',
                                                '&:hover': {
                                                    backgroundColor: 'transparent',
                                                },
                                            }}
                                        >
                                            {showFullText ? 'Show less' : 'Read more'}
                                        </Button>)}
                                </Box>
                                {showFullText && (
                               
                                    <Box mt={4}>
                                        <Typography
                                            variant='caption'
                                            sx={{
                                                color: (theme) => theme?.palette?.text?.grey,
                                            }}
                                        >
                                        Motivation
                                        </Typography>
                                        <ReactMarkdown>
                                            {proposal?.attributes?.content
                                                ?.attributes?.prop_motivation || ''}
                                        </ReactMarkdown>
                                    </Box>)}
                                    {showFullText && (
                                    <Box mt={4}>
                                        <Typography
                                            variant='caption'
                                            sx={{
                                                color: (theme) => theme?.palette?.text?.grey,
                                            }}
                                        >
                                        Rationale
                                        </Typography>
                                        <ReactMarkdown>
                                            {proposal?.attributes?.content
                                                ?.attributes?.prop_rationale || ''}
                                        </ReactMarkdown>
                                    </Box>)}
                                    {showFullText && (
                                    <Button
                                            variant="text"
                                            onClick={() => setShowFullText(!showFullText)}
                                            sx={{
                                                textTransform: 'none',
                                                padding: '0',
                                                marginTop: '8px', 
                                                color: 'primary.main',
                                                fontWeight: 'bold',
                                                '&:hover': {
                                                    backgroundColor: 'transparent',
                                                },
                                            }}
                                        >
                                            {showFullText ? 'Show less' : 'Read more'}
                                    </Button>                                
                                )}
                                {proposal?.attributes?.content?.attributes
                                    ?.proposal_links?.length > 0 && (
                                    <Box mt={4}>
                                        <Typography
                                            variant='caption'
                                            sx={{
                                                color: (theme) =>
                                                    theme?.palette?.text?.grey,
                                            }}
                                        >
                                            Supporting links
                                        </Typography>

                                        <Box>
                                            {proposal?.attributes?.content?.attributes?.proposal_links?.map(
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
                                                    >
                                                        <Typography
                                                            component={'p'}
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
                                                            proposal?.attributes
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
                                    <Box display={'flex'} gap={1}>
                                        {/* LIKE BUTTON */}
                                        <Tooltip
                                            title={
                                                <span
                                                    style={{
                                                        whiteSpace: 'pre-line',
                                                    }}
                                                >
                                                    {proposal?.attributes
                                                        ?.content?.attributes
                                                        ?.prop_submitted
                                                        ? `Proposal Submitted\n\nYou can't like this proposal`
                                                        : walletAPI?.address
                                                          ? user
                                                              ? user?.user?.id?.toString() ===
                                                                proposal?.attributes?.user_id?.toString()
                                                                  ? `You can't like your proposal`
                                                                  : userProposalVote
                                                                    ? userProposalVote
                                                                          ?.attributes
                                                                          ?.vote_result ===
                                                                      true
                                                                        ? `You already liked this proposal`
                                                                        : 'Like this proposal\n\nClick to like this proposal'
                                                                    : 'Like this proposal\n\nClick to like this proposal'
                                                              : 'Like this proposal\n\nClick to like this proposal'
                                                          : 'Connect wallet to like this proposal'}
                                                </span>
                                            }
                                        >
                                            <span>
                                                <IconButton
                                                    sx={{
                                                        border: (theme) =>
                                                            `1px solid ${theme.palette.iconButton.outlineLightColor}`,
                                                    }}
                                                    data-testid='like-button'
                                                    disabled={
                                                        walletAPI?.address
                                                            ? proposal
                                                                  ?.attributes
                                                                  ?.content
                                                                  ?.attributes
                                                                  ?.prop_submitted
                                                                ? true
                                                                : user
                                                                  ? user?.user?.id?.toString() ===
                                                                    proposal?.attributes?.user_id?.toString()
                                                                      ? true
                                                                      : userProposalVote
                                                                        ? userProposalVote
                                                                              ?.attributes
                                                                              ?.vote_result ===
                                                                          true
                                                                            ? true
                                                                            : false
                                                                        : false
                                                                  : false
                                                            : true
                                                    }
                                                    onClick={
                                                        proposal?.attributes
                                                            ?.content
                                                            ?.attributes
                                                            ?.prop_submitted
                                                            ? null
                                                            : user
                                                              ? !user?.user
                                                                    ?.govtool_username
                                                                  ? () =>
                                                                        setOpenUsernameModal(
                                                                            {
                                                                                open: true,
                                                                                callBackFn:
                                                                                    () => {},
                                                                            }
                                                                        )
                                                                  : user?.user?.id?.toString() ===
                                                                      proposal?.attributes?.user_id?.toString()
                                                                    ? null
                                                                    : userProposalVote
                                                                      ? userProposalVote
                                                                            ?.attributes
                                                                            ?.vote_result ===
                                                                        null
                                                                          ? null
                                                                          : () =>
                                                                                updateLikesOrDislikes(
                                                                                    {
                                                                                        like: true,
                                                                                        loggedInUser:
                                                                                            user,
                                                                                    }
                                                                                )
                                                                      : () =>
                                                                            updateLikesOrDislikes(
                                                                                {
                                                                                    like: true,
                                                                                    loggedInUser:
                                                                                        user,
                                                                                }
                                                                            )
                                                              : () =>
                                                                    updateLikesOrDislikes(
                                                                        {
                                                                            like: true,
                                                                            loggedInUser:
                                                                                user,
                                                                        }
                                                                    )
                                                    }
                                                >
                                                    <Badge
                                                        badgeContent={
                                                            proposal?.attributes
                                                                ?.prop_likes ||
                                                            0
                                                        }
                                                        data-testid='like-count'
                                                        showZero
                                                        aria-label='proposal likes'
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
                                                                                .secondary,
                                                                },
                                                        }}
                                                    ></Badge>
                                                    <IconThumbUp
                                                        fill={
                                                            user
                                                                ? userProposalVote
                                                                    ? userProposalVote
                                                                          ?.attributes
                                                                          ?.vote_result ===
                                                                      true
                                                                        ? theme
                                                                              ?.palette
                                                                              ?.primary
                                                                              ?.main
                                                                        : theme
                                                                              ?.palette
                                                                              ?.primary
                                                                              ?.icons
                                                                              ?.black
                                                                    : theme
                                                                          ?.palette
                                                                          ?.primary
                                                                          ?.icons
                                                                          ?.black
                                                                : theme?.palette
                                                                      ?.primary
                                                                      ?.icons
                                                                      ?.black
                                                        }
                                                    />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                        {/* DISLIKE BUTTON */}
                                        <Tooltip
                                            title={
                                                <span
                                                    style={{
                                                        whiteSpace: 'pre-line',
                                                    }}
                                                >
                                                    {proposal?.attributes
                                                        ?.content?.attributes
                                                        ?.prop_submitted
                                                        ? `Proposal Submitted\n\nYou can't dislike this proposal`
                                                        : walletAPI?.address
                                                          ? user
                                                              ? user?.user?.id?.toString() ===
                                                                proposal?.attributes?.user_id?.toString()
                                                                  ? `You can't dislike your proposal`
                                                                  : userProposalVote
                                                                    ? userProposalVote
                                                                          ?.attributes
                                                                          ?.vote_result ===
                                                                      false
                                                                        ? `You already disliked this proposal`
                                                                        : 'Dislike this proposal\n\nClick to dislike this proposal'
                                                                    : 'Dislike this proposal\n\nClick to dislike this proposal'
                                                              : 'Dislike this proposal\n\nClick to dislike this proposal'
                                                          : 'Connect wallet to dislike this proposal'}
                                                </span>
                                            }
                                        >
                                            <span>
                                                <IconButton
                                                    sx={{
                                                        border: (theme) =>
                                                            `1px solid ${theme.palette.iconButton.outlineLightColor}`,
                                                    }}
                                                    data-testid='dislike-button'
                                                    disabled={
                                                        walletAPI?.address
                                                            ? proposal
                                                                  ?.attributes
                                                                  ?.content
                                                                  ?.attributes
                                                                  ?.prop_submitted
                                                                ? true
                                                                : user
                                                                  ? user?.user?.id?.toString() ===
                                                                    proposal?.attributes?.user_id?.toString()
                                                                      ? true
                                                                      : userProposalVote
                                                                        ? userProposalVote
                                                                              ?.attributes
                                                                              ?.vote_result ===
                                                                          false
                                                                            ? true
                                                                            : false
                                                                        : false
                                                                  : false
                                                            : true
                                                    }
                                                    onClick={
                                                        proposal?.attributes
                                                            ?.content
                                                            ?.attributes
                                                            ?.prop_submitted
                                                            ? null
                                                            : user
                                                              ? !user?.user
                                                                    ?.govtool_username
                                                                  ? () =>
                                                                        setOpenUsernameModal(
                                                                            {
                                                                                open: true,
                                                                                callBackFn:
                                                                                    () => {},
                                                                            }
                                                                        )
                                                                  : user?.user?.id?.toString() ===
                                                                      proposal?.attributes?.user_id?.toString()
                                                                    ? null
                                                                    : userProposalVote
                                                                      ? userProposalVote
                                                                            ?.attributes
                                                                            ?.vote_result ===
                                                                        null
                                                                          ? null
                                                                          : () =>
                                                                                updateLikesOrDislikes(
                                                                                    {
                                                                                        like: false,
                                                                                        loggedInUser:
                                                                                            user,
                                                                                    }
                                                                                )
                                                                      : () =>
                                                                            updateLikesOrDislikes(
                                                                                {
                                                                                    like: false,
                                                                                    loggedInUser:
                                                                                        user,
                                                                                }
                                                                            )
                                                              : () =>
                                                                    updateLikesOrDislikes(
                                                                        {
                                                                            like: false,
                                                                            loggedInUser:
                                                                                user,
                                                                        }
                                                                    )
                                                    }
                                                >
                                                    <Badge
                                                        badgeContent={
                                                            proposal?.attributes
                                                                ?.prop_dislikes ||
                                                            0
                                                        }
                                                        data-testid='dislike-count'
                                                        showZero
                                                        aria-label='proposal dislikes'
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
                                                                                .errorLight,
                                                                },
                                                        }}
                                                    ></Badge>
                                                    <IconThumbDown
                                                        fill={
                                                            user
                                                                ? userProposalVote
                                                                    ? userProposalVote
                                                                          ?.attributes
                                                                          ?.vote_result ===
                                                                      false
                                                                        ? theme
                                                                              ?.palette
                                                                              ?.primary
                                                                              ?.main
                                                                        : theme
                                                                              ?.palette
                                                                              ?.primary
                                                                              ?.icons
                                                                              ?.black
                                                                    : theme
                                                                          ?.palette
                                                                          ?.primary
                                                                          ?.icons
                                                                          ?.black
                                                                : theme?.palette
                                                                      ?.primary
                                                                      ?.icons
                                                                      ?.black
                                                        }
                                                    />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    </Box>
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
                                proposal?.attributes?.prop_comments_number === 0
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

                    {proposal?.attributes?.content?.attributes
                        ?.prop_submitted ? null : user &&
                      +user?.user?.id === +proposal?.attributes?.user_id &&
                      !activePoll ? (
                        <Box mt={4}>
                            <Card data-testid='add-poll-card'>
                                <CardContent>
                                    <Typography
                                        variant='body1'
                                        fontWeight={600}
                                    >
                                        Do you want to check if your proposal is
                                        ready to be submitted as a Governance
                                        Action?
                                    </Typography>

                                    <Typography variant='body2' mt={2}>
                                        The poll will be pinned to the top of
                                        your comments list, and you can close it
                                        whenever you like. Opening a new poll
                                        will automatically close the previous
                                        one, which will then appear as a comment
                                        in the comments feed.
                                    </Typography>

                                    <Box
                                        mt={2}
                                        display='flex'
                                        justifyContent='flex-end'
                                    >
                                        <Button
                                            variant='contained'
                                            onClick={addPoll}
                                            data-testid='add-poll-button'
                                        >
                                            Add Poll
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    ) : null}

                    {activePoll && (
                        <Box mt={4}>
                            <Poll
                                proposalUserId={proposal?.attributes?.user_id}
                                proposalAuthorUsername={
                                    proposal?.attributes?.user_govtool_username
                                }
                                proposalSubmitted={
                                    proposal?.attributes?.content?.attributes
                                        ?.prop_submitted
                                }
                                poll={activePoll}
                                fetchActivePoll={fetchActivePoll}
                                fetchUnactivePolls={fetchUnactivePolls}
                            />
                        </Box>
                    )}

                    {unactivePollList?.length > 0 && (
                        <Box mt={4}>
                            {unactivePollList?.map((poll, index) => (
                                <Box key={index} mb={4}>
                                    <Poll
                                        proposalUserId={
                                            proposal?.attributes?.user_id
                                        }
                                        proposalAuthorUsername={
                                            proposal?.attributes
                                                ?.user_govtool_username
                                        }
                                        proposalSubmitted={
                                            proposal?.attributes?.content
                                                ?.attributes?.prop_submitted
                                        }
                                        poll={poll}
                                    />
                                </Box>
                            ))}
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
                                                        theme?.palette?.error
                                                            ?.main,
                                                }}
                                            >
                                                {`${
                                                    newCommentText?.length || 0
                                                }/${MAX_COMMENT_LENGTH}`}
                                            </Typography>
                                        }
                                        value={newCommentText || ''}
                                        onChange={(e) => handleChange(e)}
                                        inputProps={{
                                            maxLength: MAX_COMMENT_LENGTH,
                                            onKeyDown: handleKeyDown,
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
                                                          callBackFn: () => {},
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
                                        Be the first to share your thoughts on
                                        this proposal.
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
                                    setCommentsCurrentPage((prev) => prev + 1);
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

                    <ProposalSubmissionDialog
                        proposal={proposal}
                        openEditDialog={openGASubmissionDialog}
                        handleCloseSubmissionDialog={() =>
                            setOpenGASubmissionDialog(false)
                        }
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

export default SingleGovernanceAction;
