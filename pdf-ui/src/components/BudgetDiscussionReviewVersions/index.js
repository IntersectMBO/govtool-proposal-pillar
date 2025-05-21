'use client';

import {
    Dialog,
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    IconButton,
} from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';
import {
    IconCheveronLeft,
    IconArchive,
    IconLink,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import {
    correctVoteAdaFormat,
    formatIsoDate,
    formatIsoTime,
    openInNewTab,
} from '../../lib/utils';
import { useEffect, useState } from 'react';
import { getBudgetDiscussionVersions, getCountryList } from '../../lib/api';
import BudgetDiscussionInfoSegment from '../BudgetDiscussionInfoSegment';

const BudgetDiscussionReviewVersions = ({ open, onClose, id }) => {
    const theme = useTheme();
    const openLink = (link) => openInNewTab(link);

    const [versions, setVersions] = useState(null);
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [openVersionsList, setOpenVersionsList] = useState(false);
    const [allCountries, setAllCountries] = useState([]);

    const isSmallScreen = useMediaQuery((theme) =>
        theme.breakpoints.down('md')
    );

    const handleOpenVersionsList = () => setOpenVersionsList(true);
    const handleCloseVersionsList = () => setOpenVersionsList(false);

    const fetchVersions = async () => {
        try {
            const proposals = await getBudgetDiscussionVersions(id);
            if (!proposals) return;

            setVersions(proposals);
            setSelectedVersion(proposals[0]);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!allCountries.length) {
                    const countriesResponse = await getCountryList();
                    setAllCountries(countriesResponse?.data || []);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (open) {
            fetchVersions();
            fetchData();
        }
    }, [open]);

    return (
        <Typography>
            <Dialog
                fullScreen
                open={open}
                onClose={onClose}
                data-testid='review-versions'
            >
                {isSmallScreen && openVersionsList ? (
                    <Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                borderBottom: `1px solid ${theme.palette.border.lightGray}`,
                                paddingBottom: 2,
                                marginX: 2,
                                marginTop: 2,
                                gap: 2,
                            }}
                        >
                            <IconArchive height='24px' width='24px' />
                            <Typography variant='h4' component='h1'>
                                Versions
                            </Typography>
                        </Box>
                        <List>
                            {versions?.map((version, index) => (
                                <ListItem
                                    key={index}
                                    disablePadding
                                    sx={{
                                        backgroundColor:
                                            version?.id === selectedVersion?.id
                                                ? theme.palette.highlight
                                                      .blueGray
                                                : 'transparent',
                                    }}
                                >
                                    <ListItemButton
                                        onClick={() => {
                                            setSelectedVersion(version);
                                            handleCloseVersionsList();
                                        }}
                                        data-testid='review-versions-list-item-button'
                                    >
                                        <ListItemText
                                            primary={
                                                <Box>
                                                    {`${formatIsoDate(
                                                        version?.attributes
                                                            ?.createdAt
                                                    )}  ${formatIsoTime(
                                                        version?.attributes
                                                            ?.createdAt
                                                    )} ${
                                                        version?.attributes
                                                            ?.is_active
                                                            ? ' (Live)'
                                                            : ''
                                                    }`}
                                                </Box>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                ) : (
                    <Grid
                        container
                        sx={{
                            overflow: 'auto',
                            minHeight: 0,
                        }}
                    >
                        <Grid
                            item
                            xs={12}
                            sx={{
                                borderBottom: `1px solid ${theme.palette.border.gray}`,
                                pl: 4,
                                mt: 2,
                            }}
                        >
                            <Typography
                                variant='h4'
                                component='h1'
                                gutterBottom
                            >
                                View Versions
                            </Typography>
                        </Grid>

                        <Grid item xs={12} m={2}>
                            <Button
                                size='small'
                                startIcon={
                                    <IconCheveronLeft
                                        width='18'
                                        height='18'
                                        fill={theme.palette.primary.main}
                                    />
                                }
                                onClick={onClose}
                                data-testid='review-versions-back'
                            >
                                Back
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={2} px={2}>
                                <Grid item xs={2}></Grid>
                                {!isSmallScreen && (
                                    <Grid
                                        item
                                        xs={2}
                                        sx={{
                                            padding: 0,
                                            marginRight: 0,
                                            marginLeft: 2,
                                        }}
                                    >
                                        <Card variant='outlined'>
                                            <CardContent
                                                sx={{
                                                    padding: 0,
                                                    width: '100%',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent:
                                                            'flex-start',
                                                        alignContent: 'center',
                                                        borderBottom: `1px solid ${theme.palette.border.lightGray}`,
                                                        gap: 2,
                                                        m: 2,
                                                        pb: 1,
                                                    }}
                                                >
                                                    <IconArchive
                                                        height='24px'
                                                        width='24px'
                                                    />
                                                    <Typography variant='subtitle1'>
                                                        Versions
                                                    </Typography>
                                                </Box>
                                                {/* Versions */}
                                                <List
                                                    sx={{
                                                        padding: 0,
                                                        maxHeight: '70vh',
                                                        overflowY: 'auto',
                                                    }}
                                                >
                                                    {versions?.map(
                                                        (version, index) => (
                                                            <ListItem
                                                                key={index}
                                                                disablePadding
                                                                sx={{
                                                                    backgroundColor:
                                                                        version?.id ===
                                                                        selectedVersion?.id
                                                                            ? theme
                                                                                  .palette
                                                                                  .highlight
                                                                                  .blueGray
                                                                            : 'transparent',
                                                                }}
                                                            >
                                                                <ListItemButton
                                                                    onClick={() =>
                                                                        setSelectedVersion(
                                                                            version
                                                                        )
                                                                    }
                                                                >
                                                                    <ListItemText
                                                                        primary={
                                                                            <>
                                                                                <div>
                                                                                    {`${formatIsoDate(
                                                                                        version
                                                                                            ?.attributes
                                                                                            ?.createdAt
                                                                                    )}${
                                                                                        version
                                                                                            ?.attributes
                                                                                            ?.is_active
                                                                                            ? ' (Live)'
                                                                                            : ''
                                                                                    }`}
                                                                                </div>
                                                                                <div>
                                                                                    {formatIsoTime(
                                                                                        version
                                                                                            ?.attributes
                                                                                            ?.createdAt
                                                                                    )}
                                                                                </div>
                                                                            </>
                                                                        }
                                                                    />
                                                                </ListItemButton>
                                                            </ListItem>
                                                        )
                                                    )}
                                                </List>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}
                                {/* Selected version content */}
                                <Grid item xs={12} md={6} zIndex={1}>
                                    <Box display={'flex'} width={'100%'} pb={4}>
                                        <Card
                                            variant='outlined'
                                            sx={{ width: '100%' }}
                                        >
                                            <CardContent>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        textAlign: 'justify',
                                                        gap: 2,
                                                    }}
                                                >
                                                    <Typography
                                                        variant='h5'
                                                        gutterBottom
                                                    >
                                                        {
                                                            selectedVersion
                                                                ?.attributes
                                                                ?.content
                                                                ?.attributes
                                                                ?.prop_name
                                                        }
                                                    </Typography>
                                                    {isSmallScreen ? (
                                                        <Box>
                                                            <Typography
                                                                variant='body1'
                                                                color={
                                                                    theme
                                                                        .palette
                                                                        .text
                                                                        .grey
                                                                }
                                                            >
                                                                Version Date
                                                            </Typography>
                                                            <Typography
                                                                variant='body1'
                                                                gutterBottom
                                                            >
                                                                {`${formatIsoDate(
                                                                    selectedVersion
                                                                        ?.attributes
                                                                        ?.content
                                                                        ?.attributes
                                                                        ?.createdAt
                                                                )}${
                                                                    selectedVersion
                                                                        ?.attributes
                                                                        ?.content
                                                                        ?.attributes
                                                                        ?.prop_rev_active
                                                                        ? ' (Live)'
                                                                        : ''
                                                                }`}
                                                            </Typography>
                                                        </Box>
                                                    ) : null}
                                                    <Box>
                                                        <Typography
                                                            variant='h4'
                                                            sx={{
                                                                mb: 2,
                                                            }}
                                                        >
                                                            {
                                                                selectedVersion
                                                                    ?.attributes
                                                                    ?.bd_proposal_detail
                                                                    ?.data
                                                                    ?.attributes
                                                                    ?.proposal_name
                                                            }
                                                        </Typography>

                                                        <Box sx={{ mt: 4 }}>
                                                            <BudgetDiscussionInfoSegment
                                                                question={
                                                                    'Budget category'
                                                                }
                                                                answer={
                                                                    selectedVersion
                                                                        ?.attributes
                                                                        ?.bd_psapb
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.type_name
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.type_name ||
                                                                    ''
                                                                }
                                                            />
                                                        </Box>

                                                        <Box
                                                            sx={{
                                                                mt: 3,
                                                            }}
                                                        >
                                                            <Typography
                                                                variant='h5'
                                                                sx={{
                                                                    mb: 2,
                                                                }}
                                                            >
                                                                Proposal
                                                                Ownership
                                                            </Typography>

                                                            {/* <BudgetDiscussionInfoSegment
                                                                question={
                                                                    'Proposal Public Champion: Who would you like to be the public proposal champion?'
                                                                }
                                                                answer={
                                                                    selectedVersion
                                                                        ?.attributes
                                                                        ?.bd_proposal_ownership
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.proposal_public_champion
                                                                }
                                                            /> */}
                                                            {selectedVersion
                                                                ?.attributes
                                                                ?.bd_proposal_ownership
                                                                ?.data
                                                                ?.attributes
                                                                ?.submited_on_behalf ===
                                                            'Company' ? (
                                                                <Box>
                                                                    <BudgetDiscussionInfoSegment
                                                                        question='Company Name'
                                                                        answer={
                                                                            selectedVersion
                                                                                ?.attributes
                                                                                ?.bd_proposal_ownership
                                                                                ?.data
                                                                                ?.attributes
                                                                                ?.company_name ||
                                                                            ''
                                                                        }
                                                                        answerTestId='company-name-content'
                                                                    />

                                                                    <BudgetDiscussionInfoSegment
                                                                        question='Company Domain Name'
                                                                        answer={
                                                                            selectedVersion
                                                                                ?.attributes
                                                                                ?.bd_proposal_ownership
                                                                                ?.data
                                                                                ?.attributes
                                                                                ?.company_domain_name ||
                                                                            ''
                                                                        }
                                                                        answerTestId='company-domain-name-content'
                                                                    />
                                                                    <BudgetDiscussionInfoSegment
                                                                        question='Country of Incorporation'
                                                                        answer={
                                                                            allCountries?.find(
                                                                                (
                                                                                    country
                                                                                ) =>
                                                                                    country?.id ===
                                                                                    selectedVersion
                                                                                        ?.attributes
                                                                                        ?.bd_proposal_ownership
                                                                                        ?.data
                                                                                        ?.attributes
                                                                                        ?.be_country
                                                                                        ?.data
                                                                                        ?.id
                                                                            )
                                                                                ?.attributes
                                                                                ?.country_name ||
                                                                            'Error'
                                                                        }
                                                                        answerTestId='country-of-incorporation-content'
                                                                    />
                                                                </Box>
                                                            ) : (
                                                                ''
                                                            )}
                                                            {selectedVersion
                                                                ?.attributes
                                                                ?.bd_proposal_ownership
                                                                ?.data
                                                                ?.attributes
                                                                ?.submited_on_behalf ===
                                                            'Group' ? (
                                                                <Box>
                                                                    <BudgetDiscussionInfoSegment
                                                                        question='Group Name'
                                                                        answer={
                                                                            selectedVersion
                                                                                ?.attributes
                                                                                ?.bd_proposal_ownership
                                                                                ?.data
                                                                                ?.attributes
                                                                                ?.group_name ||
                                                                            ''
                                                                        }
                                                                        answerTestId='group-name-content'
                                                                    />

                                                                    <BudgetDiscussionInfoSegment
                                                                        question='Type of Group'
                                                                        answer={
                                                                            selectedVersion
                                                                                ?.attributes
                                                                                ?.bd_proposal_ownership
                                                                                ?.data
                                                                                ?.attributes
                                                                                ?.type_of_group ||
                                                                            ''
                                                                        }
                                                                        answerTestId='group-type-content'
                                                                    />
                                                                    <BudgetDiscussionInfoSegment
                                                                        question='Key Information to Identify
                                                                Group'
                                                                        answer={
                                                                            selectedVersion
                                                                                ?.attributes
                                                                                ?.bd_proposal_ownership
                                                                                ?.data
                                                                                ?.attributes
                                                                                ?.key_info_to_identify_group ||
                                                                            ''
                                                                        }
                                                                        answerTestId='group-identity-information-content'
                                                                    />
                                                                </Box>
                                                            ) : (
                                                                ''
                                                            )}

                                                            <BudgetDiscussionInfoSegment
                                                                question={
                                                                    'What social handles would you like to be used? E.g. Github, X'
                                                                }
                                                                answer={
                                                                    selectedVersion
                                                                        ?.attributes
                                                                        ?.bd_proposal_ownership
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.social_handles
                                                                }
                                                                answerTestId='social-handles'
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
                                                                Problem
                                                                Statements and
                                                                Proposal
                                                                Benefits
                                                            </Typography>

                                                            <BudgetDiscussionInfoSegment
                                                                question={
                                                                    'Problem Statement'
                                                                }
                                                                answer={
                                                                    selectedVersion
                                                                        ?.attributes
                                                                        ?.bd_psapb
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.problem_statement
                                                                }
                                                                answerTestId='problem-statement'
                                                            />

                                                            <BudgetDiscussionInfoSegment
                                                                question={
                                                                    'Proposal Benefit'
                                                                }
                                                                answer={
                                                                    selectedVersion
                                                                        ?.attributes
                                                                        ?.bd_psapb
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.proposal_benefit
                                                                }
                                                                answerTestId='problem-benefit'
                                                            />

                                                            <BudgetDiscussionInfoSegment
                                                                question={
                                                                    'Does this proposal align to the Product Roadmap and Roadmap Goals?'
                                                                }
                                                                answer={
                                                                    selectedVersion
                                                                        ?.attributes
                                                                        ?.bd_psapb
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.roadmap_name
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.roadmap_name
                                                                }
                                                                answerTestId='product-roadmap'
                                                            />
                                                            {selectedVersion
                                                                ?.attributes
                                                                ?.bd_psapb?.data
                                                                ?.attributes
                                                                ?.explain_proposal_roadmap ? (
                                                                <BudgetDiscussionInfoSegment
                                                                    question='Please explain how your proposal supports the Product Roadmap.'
                                                                    answer={
                                                                        selectedVersion
                                                                            ?.attributes
                                                                            ?.bd_psapb
                                                                            ?.data
                                                                            ?.attributes
                                                                            ?.explain_proposal_roadmap ||
                                                                        ''
                                                                    }
                                                                    answerTestId={
                                                                        'explain-roadmap-content'
                                                                    }
                                                                />
                                                            ) : (
                                                                ''
                                                            )}
                                                            <BudgetDiscussionInfoSegment
                                                                question={
                                                                    'Does your proposal align to any of the budget categories?'
                                                                }
                                                                answer={
                                                                    selectedVersion
                                                                        ?.attributes
                                                                        ?.bd_psapb
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.type_name
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.type_name
                                                                }
                                                                answerTestId='budget-discussion-type'
                                                            />

                                                            <BudgetDiscussionInfoSegment
                                                                question={
                                                                    'Does your proposal align with any of the Intersect Committees?'
                                                                }
                                                                answer={
                                                                    selectedVersion
                                                                        ?.attributes
                                                                        ?.bd_psapb
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.committee_name
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.committee_name
                                                                }
                                                                answerTestId='align-proposal-committees'
                                                            />

                                                            <BudgetDiscussionInfoSegment
                                                                question={
                                                                    'If possible provide evidence of wider community endorsement for this proposal?'
                                                                }
                                                                answer={
                                                                    selectedVersion
                                                                        ?.attributes
                                                                        ?.bd_psapb
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.supplementary_endorsement
                                                                }
                                                                answerTestId='evidence'
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
                                                                    selectedVersion
                                                                        ?.attributes
                                                                        ?.bd_proposal_detail
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.proposal_name
                                                                }
                                                                answerTestId='proposal-name'
                                                            />

                                                            <BudgetDiscussionInfoSegment
                                                                question={
                                                                    'Proposal Description'
                                                                }
                                                                answer={
                                                                    selectedVersion
                                                                        ?.attributes
                                                                        ?.bd_proposal_detail
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.proposal_description
                                                                }
                                                                answerTestId='proposal-description'
                                                            />

                                                            <BudgetDiscussionInfoSegment
                                                                question={
                                                                    'Please list any key dependencies (if any) for this proposal?'
                                                                }
                                                                answer={
                                                                    selectedVersion
                                                                        ?.attributes
                                                                        ?.bd_proposal_detail
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.key_dependencies
                                                                }
                                                                answerTestId={`proposal-key-dependencies`}
                                                            />

                                                            <BudgetDiscussionInfoSegment
                                                                question={
                                                                    'How will this proposal be maintained and supported after initial development?'
                                                                }
                                                                answer={
                                                                    selectedVersion
                                                                        ?.attributes
                                                                        ?.bd_proposal_detail
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.maintain_and_support
                                                                }
                                                                answerTestId={`proposal-maintain-and-support`}
                                                            />
                                                            <BudgetDiscussionInfoSegment
                                                                question='How will this proposal be maintained and
                                                                supported after initial development?'
                                                                answer={
                                                                    selectedVersion
                                                                        ?.attributes
                                                                        ?.bd_proposal_detail
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.maintain_and_support ||
                                                                    ''
                                                                }
                                                                answerTestId={
                                                                    'maintain-and-support-content'
                                                                }
                                                            />
                                                            <BudgetDiscussionInfoSegment
                                                                question={
                                                                    'Key Proposal Deliverable(s) and Definition of Done: What tangible milestones or outcomes are to be delivered and what will the community ultimately receive?'
                                                                }
                                                                answer={
                                                                    selectedVersion
                                                                        ?.attributes
                                                                        ?.bd_proposal_detail
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.key_proposal_deliverables
                                                                }
                                                                answerTestId={`proposal-milestone`}
                                                            />

                                                            <BudgetDiscussionInfoSegment
                                                                question={
                                                                    'Resourcing & Duration Estimates: Please provide estimates of team size and duration to achieve the Key Proposal Deliverables outlined above.'
                                                                }
                                                                answer={
                                                                    selectedVersion
                                                                        ?.attributes
                                                                        ?.bd_proposal_detail
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.resourcing_duration_estimates
                                                                }
                                                                answerTestId={`proposal-resources-&-duration-estimates`}
                                                            />

                                                            <BudgetDiscussionInfoSegment
                                                                question={
                                                                    'Experience: Please provide previous experience relevant to complete this project.'
                                                                }
                                                                answer={
                                                                    selectedVersion
                                                                        ?.attributes
                                                                        ?.bd_proposal_detail
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.experience
                                                                }
                                                                answerTestId={`project-experience`}
                                                            />

                                                            <BudgetDiscussionInfoSegment
                                                                question={
                                                                    'Contracting: Please describe how you expect to be contracted.'
                                                                }
                                                                answer={
                                                                    selectedVersion
                                                                        ?.attributes
                                                                        ?.bd_proposal_detail
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.contract_type_name
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.contract_type_name
                                                                }
                                                                answerTestId={`proposal-contracting`}
                                                            />
                                                            {selectedVersion
                                                                ?.attributes
                                                                ?.bd_proposal_detail
                                                                ?.data
                                                                ?.attributes
                                                                ?.contract_type_name
                                                                ?.data
                                                                ?.attributes
                                                                ?.contract_type_name ===
                                                                'Other' && (
                                                                <BudgetDiscussionInfoSegment
                                                                    question='Please describe what you have in mind.'
                                                                    answer={
                                                                        selectedVersion
                                                                            ?.attributes
                                                                            ?.bd_proposal_detail
                                                                            ?.data
                                                                            ?.attributes
                                                                            ?.other_contract_type
                                                                    }
                                                                    answerTestId={`other-contract-description`}
                                                                />
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
                                                                Costing
                                                            </Typography>

                                                            <BudgetDiscussionInfoSegment
                                                                question={
                                                                    'ADA Amount'
                                                                }
                                                                answer={`₳ ${correctVoteAdaFormat(
                                                                    selectedVersion
                                                                        ?.attributes
                                                                        ?.bd_costing
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.ada_amount ||
                                                                        0
                                                                )}`}
                                                                answerTestId={`costing-amount`}
                                                            />

                                                            <BudgetDiscussionInfoSegment
                                                                question={
                                                                    'ADA to USD Conversion Rate'
                                                                }
                                                                answer={
                                                                    selectedVersion
                                                                        ?.attributes
                                                                        ?.bd_costing
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.usd_to_ada_conversion_rate
                                                                }
                                                                answerTestId={`costing-conversion-rate`}
                                                            />

                                                            <BudgetDiscussionInfoSegment
                                                                question={
                                                                    'Preferred currency'
                                                                }
                                                                answer={
                                                                    selectedVersion
                                                                        ?.attributes
                                                                        ?.bd_costing
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.preferred_currency
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.currency_name
                                                                }
                                                                answerTestId={`costing-preferred-currency`}
                                                            />

                                                            <BudgetDiscussionInfoSegment
                                                                question={
                                                                    'Amount in preferred currency'
                                                                }
                                                                answer={correctVoteAdaFormat(
                                                                    selectedVersion
                                                                        ?.attributes
                                                                        ?.bd_costing
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.amount_in_preferred_currency ||
                                                                        0
                                                                )}
                                                                answerTestId={`costing-preferred-currency-amount`}
                                                            />

                                                            <BudgetDiscussionInfoSegment
                                                                question={
                                                                    'Cost breakdown'
                                                                }
                                                                answer={
                                                                    selectedVersion
                                                                        ?.attributes
                                                                        ?.bd_costing
                                                                        ?.data
                                                                        ?.attributes
                                                                        ?.cost_breakdown
                                                                }
                                                                answerTestId={`cost-breakdown`}
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
                                                                Further
                                                                information
                                                            </Typography>
                                                            {selectedVersion
                                                                ?.attributes
                                                                ?.bd_further_information
                                                                ?.data
                                                                ?.attributes
                                                                ?.proposal_links
                                                                ?.length >
                                                                0 && (
                                                                <Box mt={4}>
                                                                    <Typography
                                                                        variant='caption'
                                                                        sx={{
                                                                            color: (
                                                                                theme
                                                                            ) =>
                                                                                theme
                                                                                    ?.palette
                                                                                    ?.text
                                                                                    ?.grey,
                                                                        }}
                                                                    >
                                                                        Supporting
                                                                        links
                                                                    </Typography>

                                                                    <Box>
                                                                        {selectedVersion?.attributes?.bd_further_information?.data?.attributes?.proposal_links?.map(
                                                                            (
                                                                                item,
                                                                                index
                                                                            ) =>
                                                                                item?.prop_link && (
                                                                                    <Button
                                                                                        key={
                                                                                            index
                                                                                        }
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
                                                                Administration
                                                                and Auditing
                                                            </Typography>

                                                            <BudgetDiscussionInfoSegment
                                                                question={
                                                                    'Would you like Intersect to be your named Administrator, including acting as the auditor, as per the Cardano Constitution?*'
                                                                }
                                                                answer={
                                                                    selectedVersion
                                                                        ?.attributes
                                                                        ?.intersect_named_administrator
                                                                        ? 'Yes'
                                                                        : 'No'
                                                                }
                                                                answerTestId={`include-as-auditor`}
                                                            />
                                                            {selectedVersion
                                                                ?.attributes
                                                                ?.intersect_named_administrator ? (
                                                                ''
                                                            ) : (
                                                                <BudgetDiscussionInfoSegment
                                                                    question='Please provide further information to help inform DReps. Who is the vendor and what services are they providing?'
                                                                    answer={
                                                                        selectedVersion
                                                                            ?.attributes
                                                                            ?.intersect_admin_further_text ||
                                                                        ''
                                                                    }
                                                                    answerTestId={
                                                                        'intersect-admin-further-text'
                                                                    }
                                                                />
                                                            )}
                                                        </Box>
                                                    </Box>
                                                </Box>

                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection:
                                                            isSmallScreen
                                                                ? 'column'
                                                                : 'row',
                                                        justifyContent:
                                                            'space-between',
                                                        mt: 10,
                                                    }}
                                                >
                                                    <Box>
                                                        <Button
                                                            variant='outlined'
                                                            sx={{
                                                                mb: {
                                                                    xs: 2,
                                                                    md: 0,
                                                                },
                                                            }}
                                                            onClick={onClose}
                                                            data-testid='back-button'
                                                        >
                                                            Back to Proposal
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>

                                        {isSmallScreen && (
                                            <Box
                                                ml={2}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    backgroundColor:
                                                        theme.palette.iconButton
                                                            .lightPeriwinkle,
                                                    borderRadius: '16px',
                                                    width: '40px',
                                                    height: '40px',
                                                    boxShadow:
                                                        '0px 4px 15px 0px #DDE3F5',
                                                }}
                                            >
                                                <IconButton
                                                    onClick={
                                                        handleOpenVersionsList
                                                    }
                                                    data-testid='versions-button'
                                                >
                                                    <IconArchive />
                                                </IconButton>
                                            </Box>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </Dialog>
        </Typography>
    );
};

export default BudgetDiscussionReviewVersions;
