import React, { useEffect, useState } from 'react';
import {
    Typography,
    Dialog,
    DialogContent,
    Box,
    IconButton,
} from '@mui/material';
import { IconX } from '@intersect.mbo/intersectmbo.org-icons-set';
import { getBudgetDiscussionPollVotes } from '../../lib/api';
import { useAppContext } from '../../context/context';
import { correctAdaFormat } from '../../lib/utils';
import { formatIsoDate } from '../../lib/utils';

const DrepVotersDialog = ({ open, handleClose, pollID }) => {
    const { fetchDRepVotingPowerList } = useAppContext();
    const [drepList, setDrepList] = useState([]);
    const [totalVotingPower, setTotalVotingPower] = useState(0);
    // const drepList = [
    //     {
    //         view: 'drep1qq5n7k0r0ff6lf4qvndw9t7vmdqa9y3q9qtjq879rrk9vcjcdy8a4xf92mqsajf9u3nrsh3r6zrp29kuydmfq45fz88qpzmjkc',
    //         hashRaw:
    //             '9af10e89979e51b8cdc827c963124a1ef4920d1253eef34a1d5cfe76438e3f11',
    //         votingPower: 1000000,
    //         givenName: 'John Doe',
    //     },
    // ];

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
        fetchPollVotes();
    }, [open]);

    return (
        <Dialog
            open={open}
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
                    ₳ {correctAdaFormat(totalVotingPower)}
                </Typography>

                <Typography variant='body1'>
                    DReps who voted '{open}' on this proposal:
                </Typography>

                {drepList?.map((drep, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                        }}
                    >
                        <Typography variant='body1'>
                            {drep?.givenName}
                        </Typography>
                        <Typography variant='caption'>
                            {drep?.view
                                ? drep?.view?.slice(0, 20) + '...'
                                : '-'}
                        </Typography>
                        <Typography variant='h6'>
                            ₳ {correctAdaFormat(drep?.votingPower)}
                        </Typography>
                        <Typography variant='caption'>
                            Vote submitted on {formatIsoDate(drep?.voted_at)}
                        </Typography>
                    </Box>
                ))}
            </DialogContent>
        </Dialog>
    );
};

export default DrepVotersDialog;
