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
import { StepperActionButtons } from '../BudgetDiscussionParts'

const BudgetDiscussionInfo = ({setStep, step, onClose, setBudgetDiscussionData, currentBudgetDiscussionData, selectedDraftId, setSelectedDraftId, handleSaveDraft}) => {
    const [draftsEnabled, setDraftsEnabled] = useState(false);
    const [mounted, setMounted] = useState(false);

    const fetchBudgetDiscussionDrafts = async () => {
        try {
            const query = `filters[$and][0][is_draft]=true&pagination[page]=1&pagination[pageSize]=1`;

            const { total } = await getProposals(query);
            if (total === 0) return;
            setDraftsEnabled(true);
        } catch (error) {
            console.error(error);
        }
    };

    // useEffect(() => {
    //     if (!mounted) {
    //         setMounted(true);
    //     } else {
    //         fetchProposals();
    //     }
    // }, [mounted]);

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
                                    Create new budget discussion
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
                                    data-testid='create-new-budget-discussion-button'
                                >
                                    Create new Budget Discussion
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
                                    Budget Proposal
                                </Typography>
                            </Box>

                            <Box color={(theme) => theme.palette.text.grey}>
                                <Typography variant='body1' gutterBottom>
                                    This process is open to any individual or organization within the Cardano ecosystem that wishes to submit a proposal related to the Cardano blockchain ecosystem for inclusion in a Cardano Budget facilitated by Intersect.
                                </Typography>
                                <List
                                    sx={{
                                        listStyleType: 'disc',
                                        marginLeft: 2,
                                        textAlign: 'justify',
                                        marginBottom:0,
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
                                        <Typography
                                            variant='body1'
                                            gutterBottom
                                            
                                        >
                                            All proposals, except private contact details, will be made public to facilitate community and DRep review and decision-making.
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
                                        <Typography
                                            variant='body1'
                                            gutterBottom
                                        >
                                            If you have submitted or are already receiving funding for your proposal from Project Catalyst, you are not eligible to apply for funding via this process.
                                        </Typography>
                                    </ListItem>
                                    </List>
                                    <Typography variant='body1' gutterBottom>
                                    If you have made a prior proposal submission through an Intersect Committee, you will need to either:
                                    </Typography>
                                    <List sx={{
                                        listStyleType: 'disc',
                                        marginLeft: 2,
                                        textAlign: 'justify',
                                        marginBottom:0,
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
                                        <Typography
                                            variant='body1'
                                            gutterBottom
                                        >
                                         Resubmit your proposal through this new process, this ensures all proposals will have the same information, look and feel for DRep reconciliation;
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
                                        <Typography
                                            variant='body1'
                                            gutterBottom
                                        >
                                         Or confirm if you would like Intersect to repurpose the information previously provided. Please note that we may not have enough details to complete the submission on your behalf, and any missing information will be shown as ‘not provided’. You can confirm this by contacting operational-services@intersectmbo.org with the following information:
                                        </Typography>
                                    </ListItem>
                                    <List sx={{
                                        listStyleType: 'disc',
                                        marginLeft: 2,
                                        textAlign: 'justify',
                                        marginBottom: 0,
                                    }}>
                                    <ListItem
                                        sx={{
                                            textAlign: 'justify',
                                            display: 'list-item',
                                            paddingY: 0,
                                            marginY: 0,
                                        }}
                                    >
                                        <Typography
                                            variant='body1'
                                            gutterBottom
                                        >
                                        Proposal Name
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
                                        <Typography
                                            variant='body1'
                                            gutterBottom
                                        >
                                        Proposer Name
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
                                        <Typography
                                            variant='body1'
                                            gutterBottom
                                        >
                                        Intersect Committee that it has been aligned / submitted to
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
                                        <Typography
                                            variant='body1'
                                            gutterBottom
                                        >
                                        Submission Date (approximate)
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
                                        <Typography
                                            variant='body1'
                                            gutterBottom
                                        >
                                        Intersect POC (if known)
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
                                        <Typography
                                            variant='body1'
                                            gutterBottom
                                        >
                                        Brief Proposal Description
                                        </Typography>
                                    </ListItem>
                                    </List>
                                </List>
                                <Typography variant='body1' gutterBottom>
                                   The more information you provide, the better we will be able to help you.
                                </Typography>
                                <Typography variant='body1' gutterBottom>
                                    All proposals will be made public (barring any private contact information). Intersect committees may provide advice or recommendations to help refine or improve your proposal. Committees can support DReps with advice, guidance, and recommendations to aid in their decision-making wherever helpful.
                                </Typography>
                            </Box>
                            <StepperActionButtons 
                                onClose={onClose}
                                onSaveDraft={handleSaveDraft}
                                showSaveDraft={false}
                                showBack={false}
                                onContinue={setStep}
                                selectedDraftId={selectedDraftId}
                                nextStep={step + 1}
                            />
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

export default BudgetDiscussionInfo;
