import { IconX } from '@intersect.mbo/intersectmbo.org-icons-set';
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    IconButton,
    LinearProgress,
    Modal,
    Typography,
    alpha,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../context/context';
import {
    closePoll,
    createPollVote,
    getUserPollVote,
    updatePollVote,
} from '../../lib/api';
import { formatPollDateDisplay } from '../../lib/utils';

const Poll = ({
    fetchActivePoll = false,
    fetchUnactivePolls = false,
    proposalUserId,
    proposalAuthorUsername,
    proposalSubmitted,
    poll,
}) => {
    const { user, setLoading, setOpenUsernameModal } = useAppContext();
    const [userPollVote, setUserPollVote] = useState(null);
    const [showChangeVoteModal, setShowChangeVoteModal] = useState(false);
    const [showClosePollModal, setShowClosePollModal] = useState(false);

    const fetchUserPollVote = async (id) => {
        try {
            const response = await getUserPollVote({ pollID: id });
            if (!response) return;
            setUserPollVote(response);
        } catch (error) {
            console.error(error);
        }
    };

    const totalVotesGreaterThanZero = (pollData) => {
        const yes = +pollData?.attributes?.poll_yes;
        const no = +pollData?.attributes?.poll_no;

        if (yes + no > 0) {
            return true;
        } else {
            return false;
        }
    };

    const calculatePercentage = (pollData, yes = true) => {
        return Math.round(
            (+pollData?.attributes?.[yes ? 'poll_yes' : 'poll_no'] /
                (+pollData?.attributes?.poll_yes +
                    +pollData?.attributes?.poll_no)) *
                100
        );
    };

    const handlePollVote = async ({ vote }) => {
        try {
            const response =
                // userProposalVote
                // ? await updateProposalLikesOrDislikes({
                // 		proposalVoteID: userProposalVote?.id,
                // 		updateData: data,
                //   })
                // :
                await createPollVote({
                    createData: { poll_id: `${poll?.id}`, vote_result: vote },
                });

            if (!response) return;

            setUserPollVote(response);
            if (fetchActivePoll) {
                fetchActivePoll();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const toggleChangeVoteModal = () => {
        setShowChangeVoteModal((prev) => !prev);
    };
    const toggleClosePollModal = () => {
        setShowClosePollModal((prev) => !prev);
    };

    const handlePollVoteChange = async () => {
        setLoading(true);
        try {
            const response = await updatePollVote({
                pollVoteID: userPollVote?.id,
                updateData: {
                    vote_result: !userPollVote?.attributes?.vote_result,
                },
            });

            if (!response) return;
            setUserPollVote(response);
            if (fetchActivePoll) {
                fetchActivePoll();
            }
            toggleChangeVoteModal();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const closeProposalPoll = async () => {
        try {
            const response = await closePoll({ pollID: poll?.id });

            if (!response) return;

            if (fetchActivePoll) {
                fetchActivePoll();
            }
            if (fetchUnactivePolls) {
                fetchUnactivePolls();
            }
            toggleClosePollModal();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (user) {
            if (poll) {
                if (!userPollVote) {
                    fetchUserPollVote(poll?.id);
                }
            }
        }
    }, [user, poll]);

    if (poll) {
        return (
            <>
                {proposalSubmitted ? null : user &&
                  !userPollVote &&
                  user?.user?.id !== +proposalUserId &&
                  poll?.attributes?.is_poll_active ? (
                    <Card
                        sx={{
                            mb: 3,
                            backgroundColor: alpha('#FFFFFF', 0.3),
                        }}
                        data-testid='poll-vote-card'
                    >
                        <CardContent
                            sx={{ display: 'flex', flexDirection: 'column' }}
                        >
                            <Typography variant='body2'>
                                @{proposalAuthorUsername}
                            </Typography>
                            <Typography
                                variant='caption'
                                sx={{
                                    color: (theme) => theme.palette.text.grey,
                                }}
                                mt={2}
                            >
                                {formatPollDateDisplay(
                                    poll?.attributes?.poll_start_dt
                                )}
                            </Typography>
                            <Typography variant='body1' fontWeight={600} my={2}>
                                Is this proposal ready to be submitted on chain?
                            </Typography>

                            <Button
                                variant='outlined'
                                sx={{ mb: 1 }}
                                onClick={
                                    user?.user?.govtool_username
                                        ? () => handlePollVote({ vote: true })
                                        : () =>
                                              setOpenUsernameModal({
                                                  open: true,
                                                  callBackFn: () => {},
                                              })
                                }
                                data-testid='poll-yes-button'
                            >
                                Yes
                            </Button>
                            <Button
                                variant='outlined'
                                onClick={
                                    user?.user?.govtool_username
                                        ? () => handlePollVote({ vote: false })
                                        : () =>
                                              setOpenUsernameModal({
                                                  open: true,
                                                  callBackFn: () => {},
                                              })
                                }
                                data-testid='poll-no-button'
                            >
                                No
                            </Button>
                        </CardContent>
                    </Card>
                ) : null}
                <Card data-testid='poll-result-card'>
                    <CardContent
                        sx={{ display: 'flex', flexDirection: 'column' }}
                    >
                        <Typography variant='body2'>
                            @{proposalAuthorUsername}
                        </Typography>
                        <Typography
                            variant='caption'
                            sx={{
                                color: (theme) => theme.palette.text.grey,
                            }}
                            mt={2}
                        >
                            {formatPollDateDisplay(
                                poll?.attributes?.poll_start_dt
                            )}
                        </Typography>
                        <Typography variant='body1' fontWeight={600} mt={2}>
                            Poll Results
                        </Typography>
                        <Typography variant='body2' mt={1}>
                            Is this proposal ready to be submitted on chain?
                        </Typography>
                        <Divider
                            variant='fullWidth'
                            sx={{
                                my: 2,
                                color: (theme) => theme.palette.divider.primary,
                            }}
                        />
                        <Typography
                            variant='caption'
                            sx={{
                                color: (theme) => theme.palette.text.black,
                            }}
                        >
                            Total votes:{' '}
                            {+poll?.attributes?.poll_yes +
                                +poll?.attributes?.poll_no}
                        </Typography>
                        <Box
                            display={'flex'}
                            width={'100%'}
                            justifyContent={'flex-start'}
                            alignItems={'center'}
                            mt={1}
                            gap={1}
                        >
                            <Typography
                                variant='caption'
                                sx={{
                                    color: (theme) =>
                                        userPollVote?.attributes
                                            ?.vote_result === true
                                            ? theme.palette.primary.main
                                            : theme.palette.text.black,
                                    textWrap: 'nowrap',
                                    minWidth: '80px',
                                }}
                                fontWeight={
                                    userPollVote?.attributes?.vote_result ===
                                        true && 600
                                }
                                data-testid='poll-yes-count'
                            >
                                {`Yes: (${
                                    totalVotesGreaterThanZero(poll)
                                        ? calculatePercentage(poll, true)
                                        : 0
                                }%)`}
                            </Typography>
                            {user?.user?.id !== +proposalUserId && (
                                <LinearProgress
                                    variant='determinate'
                                    color='primary'
                                    value={
                                        totalVotesGreaterThanZero(poll)
                                            ? calculatePercentage(poll, true)
                                            : 0
                                    }
                                    sx={{
                                        height: '6px',
                                        width: '100%',
                                        borderRadius: 100,
                                    }}
                                />
                            )}
                        </Box>
                        <Box
                            display={'flex'}
                            width={'100%'}
                            justifyContent={'flex-start'}
                            alignItems={'center'}
                            mt={1}
                            gap={1}
                        >
                            <Typography
                                variant='caption'
                                sx={{
                                    color: (theme) =>
                                        userPollVote?.attributes
                                            ?.vote_result === false
                                            ? theme.palette.primary.main
                                            : theme.palette.text.black,
                                    textWrap: 'nowrap',
                                    minWidth: '80px',
                                }}
                                fontWeight={
                                    userPollVote?.attributes?.vote_result ===
                                        false && 600
                                }
                                data-testid='poll-no-count'
                            >
                                {`No: (${
                                    totalVotesGreaterThanZero(poll)
                                        ? calculatePercentage(poll, false)
                                        : 0
                                }%)`}
                            </Typography>
                            {user?.user?.id !== +proposalUserId && (
                                <LinearProgress
                                    variant='determinate'
                                    color='primary'
                                    value={
                                        totalVotesGreaterThanZero(poll)
                                            ? calculatePercentage(poll, false)
                                            : 0
                                    }
                                    sx={{
                                        height: '6px',
                                        width: '100%',
                                        borderRadius: 100,
                                    }}
                                />
                            )}
                        </Box>
                        {user?.user?.id === +proposalUserId &&
                            poll?.attributes?.is_poll_active && (
                                <Box
                                    mt={2}
                                    display={'flex'}
                                    justifyContent={'flex-end'}
                                >
                                    <Button
                                        variant='outlined'
                                        onClick={toggleClosePollModal}
                                        data-testid='close-poll-button'
                                    >
                                        Close Poll
                                    </Button>
                                </Box>
                            )}
                        {user &&
                            userPollVote &&
                            user?.user?.id !== +proposalUserId &&
                            poll?.attributes?.is_poll_active && (
                                <Box
                                    mt={2}
                                    display={'flex'}
                                    justifyContent={'flex-end'}
                                >
                                    <Button
                                        variant='outlined'
                                        onClick={toggleChangeVoteModal}
                                        data-testid='change-vote-button'
                                    >
                                        Change Vote
                                    </Button>
                                </Box>
                            )}
                    </CardContent>
                </Card>
                <Modal
                    open={showChangeVoteModal}
                    onClose={toggleChangeVoteModal}
                    data-testid='change-poll-vote-modal'
                >
                    <Box
                        sx={{
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
                        }}
                    >
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
                                <Typography
                                    id='modal-modal-title'
                                    variant='h6'
                                    component='h2'
                                >
                                    Do you really want to change your Poll Vote?
                                </Typography>
                                <IconButton onClick={toggleChangeVoteModal}>
                                    <IconX width='24px' height='24px' />
                                </IconButton>
                            </Box>
                            <Typography
                                id='modal-modal-description'
                                mt={2}
                                color={(theme) => theme.palette.text.grey}
                            >
                                {`Currently your Poll Vote is ${
                                    userPollVote?.attributes?.vote_result
                                        ? 'Yes'
                                        : 'No'
                                }. After changing your vote, it will be ${
                                    userPollVote?.attributes?.vote_result
                                        ? 'No'
                                        : 'Yes'
                                }.`}
                            </Typography>
                        </Box>
                        <Box
                            display='flex'
                            flexDirection='column'
                            padding={2}
                            gap={2}
                        >
                            <Button
                                variant='contained'
                                fullWidth
                                sx={{
                                    borderRadius: '20px',
                                }}
                                onClick={toggleChangeVoteModal}
                                data-testid='change-poll-vote-no-button'
                            >
                                I don't want to change
                            </Button>
                            <Button
                                variant='outlined'
                                fullWidth
                                sx={{
                                    borderRadius: '20px',
                                }}
                                onClick={handlePollVoteChange}
                                data-testid='change-poll-vote-yes-button'
                            >
                                Yes, change my Poll Vote
                            </Button>
                        </Box>
                    </Box>
                </Modal>
                <Modal open={showClosePollModal} onClose={toggleClosePollModal}>
                    <Box
                        sx={{
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
                        }}
                    >
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
                                <Typography
                                    id='modal-modal-title'
                                    variant='h6'
                                    component='h2'
                                >
                                    Do you really want to close the Poll?
                                </Typography>
                                <IconButton onClick={toggleClosePollModal}>
                                    <IconX width='24px' height='24px' />
                                </IconButton>
                            </Box>
                            <Typography
                                id='modal-modal-description'
                                mt={2}
                                color={(theme) => theme.palette.text.grey}
                            >
                                Closing the poll will prevent users from
                                submitting additional votes.
                            </Typography>
                        </Box>
                        <Box
                            display='flex'
                            flexDirection='column'
                            padding={2}
                            gap={2}
                        >
                            <Button
                                variant='contained'
                                fullWidth
                                sx={{
                                    borderRadius: '20px',
                                }}
                                onClick={() => closeProposalPoll()}
                                data-testid='close-the-poll-button'
                            >
                                Close the Poll
                            </Button>
                            <Button
                                variant='outlined'
                                fullWidth
                                sx={{
                                    borderRadius: '20px',
                                }}
                                onClick={toggleClosePollModal}
                                data-testid='cancel-the-poll-button'
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </>
        );
    }
};

export default Poll;
