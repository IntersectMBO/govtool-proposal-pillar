'use client';

import {
    IconCheveronLeft,
    IconCheveronRight,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    IconButton,
    Stack,
    Typography,
    alpha,
    useMediaQuery,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import { ProposalCard } from '..';
import { useDebounce } from '../..//lib/hooks';
import { getProposals } from '../../lib/api';
import { settings } from '../../lib/carouselSettings';
import { useTheme } from '@emotion/react';

const ProposalsList = ({
    governanceAction,
    searchText = '',
    sortType = 'desc',
    isDraft = false,
    statusList = [],
    startEdittinButtonClick = false,
    setShowAllActivated = false,
    showAllActivated = false,
}) => {
    const theme = useTheme();
    const sliderRef = useRef(null);

    const [showAll, setShowAll] = useState(false);
    const [proposalsList, setProposalsList] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [mounted, setMounted] = useState(false);
    const debouncedSearchValue = useDebounce(searchText.trim());
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const isXs = useMediaQuery(theme.breakpoints.only('xs'));
    const isSm = useMediaQuery(theme.breakpoints.only('sm'));
    const isMd = useMediaQuery(theme.breakpoints.only('md'));
    const isLg = useMediaQuery(theme.breakpoints.only('lg'));

    let extraBoxes = 0;

    if (isXs) {
        extraBoxes = 0;
    } else if (isSm) {
        extraBoxes = 1;
    } else if (isMd) {
        extraBoxes = 2;
    } else if (isLg) {
        extraBoxes = 2;
    } else {
        extraBoxes = 2;
    }

    const boxesToRender = Array.from({ length: extraBoxes }, (_, index) => (
        <Box key={`extra-${index}`} height={'100%'} />
    ));

    const fetchProposals = async (reset = true, page) => {
        const haveSubmittedFilter = statusList?.some(
            (filter) => filter === 'submitted'
        );

        try {
            let query = '';
            if (isDraft) {
                if (statusList?.length === 0 || statusList?.length === 2) {
                    query = `filters[$and][2][is_draft]=true&pagination[page]=${page}&pagination[pageSize]=25&sort[createdAt]=${sortType}&populate[0]=proposal_links&populate[1]=proposal_withdrawals`;
                } else {
                    const isSubmitted = haveSubmittedFilter ? 'true' : 'false';
                    query = `filters[$and][2][is_draft]=true&filters[$and][3][prop_submitted]=${isSubmitted}&pagination[page]=${page}&pagination[pageSize]=25&sort[createdAt]=${sortType}&populate[0]=proposal_links&populate[1]=proposal_withdrawals`;
                }
            } else {
                if (statusList?.length === 0 || statusList?.length === 2) {
                    query = `filters[$and][0][gov_action_type_id]=${
                        governanceAction?.id
                    }&filters[$and][1][prop_name][$containsi]=${
                        debouncedSearchValue || ''
                    }&pagination[page]=${page}&pagination[pageSize]=25&sort[createdAt]=${sortType}&populate[0]=proposal_links&populate[1]=proposal_withdrawals`;
                } else {
                    const isSubmitted = haveSubmittedFilter ? 'true' : 'false';
                    query = `filters[$and][0][gov_action_type_id]=${
                        governanceAction?.id
                    }&filters[$and][1][prop_name][$containsi]=${
                        debouncedSearchValue || ''
                    }&filters[$and][2][prop_submitted]=${isSubmitted}&pagination[page]=${page}&pagination[pageSize]=25&sort[createdAt]=${sortType}&populate[0]=proposal_links&populate[1]=proposal_withdrawals`;
                }
            }
            const { proposals, pgCount } = await getProposals(query);
            if (!proposals) return;

            if (reset) {
                setProposalsList(proposals);
            } else {
                setProposalsList((prev) => [...prev, ...proposals]);
            }

            setPageCount(pgCount);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!mounted) {
            setMounted(true);
        } else {
            fetchProposals(true, 1);
            setCurrentPage(1);
        }
    }, [
        mounted,
        debouncedSearchValue,
        sortType,
        isDraft ? null : statusList,
        showAllActivated,
    ]);

    useEffect(() => {
        if (shouldRefresh) {
            fetchProposals(true, 1);
            setShouldRefresh(false);
        }
    }, [shouldRefresh]);

    return isDraft && proposalsList?.length === 0 ? null : (
        <Box overflow={'visible'}>
            <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={'space-between'}
            >
                <Box display={'flex'} alignItems={'center'}>
                    <Typography
                        variant='h5'
                        component='h2'
                        color='text.black'
                        marginRight={2}
                    >
                        {isDraft
                            ? 'Unfinished Drafts'
                            : governanceAction?.attributes
                                  ?.gov_action_type_name}
                    </Typography>
                    {proposalsList?.length > 0 &&
                        (setShowAllActivated
                            ? !showAllActivated?.is_activated
                            : true) && (
                            <Button
                                variant='outlined'
                                onClick={() => {
                                    setShowAll((prev) => !prev);
                                    if (setShowAllActivated) {
                                        setShowAllActivated(() => ({
                                            is_activated: true,
                                            gov_action_type: governanceAction,
                                        }));
                                    }
                                }}
                                data-testid='show-all-button'
                            >
                                {setShowAllActivated
                                    ? setShowAllActivated?.is_activated
                                        ? 'Show less'
                                        : 'Show all'
                                    : showAll
                                      ? 'Show less'
                                      : 'Show all'}
                            </Button>
                        )}
                </Box>

                {(setShowAllActivated
                    ? !showAllActivated?.is_activated
                    : !showAll) &&
                    proposalsList?.length > 0 && (
                        <Box display={'flex'} alignItems={'center'}>
                            <IconButton
                                onClick={() => sliderRef.current.slickPrev()}
                            >
                                <IconCheveronLeft width={20} height={20} />
                            </IconButton>
                            <IconButton
                                onClick={() => sliderRef.current.slickNext()}
                            >
                                <IconCheveronRight width={20} height={20} />
                            </IconButton>
                        </Box>
                    )}
            </Box>
            {proposalsList?.length > 0 ? (
                (
                    showAllActivated ? showAllActivated?.is_activated : showAll
                ) ? (
                    <Box>
                        <Grid container spacing={4} paddingY={4}>
                            {proposalsList?.map((proposal, index) => (
                                <Grid item key={index} xs={12} sm={6} md={4}>
                                    <ProposalCard
                                        proposal={proposal}
                                        startEdittinButtonClick={
                                            startEdittinButtonClick
                                        }
                                        setShouldRefresh={setShouldRefresh}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        {currentPage < pageCount && (
                            <Box
                                marginY={2}
                                display={'flex'}
                                justifyContent={'flex-end'}
                            >
                                <Button
                                    onClick={() => {
                                        fetchProposals(false, currentPage + 1);
                                        setCurrentPage((prev) => prev + 1);
                                    }}
                                >
                                    Load more
                                </Button>
                            </Box>
                        )}
                    </Box>
                ) : (
                    <Box py={2}>
                        <Slider ref={sliderRef} {...settings}>
                            {proposalsList?.map((proposal, index) => (
                                <Box key={index} height={'100%'}>
                                    <ProposalCard
                                        proposal={proposal}
                                        startEdittinButtonClick={
                                            startEdittinButtonClick
                                        }
                                        setShouldRefresh={setShouldRefresh}
                                    />
                                </Box>
                            ))}

                            {boxesToRender}
                        </Slider>
                    </Box>
                )
            ) : (
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
                                No proposals found
                            </Typography>
                            <Typography variant='body1' color='text.black'>
                                Please try a different search
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default ProposalsList;
