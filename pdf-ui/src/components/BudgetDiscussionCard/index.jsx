'use client';

import {
    IconChatAlt,
    IconInformationCircle,
    IconLink,
    IconPencilAlt,
    IconShare,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import {
    Badge,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    IconButton,
    Menu,
    Stack,
    Tooltip,
    Typography,
    alpha,
    styled,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { useTheme } from '@emotion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/context';
import { formatIsoDate } from '../../lib/utils';
import EditProposalDialog from '../EditProposalDialog';
import MarkdownTextComponent from '../MarkdownTextComponent';

const BudgetDiscussionCard = ({
    budgetDiscussion,
    isDraft = false,
    startEdittinButtonClick = false,
    setShouldRefresh = false,
    startEdittingDraft,
}) => {
    
    const { user } = useAppContext();
    const navigate = useNavigate();
    const theme = useTheme();

    const [openEditDialog, setOpenEditDialog] = useState(false);

    const [budgetDiscussionLink, setBudgetDiscussionLink] = useState('');

    useEffect(() => {
        let domain = new URL(window.location.href);
        let origin = domain.origin;
        setBudgetDiscussionLink(`${origin}/budget_discussion/`);
    }, [budgetDiscussionLink]);

    const handleEditProposal = () => {
        // pokrenuti popunjavanje sa predefinisam podacime ... ne edit 
        // setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        // zatvori stepper za edit
      //  setOpenEditDialog(false);
    };

    const filterProps = ({ draft, submitted, ...rest }) => rest;

    const CardStatusBadge = styled(({ draft, submitted, ...rest }) => (
        <Badge {...filterProps(rest)} />
    ))(({ theme, draft = false, submitted = false }) => ({
        width: '100%',
        height: '100%',
        '& .MuiBadge-badge': {
            transform: 'translate(-25px, -15px)',
            color: submitted
                ? 'white'
                : draft
                  ? theme.palette.text.black
                  : theme.palette.badgeColors.success_text,
            backgroundColor: submitted
                ? theme.palette.badgeColors.grey
                : draft
                  ? theme.palette.badgeColors.lightPurple
                  : theme.palette.badgeColors.success,
            padding: '14px 12px',
            borderRadius: 100,
        },
    }));

    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            transform: 'translate(40px, -30px) !important',
            color: 'white !important',
            backgroundColor: `${theme.palette.badgeColors.error} !important`,
            padding: 'unset !important',
            borderRadius: 'none !important',
        },
    }));

    const CardContentComponent = ({ budgetDiscussion }) => {
        const disableShareClick = () => {
            setDisableShare(true);
            setTimeout(() => {
                setDisableShare(false);
            }, 2000);
        };

        function copyToClipboard(value) {
            navigator.clipboard.writeText(value);
        }

        const [shareAnchorEl, setShareAnchorEl] = useState(null);
        const [disableShare, setDisableShare] = useState(false);
        const openShare = Boolean(shareAnchorEl);
        const handleShareClick = (event) => {
            setShareAnchorEl(event.currentTarget);
        };

        const handleShareClose = () => {
            setShareAnchorEl(null);
        };
        return (
            <Card
                raised
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    backgroundColor: alpha('#FFFFFF', 0.3),
                    minHeight: '400px',
                }}
                
                data-testid={`budget-discussion-`+
                        (budgetDiscussion?.attributes?.bd_psapb?.data?.attributes?.type_name?.data?.attributes?.type_name =='None of these'
                        ? 'no-category'
                        : budgetDiscussion?.attributes?.bd_psapb?.data?.attributes?.type_name?.data?.attributes?.type_name.replace(/\s+/g, '-').toLowerCase())
                    +`-card`}
                  
            > 
                <CardHeader
                    action={isDraft ? null : (
                            <>
                                <Tooltip title='Share'>
                                    <IconButton
                                        id='share-button-card'
                                        sx={{
                                            width: 40,
                                            height: 40,
                                        }}
                                        aria-controls={
                                            openShare
                                                ? 'share-menu-card'
                                                : undefined
                                        }
                                        aria-haspopup='true'
                                        aria-expanded={
                                            openShare ? 'true' : undefined
                                        }
                                        onClick={handleShareClick}
                                        data-testid={`budget-discussion-${budgetDiscussion.id}-share-button`}
                                    >
                                        <IconShare
                                            width='24'
                                            height='24'
                                            fill={
                                                openShare
                                                    ? theme?.palette?.primary
                                                          ?.main
                                                    : theme?.palette?.primary
                                                          ?.icons?.black
                                            }
                                        />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    id='share-menu-card'
                                    anchorEl={shareAnchorEl}
                                    open={openShare}
                                    onClose={handleShareClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'share-button-card',
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
                                            sx={{ marginTop: '0 !important' }}
                                        >
                                            <IconButton
                                                onClick={() => {
                                                    copyToClipboard(
                                                        `${budgetDiscussionLink}${budgetDiscussion?.id}`
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
                                                            ? theme?.palette
                                                                  ?.primary
                                                                  ?.main
                                                            : theme?.palette
                                                                  ?.primary
                                                                  ?.icons?.grey
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
                                                        theme.palette.text
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
                            </>
                        )
                    }
                    title={
                        <>
                            <Typography
                                variant='h6'
                                component='h3'
                                sx={{
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 2,
                                    lineClamp: 2,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                                data-testid={`budget-discussion-title`}
                            >
                                {isDraft?
                                   budgetDiscussion?.attributes?.draft_data?.bd_proposal_detail?.proposal_name
                                   :budgetDiscussion?.attributes?.bd_proposal_detail?.data?.attributes?.proposal_name
                                   
                                }
                            </Typography>
                            {budgetDiscussion?.attributes?.creator?.data?.attributes?.govtool_username?
                                    <Typography
                                variant='body2'
                                component={'h5'}
                                sx={{
                                    color: (theme) =>
                                        theme?.palette?.text?.darkPurple,
                                }}
                                mt={1}
                            >
                                {}
                                @{budgetDiscussion?.attributes?.creator?.data?.attributes?.govtool_username || ''}
                            </Typography>:null}
                        </>
                    }
                />
                <CardContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                    }}
                >
                    <Box
                        display={'flex'}
                        flexDirection={'column'}
                        gap={2}
                        mb={3}
                    >
                        <Box>
                            <Typography
                                variant='caption'
                                component='p'
                                color='text.grey'
                            >
                                Proposal benefit
                            </Typography>
                            <div data-testid='proposal-benefit'>
                            <MarkdownTextComponent
                                markdownText={
                                    isDraft? budgetDiscussion?.attributes?.draft_data?.bd_psapb?.proposal_benefit
                                    :budgetDiscussion?.attributes?.bd_psapb?.data?.attributes?.proposal_benefit
                                
                                }
                            /> 
                            </div>
                        </Box>
                        <Box>
                            <Typography
                                variant='caption'
                                component='p'
                                color='text.grey'
                            >
                                Budget Requested
                            </Typography>
                            <Typography
                                variant='body2'
                                component='p'
                                color='text.darkPurple'
                                data-testid='budget-requested-amount'
                            >₳ {
                                isDraft? budgetDiscussion?.attributes?.draft_data?.bd_costing?.ada_amount
                                :budgetDiscussion?.attributes?.bd_costing?.data?.attributes?.ada_amount
                                || ''}
                            </Typography>
                        </Box>
                    </Box>
                    <Box
                        display={'flex'}
                        flexDirection={'column'}
                        mt={'auto'}
                        gap={3}
                        pt={3}
                    >
                        <Box
                            display={'flex'}
                            flexDirection={'row'}
                            alignItems={'center'}
                            gap={1}
                            py={1}
                            px={1}
                            sx={{
                                backgroundColor: (theme) =>
                                    theme.palette.divider.primary,
                                borderRadius: '14px',
                            }}
                        >
                            <Tooltip title={'Proposal Date'}>
                                <Box display={'flex'} alignItems={'center'}>
                                    <IconInformationCircle
                                        color={
                                            theme.palette.primary.icons.black
                                        }
                                    />
                                </Box>
                            </Tooltip>
                            <Typography
                                variant='body2'
                                component='p'
                                color='text.black'
                                data-testid={
                                        isDraft
                                        ? 'not-submitted-text'
                                        : 'proposed-date-wrapper'
                                }
                            >
                                {isDraft
                                    ? 'Not submitted'
                                    : `Proposed on: `}
                                {!isDraft && (                                    
                                    <span data-testid='proposed-date'>
                                        {formatIsoDate(
                                            budgetDiscussion?.attributes?.createdAt
                                        )}
                                    </span>
                                )}
                            </Typography>
                        </Box>
                        <Box
                            display={'flex'}
                            flexDirection={'row'}
                            justifyContent={'space-between'}
                            gap={2}
                        >
                            {isDraft ? null : (
                                <Box display={'flex'} gap={1}>
                                    <Tooltip title={'Comments Number'}>
                                        <Box
                                            display={'flex'}
                                            alignItems={'center'}
                                        >
                                            <IconButton
                                               // data-testid={`proposal-${proposal?.id}-comment-count`}
                                                disabled={true}
                                            >
                                                <StyledBadge
                                                    badgeContent={
                                                        budgetDiscussion?.attributes
                                                            ?.prop_comments_number || 0                                                       
                                                    }
                                                    aria-label='comments'
                                                    showZero
                                                ></StyledBadge>
                                                <IconChatAlt />
                                            </IconButton>
                                        </Box>
                                    </Tooltip>
                                    {user &&
                                        user?.user?.id?.toString() ===
                                            budgetDiscussion?.creator?.atributes?.user_id?.toString() &&
                                          (
                                            <Tooltip title='Edit'>
                                                <IconButton
                                                    aria-label='edit'
                                                    onClick={handleEditProposal}
                                                   // data-testid={`proposal-${proposal?.id}-edit-button`}
                                                >
                                                    <IconPencilAlt />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                </Box>
                            )}

                            {isDraft ? (
                                <Button
                                    variant='contained'
                                    fullWidth
                                    onClick={() => startEdittingDraft(budgetDiscussion)}
                                    data-testid={`draft-`+budgetDiscussion?.id+`-start-editing`}
                                >
                                    Start Editing
                                </Button>
                            ) : (
                                <Box flexGrow={1}>
                                    <Link
                                        to={`/budget_discussion/${budgetDiscussion?.id}`}
                                        data-testid={`budget-discussion-`+
                                            (budgetDiscussion?.attributes?.bd_psapb?.data?.attributes?.type_name?.data?.attributes?.type_name =='None of these'
                                            ? 'no-category'
                                            : budgetDiscussion?.attributes?.bd_psapb?.data?.attributes?.type_name?.data?.attributes?.type_name.replace(/\s+/g, '-').toLowerCase())
                                        +`-view-details-link-wrapper`}
                                    >
                                        <Button
                                            variant='contained'
                                            data-testid={`budget-discussion-`+
                                                (budgetDiscussion?.attributes?.bd_psapb?.data?.attributes?.type_name?.data?.attributes?.type_name =='None of these'
                                                ? 'no-category'
                                                : budgetDiscussion?.attributes?.bd_psapb?.data?.attributes?.type_name?.data?.attributes?.type_name.replace(/\s+/g, '-').toLowerCase())
                                            +`-view-details`}
                                            fullWidth
                                        >
                                            View Details
                                        </Button>
                                    </Link>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        );
    };

    return isDraft ? (
        <div
            // data-testid={
            //     proposal?.attributes?.content?.attributes?.is_draft
            //         ? `draft-${proposal?.id}-card`
            //         : `proposal-${
            //               proposal?.attributes?.content?.attributes
            //                   ?.gov_action_type?.attributes
            //                   ?.gov_action_type_name
            //                   ? proposal?.attributes?.content?.attributes?.gov_action_type?.attributes?.gov_action_type_name?.toLowerCase()
            //                   : ''
            //           }-card`
            //}
            style={{
                height: '100%',
            }}
        >
            <CardStatusBadge
                badgeContent='Draft'
                aria-label='draft-status-badge'
                showZero
                draft={true}
                slotProps={{
                    badge: {
                       // 'data-testid': `proposal-${proposal?.id}-status`,
                    },
                }}
            >
                <CardContentComponent budgetDiscussion={budgetDiscussion} />
            </CardStatusBadge>
        </div>
    ) : (
        <div
            // data-testid={
            //     proposal?.attributes?.content?.attributes?.is_draft
            //         ? `draft-${proposal?.id}-card`
            //         : `proposal-${
            //               proposal?.attributes?.content?.attributes
            //                   ?.gov_action_type?.attributes
            //                   ?.gov_action_type_name
            //                   ? proposal?.attributes?.content?.attributes?.gov_action_type?.attributes?.gov_action_type_name?.toLowerCase()
            //                   : ''
            //           }-card`
            // }
            style={{
                height: '100%',
            }}
        >
            <CardStatusBadge
                // badgeContent={
                //     proposal?.attributes?.content?.attributes?.prop_submitted
                //         ? 'Submitted for vote'
                //         : 'Active'
                // }
                aria-label='status-badge'
                submitted={
                 //   proposal?.attributes?.content?.attributes?.prop_submitted
                 //</div>       ? true
                   //     : false
                   false
                }
                showZero
                // slotProps={{
                //     badge: {
                //         'data-testid': `proposal-${proposal?.id}-status`,
                //     },
                // }}
            >
                <CardContentComponent budgetDiscussion={budgetDiscussion} />
            </CardStatusBadge>

            {openEditDialog && (
                <Box>Edit</Box>
                // <EditProposalDialog
                //     proposal={proposal}
                //     openEditDialog={openEditDialog}
                //     handleCloseEditDialog={handleCloseEditDialog}
                //     setMounted={() => {}}
                //     onUpdate={() =>
                //         navigate(`/proposal_discussion/${proposal?.id}`)
                //     }
                //     setShouldRefresh={setShouldRefresh}
                // />
            )}
        </div>
    );
};

export default BudgetDiscussionCard;
