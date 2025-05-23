'use client';

import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
} from '@mui/material';
import { ProposalsList } from '..';
import { getProposals } from '../../lib/api';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../context/context';

const Step1 = ({ setStep, setProposalData, onClose, setSelectedDraftId }) => {
    const [draftsEnabled, setDraftsEnabled] = useState(false);
    const [mounted, setMounted] = useState(false);

    const fetchProposals = async () => {
        try {
            const query = `filters[$and][0][is_draft]=true&pagination[page]=1&pagination[pageSize]=1`;

            const { total } = await getProposals(query);
            if (total === 0) return;
            setDraftsEnabled(true);
        } catch (error) {
            console.error(error);
        }
    };
    const {walletAPI} = useAppContext();
    useEffect(() => {
        if (!mounted) {
            setMounted(true);
        } else {
            fetchProposals();
        }
    }, [mounted]);

    return (
        <Box display='flex' flexDirection='column'>
            <Box>
                {draftsEnabled ? (
                    <Card>
                        <CardContent>
                            <Box
                                sx={{
                                    mt: 2,
                                }}
                            >
                                <Typography variant='h4' gutterBottom>
                                    Decide if you want to use Existing Draft or
                                    Create new proposal
                                </Typography>
                            </Box>

                            <Box color={(theme) => theme.palette.text.grey}>
                                <Typography variant='body1' gutterBottom>
                                    Existing Drafts can save you some time and
                                    effort or simply start from stratch.
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    mt: 2,
                                }}
                            >
                                <Button
                                    variant='contained'
                                    onClick={() => setStep(2)}
                                    data-testid='create-new-proposal-button'
                                >
                                    Create new Proposal
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ) : (
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
                                    Step to submit a Governance action
                                </Typography>
                            </Box>

                            <Box color={(theme) => theme.palette.text.grey}>
                                <List
                                    sx={{
                                        listStyleType: 'disc',
                                        marginLeft: 2,
                                        textAlign: 'justify',
                                    }}
                                >
                                    <ListItem
                                        sx={{
                                            textAlign: 'justify',
                                            display: 'list-item',
                                            paddingX: 0,
                                        }}
                                    >
                                        <Typography
                                            variant='body1'
                                            gutterBottom
                                        >
                                            Before submitting a Governance
                                            Action on chain you need to submit a
                                            Proposal.
                                        </Typography>

                                        <Typography
                                            variant='body1'
                                            gutterBottom
                                            sx={{ fontWeight: 'bold' }}
                                        >
                                            This allows you to get feedback from
                                            the community to refine and improve
                                            your proposal, increasing the
                                            chances of your Governance Action
                                            getting approved, and also building
                                            up supporting context in the form of
                                            metadata.
                                        </Typography>
                                    </ListItem>
                                    <ListItem
                                        sx={{
                                            textAlign: 'justify',
                                            display: 'list-item',
                                            paddingX: 0,
                                        }}
                                    >
                                        <Typography
                                            variant='body1'
                                            gutterBottom
                                        >
                                            Once you are happy with your
                                            proposal you can open a poll to
                                            check ‘Is this proposal ready to be
                                            submitted on chain?’
                                        </Typography>
                                    </ListItem>
                                    <ListItem
                                        sx={{
                                            textAlign: 'justify',
                                            display: 'list-item',
                                            paddingX: 0,
                                        }}
                                    >
                                        <Typography
                                            variant='body1'
                                            gutterBottom
                                        >
                                            If you get support on the poll you
                                            are ready to submit your proposal on
                                            chain as a Governance Action to get
                                            voted on.
                                        </Typography>
                                    </ListItem>
                                    {
                                        walletAPI?.walletName.toLowerCase() == 'ledger' 
                                        || walletAPI?.walletName.toLowerCase() == 'trezor'? (
                                        <ListItem
                                                sx={{
                                                    textAlign: 'justify',
                                                    display: 'list-item',
                                                    paddingX: 0,
                                                    color: "#9c2224"
                                                }}
                                            >
                                                <Typography
                                                    variant='body1'
                                                    gutterBottom
                                                    sx={{ color: "#9c2224" }}
                                                >
                                                    Our system has detected that you are using a hardware wallet which does not support the submission of governance actions. 
                                                    As a result, you will not be able to submit actions to the blockchain using this wallet.
                                                </Typography>
                                        </ListItem>): null
                                    }

                                </List>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mt: 2,
                                }}
                            >
                                <Button
                                    variant='outlined'
                                    sx={{ float: 'left' }}
                                    onClick={onClose}
                                    data-testid='cancel-button'
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant='contained'
                                    onClick={() => setStep(2)}
                                    data-testid='continue-button'
                                >
                                    Continue
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                )}
            </Box>

            <Box mt={4}>
                <ProposalsList
                    isDraft={true}
                    startEdittinButtonClick={(proposal) => {
                        setStep(2);
                        setProposalData(
                            proposal?.attributes?.content?.attributes
                        );
                        setSelectedDraftId(proposal?.id);
                    }}
                    statusList={[]}
                />
            </Box>
        </Box>
    );
};

export default Step1;
