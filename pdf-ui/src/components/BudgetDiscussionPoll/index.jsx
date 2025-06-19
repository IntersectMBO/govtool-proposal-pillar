import { IconX } from '@intersect.mbo/intersectmbo.org-icons-set';
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    IconButton,
    Modal,
    Typography,
    alpha,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../context/context';
import {
    createBudgetDiscussionPollVote,
    getUserBudgetDiscussionPollVote,
    updateBudgetDiscussionPollVote,
} from '../../lib/api';
import { decodeJWT, formatDateWithOffset } from '../../lib/utils';
import DrepVotersDialog from '../DrepVotersDialog';
import { add, max } from 'date-fns';
import { checkIfDrepIsSignedIn, checkShowValidation } from '../../lib/helpers';
import UserValidation from '../UserValidation/UserValidation';

const BudgetDiscussionPoll = ({
    fetchActivePoll = false,
    proposalUserId,
    proposalAuthorUsername,
    poll,
}) => {
    const {
        user,
        setLoading,
        setOpenUsernameModal,
        walletAPI,
        addSuccessAlert,
        addErrorAlert,
    } = useAppContext();
    const [userPollVote, setUserPollVote] = useState(null);
    const [showChangeVoteModal, setShowChangeVoteModal] = useState(false);
    const [showDrepVotersDialog, setShowDrepVotersDialog] = useState(false);

    const fetchUserPollVote = async (id) => {
        try {
            const response = await getUserBudgetDiscussionPollVote({
                pollID: id,
                userID: user?.user?.id,
            });

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

    const jwtData = decodeJWT();

    const handlePollVote = async ({ vote }) => {
        try {
            if (jwtData) {
                if (jwtData?.dRepID) {
                    const response = await createBudgetDiscussionPollVote({
                        createData: {
                            bd_poll_id: `${poll?.id}`,
                            vote_result: vote,
                            drep_voting_power:
                                walletAPI?.voter?.votingPower || '',
                        },
                    });

                    if (!response) return;

                    setUserPollVote(response);
                    if (fetchActivePoll) {
                        fetchActivePoll();
                    }

                    addSuccessAlert(
                        `Voted ${vote ? 'yes' : 'no'} successfully.`
                    );
                } else {
                    addErrorAlert(
                        'dRepID is not available in authorization token.'
                    );
                    throw new Error(
                        'dRepID is not available in authorization token.'
                    );
                }
            } else {
                addErrorAlert('Authorization token not available.');
                throw new Error('Authorization token not available.');
            }
        } catch (error) {
            addErrorAlert('Failed to submit vote.');
            console.error(error);
        }
    };

    const toggleChangeVoteModal = () => {
        setShowChangeVoteModal((prev) => !prev);
    };

    const handlePollVoteChange = async () => {
        setLoading(true);
        try {
            const response = await updateBudgetDiscussionPollVote({
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
            addSuccessAlert(
                `Voted ${userPollVote?.attributes?.vote_result ? 'no' : 'yes'} successfully.`
            );
        } catch (error) {
            addErrorAlert('Failed to submit vote.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUserPollVote(poll?.id);
        }
    }, [user, poll]);

    // user &&
    //     userPollVote &&
    //     poll?.attributes?.is_poll_active &&
    //     (walletAPI?.voter?.isRegisteredAsDRep ||
    //         walletAPI?.voter?.isRegisteredAsSoleVoter) &&
    //     jwtData?.dRepID;

    // console.log('user', user);
    // console.log('userPollVote', userPollVote);
    // console.log('poll', poll?.attributes?.is_poll_active);
    // console.log('walletAPI', walletAPI?.voter?.isRegisteredAsDRep);
    // console.log('walletAPI', walletAPI?.voter?.isRegisteredAsSoleVoter);
    // console.log('jwtData', jwtData);
    // console.log('jwtData.dRepID', jwtData?.dRepID);

    // console.log(
    //     'log',
    //     user &&
    //         userPollVote &&
    //         poll?.attributes?.is_poll_active &&
    //         (walletAPI?.voter?.isRegisteredAsDRep ||
    //             walletAPI?.voter?.isRegisteredAsSoleVoter) &&
    //         jwtData?.dRepID
    // );

    if (poll) {
        return (
            <>
                {/* {user &&
                !userPollVote &&
                (walletAPI?.voter?.isRegisteredAsDRep ||
                    walletAPI?.voter?.isRegisteredAsSoleVoter) &&
                jwtData?.dRepID ? (
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
                            <Typography variant='body1' fontWeight={600} my={2}>
                                Do you support this proposal to be included in
                                the next Cardano Budget?
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
                ) : null} */}

                <Card data-testid='poll-result-card'>
                    <CardContent
                        sx={{ display: 'flex', flexDirection: 'column' }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='body1' fontWeight={600} my={2}>
                                Should this proposal be included in the next
                                Cardano Budget?
                            </Typography>
                            {!(user &&
                                userPollVote &&
                                poll?.attributes?.is_poll_active &&
                                (walletAPI?.voter?.isRegisteredAsDRep ||
                                    walletAPI?.voter
                                        ?.isRegisteredAsSoleVoter) &&
                                jwtData?.dRepID) && (
                                    <Box>
                                        {checkShowValidation(
                                            true,
                                            walletAPI,
                                            user
                                        ) ? (
                                            <UserValidation
                                                type='drep-poll'
                                                drepCheck={checkIfDrepIsSignedIn(
                                                    walletAPI
                                                )}
                                                drepRequired={true}
                                            />
                                        ) : 

                                        (walletAPI?.voter?.isRegisteredAsDRep ||
                                            walletAPI?.voter
                                        ?.isRegisteredAsSoleVoter)&&(
                                            <Box
                                                style={{
                                                    display: 'flex',
                                                    gap: '20px',
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    maxWidth: '30%',
                                                }}
                                            >
                                                <Button
                                                    variant='outlined'
                                                    sx={{ mb: 1, width: '50%' }}
                                                    onClick={
                                                        user?.user
                                                            ?.govtool_username
                                                            ? () =>
                                                                  handlePollVote(
                                                                      {
                                                                          vote: true,
                                                                      }
                                                                  )
                                                            : () =>
                                                                  setOpenUsernameModal(
                                                                      {
                                                                          open: true,
                                                                          callBackFn:
                                                                              () => {},
                                                                      }
                                                                  )
                                                    }
                                                    data-testid='poll-yes-button'
                                                >
                                                    Yes
                                                </Button>
                                                <Button
                                                    sx={{ mb: 1, width: '50%' }}
                                                    variant='outlined'
                                                    onClick={
                                                        user?.user
                                                            ?.govtool_username
                                                            ? () =>
                                                                  handlePollVote(
                                                                      {
                                                                          vote: false,
                                                                      }
                                                                  )
                                                            : () =>
                                                                  setOpenUsernameModal(
                                                                      {
                                                                          open: true,
                                                                          callBackFn:
                                                                              () => {},
                                                                      }
                                                                  )
                                                    }
                                                    data-testid='poll-no-button'
                                                >
                                                    No
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>
                                )}
                        </Box>
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
                            alignItems={'center'}
                            justifyContent={'space-between'}
                            mt={3}
                            gap={1}
                        >
                            <Typography
                                variant='body1'
                                fontWeight={600}
                                data-testid='poll-yes-count'
                            >
                                {`Yes: (${
                                    totalVotesGreaterThanZero(poll)
                                        ? calculatePercentage(poll, true)
                                        : 0
                                }%)`}
                            </Typography>

                            <Button
                                variant='text'
                                onClick={() => setShowDrepVotersDialog('YES')}
                            >
                                See details
                            </Button>
                        </Box>
                        <Box
                            display={'flex'}
                            width={'100%'}
                            justifyContent={'space-between'}
                            alignItems={'center'}
                            mt={3}
                            gap={1}
                        >
                            <Typography
                                variant='body1'
                                fontWeight={600}
                                data-testid='poll-no-count'
                            >
                                {`No: (${
                                    totalVotesGreaterThanZero(poll)
                                        ? calculatePercentage(poll, false)
                                        : 0
                                }%)`}
                            </Typography>
                            <Button
                                variant='text'
                                onClick={() => setShowDrepVotersDialog('NO')}
                            >
                                See details
                            </Button>
                        </Box>

                        {user &&
                            userPollVote &&
                            poll?.attributes?.is_poll_active &&
                            (walletAPI?.voter?.isRegisteredAsDRep ||
                                walletAPI?.voter?.isRegisteredAsSoleVoter) &&
                            jwtData?.dRepID && (
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

                <DrepVotersDialog
                    open={showDrepVotersDialog}
                    handleClose={() => setShowDrepVotersDialog(false)}
                    pollID={poll?.id}
                />
            </>
        );
    }
};

export default BudgetDiscussionPoll;
