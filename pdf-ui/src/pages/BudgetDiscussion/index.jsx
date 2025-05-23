'use client';

import { useTheme } from '@emotion/react';
import {
    IconFilter,
    IconSearch,
    IconPlusCircle,
    IconArrowLeft,
    IconArrowDown,
    IconArrowUp,
    IconSort,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import {
    Box,
    Checkbox,
    FormControlLabel,
    Grid,
    InputAdornment,
    Menu,
    MenuItem,
    TextField,
    Typography,
    Button,
    Divider,
    Card,
    CardContent,
    Stack,
    alpha,
    Radio,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getBudgetDiscussionTypes } from '../../lib/api';
import {
    CreateBudgetDiscussionDialog,
    BudgetDiscussionsList,
    SearchInput,
} from '../../components';
import { useAppContext } from '../../context/context';
import { loginUserToApp } from '../../lib/helpers';
import { useLocation } from 'react-router-dom';
import { ScrollToTop, useDebounce } from '../../lib/hooks';

let proposalsOwnersList = [{ id: 'all-proposals', label: 'All Proposals' }];
let sortOptions = [
    { fieldId: 'createdAt', type: 'DESC', title: 'Newest' },
    { fieldId: 'createdAt', type: 'ASC', title: 'Oldest' },
    { fieldId: 'prop_comments_number', type: 'DESC', title: 'Most comments' },
    { fieldId: 'prop_comments_number', type: 'ASC', title: 'Least comments' },
    {
        fieldId: 'bd_proposal_detail][proposal_name',
        type: 'ASC',
        title: 'Name A-Z',
    },
    {
        fieldId: 'bd_proposal_detail][proposal_name',
        type: 'DESC',
        title: 'Name Z-A',
    },
    {
        fieldId: 'creator][govtool_username',
        type: 'ASC',
        title: 'Proposer A-Z',
    },
    {
        fieldId: 'creator][govtool_username',
        type: 'DESC',
        title: 'Proposer Z-A',
    },
];

const ProposedBudgetDiscussion = () => {
    const location = useLocation();
    const theme = useTheme();
    const {
        user,
        walletAPI,
        setOpenUsernameModal,
        setUser,
        clearStates,
        addSuccessAlert,
        addErrorAlert,
        addChangesSavedAlert,
    } = useAppContext();

    const defaultOwnerFilterId = 'all-proposals';
    const defaultOwnerFilter = proposalsOwnersList?.find(
        (f) => f?.id === defaultOwnerFilterId
    );

    const [budgetDiscussionSearchText, setBudgetDiscussionSearchText] =
        useState('');
    const [sortType, setSortType] = useState(sortOptions[0]);
    const [budgetDiscussionTypeList, setBudgetDiscussionTypeList] = useState(
        []
    );
    const [
        filteredBudgetDiscussionTypeList,
        setFilteredBudgetDiscussionTypeList,
    ] = useState([]);
    const [proposalsOwnerFilter, setProposalsOwnerFilter] =
        useState(defaultOwnerFilter);

    const [showCreateBDDialog, setShowCreateBDDialog] = useState(false);
    const [
        filteredBudgetDiscussionStatusList,
        setFilteredBudgetDiscussionStatusList,
    ] = useState(['active']);
    const [filtersAnchorEl, setFiltersAnchorEl] = useState(null);
    const [showAllActivated, setShowAllActivated] = useState({
        is_activated: false,
        bd_type: null,
    });
    const [sortAnchorEl, setSortAnchorEl] = useState(null);

    const [isAllProposalsListEmpty, setIsAllProposalsListEmpty] = useState([]);

    const openFilters = Boolean(filtersAnchorEl);
    const openSort = Boolean(sortAnchorEl);
    const handleFiltersClick = (event) => {
        setFiltersAnchorEl(event.currentTarget);
    };
    const handleCloseFilters = () => {
        setFiltersAnchorEl(null);
    };

    const handleSortClick = (event) => {
        setSortAnchorEl(event.currentTarget);
    };
    const handleSortClose = () => {
        setSortAnchorEl(null);
    };
    const fetchBudgetDiscussionTypes = async () => {
        try {
            let response = await getBudgetDiscussionTypes();
            if (!response?.data) return;
            setBudgetDiscussionTypeList(response?.data);
        } catch (error) {
            console.error(error);
        }
    };

    const toggleActionFilter = (action) => {
        let filterExist = filteredBudgetDiscussionTypeList?.some(
            (filter) => filter?.id === action?.id
        );

        let updatedList;
        if (filterExist) {
            updatedList = filteredBudgetDiscussionTypeList.filter(
                (filter) => filter?.id !== action?.id
            );
        } else {
            updatedList = [...filteredBudgetDiscussionTypeList, action];
        }

        updatedList.sort((a, b) => a?.id - b?.id);

        setFilteredBudgetDiscussionTypeList(updatedList);
    };

    const toggleProposalsOwnersFilter = (e) => {
        const propOwnerFilterId = e?.target?.value?.toString();
        let propOwnerFilter = proposalsOwnersList?.find(
            (f) => f?.id?.toString() === propOwnerFilterId
        );

        if (propOwnerFilter) {
            setProposalsOwnerFilter(propOwnerFilter);
        }
    };

    const resetFilters = () => {
        setFilteredBudgetDiscussionTypeList([]);
        handleCloseFilters();
        setShowAllActivated({
            is_activated: false,
            bd_type: null,
        });
        setProposalsOwnerFilter(defaultOwnerFilter);
    };

    useEffect(() => {
        if (budgetDiscussionTypeList.length == 0) fetchBudgetDiscussionTypes();
    }, []);

    useEffect(() => {
        if (showAllActivated?.is_activated) {
            setFilteredBudgetDiscussionTypeList([showAllActivated?.bd_type]);
        } else {
            setFilteredBudgetDiscussionTypeList([]);
        }
    }, [showAllActivated]);

    useEffect(() => {
        if (location.pathname.includes('propose')) {
            if (user?.user?.govtool_username) {
                setShowCreateBDDialog(true);
            } else {
                setOpenUsernameModal({ open: true, callBackFn: () => {} });
            }
        }
    }, [location.pathname]);

    const allEmptyMatchBudget =
        isAllProposalsListEmpty?.length > 0 &&
        filteredBudgetDiscussionTypeList?.length === 0
            ? budgetDiscussionTypeList.every((budget) =>
                  isAllProposalsListEmpty.some(
                      (empty) => empty?.id === budget?.id
                  )
              )
            : false;

    const allFilteredAreEmpty =
        isAllProposalsListEmpty?.length > 0 &&
        filteredBudgetDiscussionTypeList?.length > 0
            ? filteredBudgetDiscussionTypeList.every((filtered) =>
                  isAllProposalsListEmpty.some(
                      (empty) => empty?.id === filtered?.id
                  )
              )
            : false;

    const showNoProposals = allEmptyMatchBudget || allFilteredAreEmpty;

    useEffect(() => {
        if (user?.user?.id) {
            if (proposalsOwnersList?.find((f) => f?.id === 'my-proposals'))
                return;
            proposalsOwnersList?.push({
                id: 'my-proposals',
                label: 'My Proposals',
            });
        } else {
            if (proposalsOwnersList?.find((f) => f?.id === 'my-proposals')) {
                proposalsOwnersList = proposalsOwnersList.filter(
                    (f) => f?.id === 'my-proposals'
                );
            }
        }
    }, [user?.user?.id]);

    return (
        <Box sx={{ mt: 3 }}>
            <ScrollToTop step={showAllActivated?.is_activated} />
            <Grid container spacing={3} flexDirection={'column'}>
                <Grid item display={'flex'} flexDirection={'row'} xs={12}>
                    <Grid
                        container
                        alignItems={'center'}
                        justifyContent={'space-between'}
                        spacing={1}
                    >
                        {!walletAPI?.address && (
                            <Grid item xs={12} paddingBottom={2}>
                                <Typography variant='h4' component='h1'>
                                    Budget Proposals
                                </Typography>
                            </Grid>
                        )}

                        {showAllActivated?.is_activated && (
                            <Grid item xs={12} paddingBottom={2}>
                                <Button
                                    variant='text'
                                    startIcon={
                                        <IconArrowLeft
                                            fill={theme?.palette?.primary?.main}
                                        />
                                    }
                                    onClick={() => {
                                        setShowAllActivated({
                                            is_activated: false,
                                            bd_type: null,
                                        });
                                    }}
                                    data-testid='back-to-budget-proposals-button'
                                >
                                    Back to Budget Proposals
                                </Button>
                            </Grid>
                        )}

                        {walletAPI && (
                            <Grid item xs={12} paddingBottom={2}>
                                <Button
                                    variant='contained'
                                    onClick={async () =>
                                        await loginUserToApp({
                                            wallet: walletAPI,
                                            setUser: setUser,
                                            setOpenUsernameModal:
                                                setOpenUsernameModal,
                                            callBackFn: () =>
                                                setShowCreateBDDialog(true),
                                            clearStates: clearStates,
                                            addErrorAlert: addErrorAlert,
                                            addSuccessAlert: addSuccessAlert,
                                            addChangesSavedAlert:
                                                addChangesSavedAlert,
                                        })
                                    }
                                    startIcon={<IconPlusCircle fill='white' />}
                                    data-testid='propose-a-budget-discussion-button'
                                >
                                    Submit proposal for Cardano budget
                                </Button>
                            </Grid>
                        )}

                        <Grid item md={6} sx={{ flexGrow: { xs: 1 } }}>
                            <SearchInput
                                onDebouncedChange={
                                    setBudgetDiscussionSearchText
                                }
                                placeholder='Search...'
                            />
                        </Grid>
                        <Grid item>
                            <Box gap={1} display={'flex'}>
                                <Button
                                    variant='outlined'
                                    onClick={handleFiltersClick}
                                    endIcon={
                                        <IconFilter
                                            color={
                                                theme.palette.primary.icons
                                                    .black
                                            }
                                        />
                                    }
                                    id='filters-button'
                                    data-testid='filter-button'
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: '20px',
                                        padding: '8px 16px',
                                        borderColor: 'primary.main',
                                        color: 'text.primary',
                                        '&:hover': {
                                            backgroundColor: 'action.hover',
                                        },
                                    }}
                                    aria-controls={
                                        openFilters ? 'filters-menu' : undefined
                                    }
                                    aria-haspopup='true'
                                    aria-expanded={
                                        openFilters ? 'true' : undefined
                                    }
                                >
                                    Filter:
                                </Button>
                                <Menu
                                    id='filters-menu'
                                    anchorEl={filtersAnchorEl}
                                    open={openFilters}
                                    onClose={handleCloseFilters}
                                    MenuListProps={{
                                        'aria-labelledby': 'filters-button',
                                    }}
                                    slotProps={{
                                        paper: {
                                            elevation: 4,
                                            sx: {
                                                overflow: 'visible',
                                                mt: 1,
                                                minWidth: '300px',
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
                                    <Box px={2}>
                                        {!showAllActivated?.is_activated && (
                                            <Box>
                                                <Typography
                                                    variant='body1'
                                                    sx={{
                                                        mb: 1,
                                                    }}
                                                >
                                                    Budget categories
                                                </Typography>
                                                <Divider
                                                    sx={{
                                                        color: (theme) => ({
                                                            borderColor:
                                                                theme.palette
                                                                    .border
                                                                    .lightGray,
                                                        }),
                                                    }}
                                                />
                                                {budgetDiscussionTypeList?.map(
                                                    (ga, index) => (
                                                        <MenuItem
                                                            key={`${ga?.attributes?.type_name}-${index}`}
                                                            selected={filteredBudgetDiscussionTypeList?.some(
                                                                (filter) =>
                                                                    filter?.id ===
                                                                    ga?.id
                                                            )}
                                                            id={`${ga?.attributes?.type_name}-radio-wrapper`}
                                                            data-testid={
                                                                (ga?.attributes
                                                                    ?.type_name ==
                                                                'None of these'
                                                                    ? 'no-category'
                                                                    : ga?.attributes?.type_name
                                                                          .replace(
                                                                              /\s+/g,
                                                                              '-'
                                                                          )
                                                                          .toLowerCase()) +
                                                                `-radio-wrapper`
                                                            }
                                                        >
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        onChange={() =>
                                                                            toggleActionFilter(
                                                                                ga
                                                                            )
                                                                        }
                                                                        checked={filteredBudgetDiscussionTypeList?.some(
                                                                            (
                                                                                filter
                                                                            ) =>
                                                                                filter?.id ===
                                                                                ga?.id
                                                                        )}
                                                                        id={`${ga?.attributes?.type_name}-radio`}
                                                                        data-testid={
                                                                            (ga
                                                                                ?.attributes
                                                                                ?.type_name ==
                                                                            'None of these'
                                                                                ? 'no-category'
                                                                                : ga?.attributes?.type_name
                                                                                      .replace(
                                                                                          /\s+/g,
                                                                                          '-'
                                                                                      )
                                                                                      .toLowerCase()) +
                                                                            `-radio`
                                                                        }
                                                                    />
                                                                }
                                                                label={
                                                                    ga
                                                                        ?.attributes
                                                                        ?.type_name ===
                                                                    'None of these'
                                                                        ? 'No category'
                                                                        : ga
                                                                              ?.attributes
                                                                              ?.type_name
                                                                }
                                                            />
                                                        </MenuItem>
                                                    )
                                                )}
                                            </Box>
                                        )}
                                        <Typography
                                            variant='body1'
                                            sx={{
                                                mb: 1,
                                            }}
                                        >
                                            Proposals owners
                                        </Typography>
                                        <Divider
                                            sx={{
                                                color: (theme) => ({
                                                    borderColor:
                                                        theme.palette.border
                                                            .lightGray,
                                                }),
                                            }}
                                        />

                                        {proposalsOwnersList?.map(
                                            (ga, index) => (
                                                <MenuItem
                                                    key={`${ga?.id}-${index}`}
                                                    selected={
                                                        proposalsOwnerFilter?.id ===
                                                        ga?.id
                                                    }
                                                    id={`${ga?.id}-radio-wrapper`}
                                                    data-testid={
                                                        ga?.label
                                                            ?.replace(
                                                                /\s+/g,
                                                                '-'
                                                            )
                                                            ?.toLowerCase() +
                                                        `-radio-wrapper`
                                                    }
                                                    onClick={
                                                        toggleProposalsOwnersFilter
                                                    }
                                                    sx={{ width: '100%' }}
                                                >
                                                    <FormControlLabel
                                                        name='owner-filter'
                                                        control={
                                                            <Radio
                                                                checked={
                                                                    proposalsOwnerFilter?.id ===
                                                                    ga?.id
                                                                }
                                                            />
                                                        }
                                                        id={`${ga?.label}-radio`}
                                                        data-testid={
                                                            ga?.label
                                                                ?.replace(
                                                                    /\s+/g,
                                                                    '-'
                                                                )
                                                                ?.toLowerCase() +
                                                            `-radio`
                                                        }
                                                        sx={{
                                                            width: '100%',
                                                            marginRight: 0,
                                                        }}
                                                        value={ga?.id}
                                                        label={
                                                            <Typography
                                                                data-testid={`${ga?.label}-owner-filter-option`}
                                                                color={
                                                                    'text.black'
                                                                }
                                                                variant='body1'
                                                                sx={{
                                                                    width: '100%',
                                                                    overflowX:
                                                                        'hidden',
                                                                    textOverflow:
                                                                        'ellipsis',
                                                                }}
                                                            >
                                                                {ga?.label}
                                                            </Typography>
                                                        }
                                                    />
                                                </MenuItem>
                                            )
                                        )}

                                        <MenuItem
                                            onClick={() => resetFilters()}
                                            data-testid='reset-filters'
                                        >
                                            <Typography color={'primary'}>
                                                Reset filters
                                            </Typography>
                                        </MenuItem>
                                    </Box>
                                </Menu>
                                <>
                                    <Button
                                        variant='outlined'
                                        onClick={(e) => handleSortClick(e)}
                                        endIcon={
                                            <IconSort
                                                color={
                                                    theme.palette.primary.icons
                                                        .black
                                                }
                                            />
                                        }
                                        sx={{
                                            textTransform: 'none',
                                            borderRadius: '20px',
                                            padding: '8px 16px',
                                            borderColor: 'primary.main',
                                            color: 'text.primary',
                                            '&:hover': {
                                                backgroundColor: 'action.hover',
                                            },
                                        }}
                                        data-testid='sort-button'
                                    >
                                        Sort: {sortType.title}
                                    </Button>
                                    <Menu
                                        id='sort-menu'
                                        anchorEl={sortAnchorEl}
                                        open={openSort}
                                        onClose={handleSortClose}
                                        MenuListProps={{
                                            'aria-labelledby': 'filters-button',
                                        }}
                                        slotProps={{
                                            paper: {
                                                elevation: 4,
                                                sx: {
                                                    overflow: 'visible',
                                                    mt: 1,
                                                    minWidth: '300px',
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
                                        <Box>
                                            {sortOptions.map((sort, index) => (
                                                <MenuItem
                                                    key={`${sort?.title}-${index}`}
                                                    selected={sort === sortType}
                                                    id={`${sort?.title}`}
                                                    data-testid={`${sort?.title}-sort-option`}
                                                    onClick={() => {
                                                        setSortType(sort);
                                                        handleSortClose();
                                                    }}
                                                    sx={{
                                                        width: '100%',
                                                    }}
                                                >
                                                    {sort.title}
                                                </MenuItem>
                                            ))}
                                        </Box>
                                    </Menu>
                                </>
                                {/* <Button
                                    variant='outlined'
                                    onClick={() =>
                                        setSortType((prev) =>
                                            prev === 'desc' ? 'asc' : 'desc'
                                        )
                                    }
                                    endIcon={
                                        sortType === 'desc' ? (
                                            <IconArrowDown
                                                color={
                                                    theme.palette.primary.icons
                                                        .black
                                                }
                                            />
                                        ) : (
                                            <IconArrowUp
                                                color={
                                                    theme.palette.primary.icons
                                                        .red
                                                }
                                            />
                                        )
                                    }
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: '20px',
                                        padding: '8px 16px',
                                        borderColor: 'primary.main',
                                        color: 'text.primary',
                                        '&:hover': {
                                            backgroundColor: 'action.hover',
                                        },
                                    }}
                                    data-testid='sort-button'
                                >
                                    Sort:{' '}
                                    {sortType === 'desc'
                                        ? 'Newest first'
                                        : 'Oldest first'}
                                </Button> */}
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Box>
                {(filteredBudgetDiscussionTypeList?.length > 0
                    ? filteredBudgetDiscussionTypeList
                    : budgetDiscussionTypeList
                )?.map((item, index) => (
                    <Box
                        key={`${item?.attributes?.type_name}-${index}`}
                        pt={index === 0 && 4}
                    >
                        <BudgetDiscussionsList
                            currentBudgetDiscussionType={item}
                            searchText={budgetDiscussionSearchText?.trim()}
                            sortOption={sortType}
                            statusList={filteredBudgetDiscussionStatusList}
                            setShowAllActivated={setShowAllActivated}
                            showAllActivated={showAllActivated}
                            isAllProposalsListEmpty={isAllProposalsListEmpty}
                            setIsAllProposalsListEmpty={
                                setIsAllProposalsListEmpty
                            }
                            filteredBudgetDiscussionTypeList={
                                filteredBudgetDiscussionTypeList
                            }
                            proposalOwnerFilter={proposalsOwnerFilter}
                        />
                    </Box>
                ))}
            </Box>

            {showNoProposals ? (
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
                                No budget discussions found
                            </Typography>
                            <Typography variant='body1' color='text.black'>
                                Please try a different search
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>
            ) : null}

            {showCreateBDDialog && (
                <CreateBudgetDiscussionDialog
                    open={showCreateBDDialog}
                    onClose={() => setShowCreateBDDialog(false)}
                />
            )}
        </Box>
    );
};

export default ProposedBudgetDiscussion;
