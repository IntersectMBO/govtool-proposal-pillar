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
import { useDebounce } from '../..//lib/hooks';
import { getBudgetDiscussionDrafts, getBudgetDiscussions } from '../../lib/api';
import { settings } from '../../lib/carouselSettings';
import { useTheme } from '@emotion/react';
import { BudgetDiscussionsCard } from '..';
import { useAppContext } from '../../context/context';

const BudgetDiscussionsList = ({
    currentBudgetDiscussionType = null,
    searchText = '',
    sortType = 'desc',
    isDraft = false,
    statusList = [],
    startEdittinButtonClick = false,
    startEdittingDraft,
    setShowAllActivated = false,
    showAllActivated = false,
    isAllProposalsListEmpty,
    setIsAllProposalsListEmpty,
    filteredBudgetDiscussionTypeList,
    proposalOwnerFilter = null,
}) => {
    const theme = useTheme();
    const sliderRef = useRef(null);

    const [showAll, setShowAll] = useState(false);
    const [budgetDiscussionList, setBudgetDiscussionList] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [mounted, setMounted] = useState(false);
    const debouncedSearchValue = useDebounce(searchText.trim());
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const isXs = useMediaQuery(theme.breakpoints.only('xs'));
    const isSm = useMediaQuery(theme.breakpoints.only('sm'));
    const isMd = useMediaQuery(theme.breakpoints.only('md'));
    const isLg = useMediaQuery(theme.breakpoints.only('lg'));

    const { user } = useAppContext();

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

    const fetchBudgetDiscussions = async (reset = true, page) => {
        try {
            if (isDraft) {
                let bdlist = await getBudgetDiscussionDrafts();
                setBudgetDiscussionList(bdlist.data);
            } else {
                let query = `filters[$and][0][is_active]=true&filters[$and][1][bd_psapb][type_name][id]=${
                    currentBudgetDiscussionType?.id
                }&filters[$and][2][bd_proposal_detail][proposal_name][$containsi]=${
                    debouncedSearchValue || ''
                }${proposalOwnerFilter?.id === 'all-proposals' ? '' : '&filters[$and][3][creator]=' + user?.user?.id}&pagination[page]=${page}&pagination[pageSize]=25&sort[createdAt]=${
                    sortType
                }&populate[0]=bd_costing&populate[1]=bd_psapb.type_name&populate[2]=bd_proposal_detail&populate[3]=creator`;
                const { budgetDiscussions, pgCount, total } =
                    await getBudgetDiscussions(query);

                if (!budgetDiscussions) return;
                if (reset) {
                    setBudgetDiscussionList(budgetDiscussions);
                } else {
                    setBudgetDiscussionList((prev) => [
                        ...prev,
                        ...budgetDiscussions,
                    ]);
                }
                setPageCount(pgCount);
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        if (!mounted) {
            setMounted(true);
        } else {
            fetchBudgetDiscussions(true, 1);
            setCurrentPage(1);
        }
    }, [
        mounted,
        debouncedSearchValue,
        sortType,
        isDraft ? null : statusList,
        showAllActivated,
        currentBudgetDiscussionType,
        proposalOwnerFilter?.id,
    ]);

    useEffect(() => {
        if (shouldRefresh) {
            fetchBudgetDiscussions(true, 1);
            setShouldRefresh(false);
        }
    }, [shouldRefresh]);

    useEffect(() => {
        if (!isDraft) {
            if (budgetDiscussionList?.length === 0) {
                let emptyProposals =
                    isAllProposalsListEmpty?.length > 0
                        ? [...isAllProposalsListEmpty]
                        : [];

                // check if category id is inside this list
                const alreadyInList = emptyProposals.some(
                    (item) => item?.id === currentBudgetDiscussionType?.id
                );
                if (!alreadyInList) {
                    emptyProposals.push({
                        id: currentBudgetDiscussionType?.id,
                        name: currentBudgetDiscussionType?.attributes
                            ?.type_name,
                    });
                    setIsAllProposalsListEmpty(emptyProposals);
                }
            } else {
                let emptyProposals =
                    isAllProposalsListEmpty?.length > 0
                        ? [...isAllProposalsListEmpty]
                        : [];

                // check if category id is inside this list
                const alreadyInList = emptyProposals.some(
                    (item) => item?.id === currentBudgetDiscussionType?.id
                );

                // empty it from the list
                if (alreadyInList) {
                    emptyProposals = emptyProposals.filter(
                        (item) => item?.id !== currentBudgetDiscussionType?.id
                    );
                    setIsAllProposalsListEmpty(emptyProposals);
                }
            }
        }
    }, [
        debouncedSearchValue,
        budgetDiscussionList?.length,
        isAllProposalsListEmpty?.length,
        filteredBudgetDiscussionTypeList?.length,
        isDraft,
    ]);

    return budgetDiscussionList?.length === 0 ? null : (
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
                        {isDraft ? 'Unfinished Drafts' : ''}
                        {currentBudgetDiscussionType?.attributes?.type_name ==
                        'None of these'
                            ? 'No category'
                            : currentBudgetDiscussionType?.attributes
                                  ?.type_name}
                    </Typography>
                    {budgetDiscussionList?.length > 0 &&
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
                                            bd_type:
                                                currentBudgetDiscussionType,
                                        }));
                                    }
                                }}
                                data-testid={
                                    isDraft
                                        ? 'draft-show-all-button'
                                        : currentBudgetDiscussionType
                                                ?.attributes?.type_name ==
                                            'None of these'
                                          ? 'no-category-show-all-button'
                                          : currentBudgetDiscussionType?.attributes?.type_name
                                                .replace(/\s+/g, '-')
                                                .toLowerCase() +
                                            '-show-all-button'
                                }
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
                    budgetDiscussionList?.length > 0 && (
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
            {budgetDiscussionList?.length > 0 ? (
                (
                    showAllActivated ? showAllActivated?.is_activated : showAll
                ) ? (
                    <Box>
                        <Grid container spacing={4} paddingY={4}>
                            {budgetDiscussionList?.map((bd, index) => (
                                <Grid item key={index} xs={12} sm={6} md={4}>
                                    <BudgetDiscussionsCard
                                        budgetDiscussion={bd}
                                        isDraft={isDraft}
                                        startEdittingDraft={startEdittingDraft}
                                        startEdittinButtonClick={
                                            startEdittinButtonClick
                                        }
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
                                        fetchBudgetDiscussions(
                                            false,
                                            currentPage + 1
                                        );
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
                            {budgetDiscussionList?.map((bd, index) => (
                                <Box key={index} height={'100%'}>
                                    <BudgetDiscussionsCard
                                        budgetDiscussion={bd}
                                        isDraft={isDraft}
                                        startEdittingDraft={startEdittingDraft}
                                        startEdittinButtonClick={
                                            startEdittinButtonClick
                                        }
                                    />
                                </Box>
                            ))}

                            {boxesToRender}
                        </Slider>
                    </Box>
                )
            ) : null}
        </Box>
    );
};

export default BudgetDiscussionsList;
