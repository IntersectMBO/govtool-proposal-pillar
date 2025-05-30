'use client';

import { useTheme } from '@emotion/react';
import {
    IconFilter,
    IconSearch,
    IconSort,
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
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    TextField,
    Typography,
    Button,
    Tooltip,
    Divider,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { ProposalsList, CreateGovernanceActionDialog } from '../../components';
import { getGovernanceActionTypes } from '../../lib/api';
import { useAppContext } from '../../context/context';
import { loginUserToApp } from '../../lib/helpers';
import { useLocation } from 'react-router-dom';

let sortOptions = [
    { fieldId: 'createdAt', type: 'DESC', title: 'Newest' },
    { fieldId: 'createdAt', type: 'ASC', title: 'Oldest' },
    {
        fieldId: 'proposal][prop_likes',
        type: 'DESC',
        title: 'Most likes',
    },
    {
        fieldId: 'proposal][prop_likes',
        type: 'ASC',
        title: 'Least likes',
    },
    {
        fieldId: 'proposal][prop_dislikes',
        type: 'DESC',
        title: 'Most dislikes',
    },
    {
        fieldId: 'proposal][prop_dislikes',
        type: 'ASC',
        title: 'Least dislikes',
    },
        {
        fieldId: 'proposal][prop_comments_number',
        type: 'DESC',
        title: 'Most comments',
    },
    {
        fieldId: 'proposal][prop_comments_number',
        type: 'ASC',
        title: 'Least comments',
    },
    {
        fieldId: 'prop_name',
        type: 'ASC',
        title: 'Name A-Z',
    },
    {
        fieldId: 'prop_name',
        type: 'DESC',
        title: 'Name Z-A',
    },
];

const ProposedGovernanceActions = () => {
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
    const [proposalSearchText, setProposalSearchText] = useState('');
    const [sortType, setSortType] = useState(sortOptions[0]);
    const [governanceActionTypeList, setGovernanceActionTypeList] = useState(
        []
    );
    const [
        filteredGovernanceActionTypeList,
        setFilteredGovernanceActionTypeList,
    ] = useState([]);
    const [showCreateGADialog, setShowCreateGADialog] = useState(false);
    const [
        filteredGovernanceActionStatusList,
        setFilteredGovernanceActionStatusList,
    ] = useState(['active']);

    const [filtersAnchorEl, setFiltersAnchorEl] = useState(null);
    const [showAllActivated, setShowAllActivated] = useState({
        is_activated: false,
        gov_action_type: null,
    });

    const openFilters = Boolean(filtersAnchorEl);
    const handleFiltersClick = (event) => {
        setFiltersAnchorEl(event.currentTarget);
    };
    const handleCloseFilters = () => {
        setFiltersAnchorEl(null);
    };

    const [sortAnchorEl, setSortAnchorEl] = useState(null);
    const openSort = Boolean(sortAnchorEl);

    const handleSortClick = (event) => {
        setSortAnchorEl(event.currentTarget);
    };
    const handleSortClose = () => {
        setSortAnchorEl(null);
    };

    const fetchGovernanceActionTypes = async () => {
        try {
            let response = await getGovernanceActionTypes();

            if (!response?.data) return;

            setGovernanceActionTypeList(response?.data);
        } catch (error) {
            console.error(error);
        }
    };

    const toggleActionFilter = (action) => {
        let filterExist = filteredGovernanceActionTypeList?.some(
            (filter) => filter?.id === action?.id
        );

        let updatedList;
        if (filterExist) {
            updatedList = filteredGovernanceActionTypeList.filter(
                (filter) => filter?.id !== action?.id
            );
        } else {
            updatedList = [...filteredGovernanceActionTypeList, action];
        }

        updatedList.sort((a, b) => a?.id - b?.id);

        setFilteredGovernanceActionTypeList(updatedList);
    };

    const toggleStatusFilter = (status) => {
        let filterExist = filteredGovernanceActionStatusList?.some(
            (filter) => filter === status
        );

        let updatedList;
        if (filterExist) {
            updatedList = filteredGovernanceActionStatusList.filter(
                (filter) => filter !== status
            );
        } else {
            updatedList = [...filteredGovernanceActionStatusList, status];
        }

        setFilteredGovernanceActionStatusList(updatedList);
    };

    const resetFilters = () => {
        setFilteredGovernanceActionTypeList([]);
        setFilteredGovernanceActionStatusList(['active']);
        handleCloseFilters();
    };

    useEffect(() => {
        fetchGovernanceActionTypes();
    }, []);

    useEffect(() => {
        if (showAllActivated?.is_activated) {
            setFilteredGovernanceActionTypeList([
                showAllActivated?.gov_action_type,
            ]);
        } else {
            setFilteredGovernanceActionTypeList([]);
        }
    }, [showAllActivated]);

    useEffect(() => {
        if (location.pathname.includes('propose')) {
            if (user?.user?.govtool_username) {
                setShowCreateGADialog(true);
            } else if (user) {
                setOpenUsernameModal({ open: true, callBackFn: () => {} });
            }
        }
    }, [location.pathname]);

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
                        {!walletAPI?.address && (
                            <Grid item xs={12} paddingBottom={2}>
                                <Typography variant='h4' component='h1'>
                                    Proposed Governance Actions
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
                                            gov_action_type: null,
                                        });
                                    }}
                                    data-testid='back-to-proposal-discussion-button'
                                >
                                    Back to Proposal Discussion
                                </Button>
                            </Grid>
                        )}

                        {walletAPI?.address && (
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
                                                setShowCreateGADialog(true),
                                            clearStates: clearStates,
                                            addErrorAlert: addErrorAlert,
                                            addSuccessAlert: addSuccessAlert,
                                            addChangesSavedAlert:
                                                addChangesSavedAlert,
                                        })
                                    }
                                    startIcon={<IconPlusCircle fill='white' />}
                                    data-testid='propose-a-governance-action-button'
                                >
                                    Propose a Governance Action
                                </Button>
                            </Grid>
                        )}

                        <Grid item md={6} sx={{ flexGrow: { xs: 1 } }}>
                            <TextField
                                fullWidth
                                id='outlined-basic'
                                placeholder='Search...'
                                variant='outlined'
                                value={proposalSearchText || ''}
                                onChange={(e) =>
                                    setProposalSearchText(e.target.value)
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
                                    // sx={{
                                    //     width: 40,
                                    //     height: 40,
                                    // }}
                                    aria-controls={
                                        openFilters ? 'filters-menu' : undefined
                                    }
                                    aria-haspopup='true'
                                    aria-expanded={
                                        openFilters ? 'true' : undefined
                                    }
                                >
                                    {' '}
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
                                                    Proposal types
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
                                                {governanceActionTypeList?.map(
                                                    (ga, index) => (
                                                        <MenuItem
                                                            key={`${ga?.attributes?.gov_action_type_name}-${index}`}
                                                            selected={filteredGovernanceActionTypeList?.some(
                                                                (filter) =>
                                                                    filter?.id ===
                                                                    ga?.id
                                                            )}
                                                            id={`${ga?.attributes?.gov_action_type_name}-radio-wrapper`}
                                                            data-testid={
                                                                ga?.attributes
                                                                    ?.gov_action_type_name
                                                                    ? `${ga?.attributes?.gov_action_type_name?.toLowerCase()}-radio-wrapper`
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
                                                                        checked={filteredGovernanceActionTypeList?.some(
                                                                            (
                                                                                filter
                                                                            ) =>
                                                                                filter?.id ===
                                                                                ga?.id
                                                                        )}
                                                                        id={`${ga?.attributes?.gov_action_type_name}-radio`}
                                                                        data-testid={
                                                                            ga
                                                                                ?.attributes
                                                                                ?.gov_action_type_name
                                                                                ? `${ga?.attributes?.gov_action_type_name?.toLowerCase()}-radio`
                                                                                : `${index}-radio`
                                                                        }
                                                                    />
                                                                }
                                                                label={
                                                                    ga
                                                                        ?.attributes
                                                                        ?.gov_action_type_name
                                                                }
                                                            />
                                                        </MenuItem>
                                                    )
                                                )}
                                            </Box>
                                        )}

                                        <Typography
                                            variant='body1'
                                            sx={{ mb: 1, mt: 2 }}
                                        >
                                            Proposal status
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
                                        <MenuItem
                                            selected={filteredGovernanceActionStatusList?.some(
                                                (filter) =>
                                                    filter === 'submitted'
                                            )}
                                            id={`submitted-for-vote-radio-wrapper`}
                                            data-testid={`submitted-for-vote-radio-wrapper`}
                                        >
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        onChange={() =>
                                                            toggleStatusFilter(
                                                                'submitted'
                                                            )
                                                        }
                                                        checked={filteredGovernanceActionStatusList?.some(
                                                            (filter) =>
                                                                filter ===
                                                                'submitted'
                                                        )}
                                                        id={`submitted-for-vote-radio`}
                                                        data-testid={`submitted-for-vote-radio`}
                                                    />
                                                }
                                                label={'Submitted for vote'}
                                            />
                                        </MenuItem>
                                        <MenuItem
                                            selected={filteredGovernanceActionStatusList?.some(
                                                (filter) => filter === 'active'
                                            )}
                                            id={`active-proposal-radio-wrapper`}
                                            data-testid={`active-proposal-radio-wrapper`}
                                        >
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        onChange={() =>
                                                            toggleStatusFilter(
                                                                'active'
                                                            )
                                                        }
                                                        checked={filteredGovernanceActionStatusList?.some(
                                                            (filter) =>
                                                                filter ===
                                                                'active'
                                                        )}
                                                        id={`active-proposal-radio`}
                                                        data-testid={`active-proposal-radio`}
                                                    />
                                                }
                                                label={'Active proposal'}
                                            />
                                        </MenuItem>

                                        <MenuItem
                                            onClick={() => resetFilters()}
                                            data-testid='reset-filters'
                                        >
                                            {' '}
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
                                            'aria-labelledby': 'sort-button',
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
                                            // <IconArrowDown />
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
                                </Button> */}
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Box>
                {(filteredGovernanceActionTypeList?.length > 0
                    ? filteredGovernanceActionTypeList
                    : governanceActionTypeList
                )?.map((item, index) => (
                    <Box
                        key={`${item?.attributes?.gov_action_type_name}-${index}`}
                        pt={index === 0 && 4}
                    >
                        <ProposalsList
                            governanceAction={item}
                            searchText={proposalSearchText}
                            sortType={sortType}
                            statusList={filteredGovernanceActionStatusList}
                            setShowAllActivated={setShowAllActivated}
                            showAllActivated={showAllActivated}
                        />
                    </Box>
                ))}
            </Box>

            {showCreateGADialog && (
                <CreateGovernanceActionDialog
                    open={showCreateGADialog}
                    onClose={() => setShowCreateGADialog(false)}
                />
            )}
        </Box>
    );
};

export default ProposedGovernanceActions;
