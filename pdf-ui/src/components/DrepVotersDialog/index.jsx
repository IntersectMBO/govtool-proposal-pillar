import React, { useEffect, useState } from 'react';
import {
    Typography,
    Dialog,
    DialogContent,
    Box,
    IconButton,
    Link,
} from '@mui/material';
import { IconX } from '@intersect.mbo/intersectmbo.org-icons-set';
import { getBudgetDiscussionPollVotes } from '../../lib/api';
import { useAppContext } from '../../context/context';
import {
    correctVoteAdaFormat,
    formatDateWithOffset,
    LOVELACE,
} from '../../lib/utils';

const DrepVotersDialog = ({ open, handleClose, pollID }) => {
    const { fetchDRepVotingPowerList } = useAppContext();
    const [drepList, setDrepList] = useState([]);
    const [totalVotingPower, setTotalVotingPower] = useState(0);

    const fetchPollVotes = async () => {
        const votes = await getBudgetDiscussionPollVotes({
            pollID: pollID,
            vote: open === 'YES' ? true : false,
        });
        if (votes?.length === 0) return;
        const drepIds = votes?.map((vote) => vote?.attributes?.drep_id);
        const drepWhoVoted = await fetchDRepVotingPowerList(drepIds);

        drepWhoVoted.sort((a, b) => {
            return b?.votingPower - a?.votingPower;
        });

        let totalPower = 0;
        for (const drep of drepWhoVoted) {
            totalPower += +drep?.votingPower;
            const findVote = votes?.find(
                (vote) => vote?.attributes?.drep_id === drep?.hashRaw
            );

            drep.voted_at = findVote?.attributes?.createdAt;
        }

        setTotalVotingPower(totalPower);
        setDrepList(drepWhoVoted);
    };

    useEffect(() => {
        if (!open) return;
        setDrepList([]);
        setTotalVotingPower(0);
        fetchPollVotes();
    }, [open]);

    return (
        <Dialog
            open={open ? true : false}
            onClose={handleClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            fullWidth
            maxWidth={'sm'}
        >
            <DialogContent>
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    <IconButton
                        onClick={handleClose}
                        data-testid='close-modal-button'
                    >
                        <IconX />
                    </IconButton>
                </Box>

                <Typography
                    variant='h5'
                    sx={{
                        mb: 4,
                    }}
                >
                    DReps who voted '{open}'
                </Typography>

                <Typography
                    variant='body1'
                    sx={{
                        mb: 4,
                    }}
                >
                    List of DReps who voted '{open}' for this proposal to be
                    included in the next Cardano Budget
                </Typography>

                <Typography variant='caption'>
                    Total DRep Stake for this Proposal
                </Typography>
                <Typography
                    variant='h6'
                    sx={{
                        mb: 2,
                    }}
                >
                    ₳ {correctVoteAdaFormat(totalVotingPower / LOVELACE)}
                </Typography>

                {drepList?.length === 0 && (
                    <Typography variant='body1'>
                        No DReps voted '{open}' on this proposal
                    </Typography>
                )}
                {drepList?.length > 0 && (
                    <>
                        <Typography variant='body1' sx={{ mb: 2 }}>
                            DReps who voted '{open}' on this proposal:
                        </Typography>

                        {drepList?.map((drep, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant='h2'
                                        sx={{
                                            lineHeight: 0,
                                        }}
                                    >
                                        .
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        mb: 2,
                                    }}
                                >
                                    <Link
                                        href={
                                            '/connected/drep_directory/' +
                                            drep?.view
                                        }
                                        target='_blank'
                                        rel='noopener noreferrer'
                                    >
                                        <Typography variant='body1'>
                                            {drep?.givenName}
                                        </Typography>
                                    </Link>
                                    <Typography variant='caption'>
                                        {drep?.view
                                            ? drep?.view?.slice(0, 20) + '...'
                                            : '-'}
                                    </Typography>
                                    <Typography variant='h6'>
                                        ₳{' '}
                                        {correctVoteAdaFormat(
                                            drep?.votingPower / LOVELACE
                                        )}
                                    </Typography>
                                    {drep?.voted_at && (
                                        <Typography variant='caption'>
                                            Vote submitted on{' '}
                                            {formatDateWithOffset(
                                                new Date(drep?.voted_at),
                                                0,
                                                'dd/MM/yyyy - p',
                                                'UTC'
                                            )}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        ))}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default DrepVotersDialog;
