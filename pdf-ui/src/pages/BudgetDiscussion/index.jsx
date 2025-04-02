'use client';

import { useTheme } from '@emotion/react';
import {
    IconFilter,
    IconSearch,
    IconPlusCircle,
    IconArrowLeft,
    IconArrowDown,
    IconArrowUp,
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
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getBudgetDiscussionTypes } from '../../lib/api';
import {
    CreateBudgetDiscussionDialog,
    BudgetDiscussionsList,
} from '../../components';
import { useAppContext } from '../../context/context';
import { loginUserToApp } from '../../lib/helpers';
import { useLocation } from 'react-router-dom';

const ProposedBudgetDiscussion = () => {
    const location = useLocation();
    const theme = useTheme();
    const { user, walletAPI, setOpenUsernameModal, setUser, clearStates } =
        useAppContext();
    const [budgetDiscussionSearchText, setBudgetDiscussionSearchText] =
        useState('');
    const [sortType, setSortType] = useState('desc');
    const [budgetDiscussionTypeList, setBudgetDiscussionTypeList] = useState(
        []
    );
    const [
        filteredBudgetDiscussionTypeList,
        setFilteredBudgetDiscussionTypeList,
    ] = useState([]);
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

    const [isAllProposalsListEmpty, setIsAllProposalsListEmpty] = useState([]);

    const openFilters = Boolean(filtersAnchorEl);
    const handleFiltersClick = (event) => {
        setFiltersAnchorEl(event.currentTarget);
    };
    const handleCloseFilters = () => {
        setFiltersAnchorEl(null);
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

    const resetFilters = () => {
        setFilteredBudgetDiscussionTypeList([]);
        handleCloseFilters();
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

    return (
        <Box sx={{ mt: 3 }}>
            <Grid container spacing={3} flexDirection={'column'}>
                <Grid item display={'flex'} flexDirection={'row'} xs={12}>
                    <Grid
                        container
                        alignItems={'center'}
                        justifyContent={'space-between'}
                        spacing={1}
                    >
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
                                    data-testid='back-to-budget-discussion-button'
                                >
                                    Back to Budget Discussion
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
                            <TextField
                                fullWidth
                                id='outlined-basic'
                                placeholder='Search...'
                                variant='outlined'
                                value={budgetDiscussionSearchText || ''}
                                onChange={(e) =>
                                    setBudgetDiscussionSearchText(
                                        e.target.value
                                    )
                                }
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <IconSearch
                                                color={
                                                    theme.palette.primary.icons
                                                        .black
                                                }
                                                width={24}
                                                height={24}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                                inputProps={{
                                    'data-testid': 'search-input',
                                }}
                                sx={{
                                    '.MuiOutlinedInput-root': {
                                        borderRadius: 100,
                                        backgroundColor: 'white',
                                        input: {
                                            '&::placeholder': {
                                                color: (theme) =>
                                                    theme.palette.text.grey,
                                                opacity: 1,
                                            },
                                        },
                                    },
                                }}
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
                                                    Budget Discussion types
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
                                                                ga?.attributes
                                                                    ?.bd_type_name
                                                                    ? `${ga?.attributes?.type_name?.toLowerCase()}-radio-wrapper`
                                                                    : `${index}-radio-wrapper`
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
                                                                            ga
                                                                                ?.attributes
                                                                                ?.bd_type_name
                                                                                ? `${ga?.attributes?.type_name?.toLowerCase()}-radio`
                                                                                : `${index}-radio`
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
                                <Button
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
                                        ? 'Last modified (desc)'
                                        : 'Last modified (asc)'}
                                </Button>
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
                            searchText={budgetDiscussionSearchText}
                            sortType={sortType}
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
