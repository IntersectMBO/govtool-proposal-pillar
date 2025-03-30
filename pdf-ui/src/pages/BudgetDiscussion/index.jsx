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
import { getBudgetDiscussionTypes } from '../../lib/api';
import { CreateBudgetDiscussionDialog, BudgetDiscussionsList } from '../../components';
import { useAppContext } from '../../context/context';
import { loginUserToApp } from '../../lib/helpers';
import { useLocation } from 'react-router-dom';

const ProposedBudgetDiscussion = () => {
    const location = useLocation();
    const theme = useTheme();
    const { user, walletAPI, setOpenUsernameModal, setUser, clearStates , getVotingPower } = useAppContext();
    const [budgetDiscussionSearchText, setBudgetDiscussionSearchText] = useState('');
    const [sortType, setSortType] = useState('desc');
    const [budgetDiscussionTypeList, setBudgetDiscussionTypeList] = useState([]);
    const [filteredBudgetDiscussionTypeList,setFilteredBudgetDiscussionTypeList] = useState([]);
    const [showCreateBDDialog, setShowCreateBDDialog] = useState(false);
    const [filteredBudgetDiscussionStatusList,setFilteredBudgetDiscussionStatusList] = useState(['active']);
    const [filtersAnchorEl, setFiltersAnchorEl] = useState(null);
    const [showAllActivated, setShowAllActivated] = useState({
        is_activated: false,
        bd_type: null,
    });

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
    // const fetchUserDrepData = async () => {
    //     try {
    //         let response = await getDrepInfo();
    //         if (!response?.data) return;
    //             setUserDrepData(response?.data);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };
console.log(user)
console.log(walletAPI)
//let x = getVotingPower("drep1q6nr96la2nckmnkktzmy3e9ckh2uy5ytr9tz08vau85f5f7plqh")
//console.log(x)

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
            updatedList = [...filteredBudgetDiscussionList, action];
        }

        updatedList.sort((a, b) => a?.id - b?.id);

        setFilteredBudgetDiscussionTypeList(updatedList);
    };

    const toggleStatusFilter = (status) => {
        let filterExist = filteredBudgetDiscussionStatusList?.some(
            (filter) => filter === status
        );

        let updatedList;
        if (filterExist) {
            updatedList = filteredBudgetDiscussionStatusList.filter(
                (filter) => filter !== status
            );
        } else {
            updatedList = [...filteredBudgetDiscussionStatusList, status];
        }

        setFilteredBudgetDiscussionStatusList(updatedList);
    };

    const resetFilters = () => {
        setFilteredBudgetDiscussionTypeList([]);
        setFilteredBudgetDiscussionStatusList(['active']);
        handleCloseFilters();
    };

    useEffect(() => {
        //console.log(walletAPI);
        if(budgetDiscussionTypeList.length == 0)
            fetchBudgetDiscussionTypes();
    }, []);

    useEffect(() => {
        if (showAllActivated?.is_activated) {
            setFilteredBudgetDiscussionTypeList([
                showAllActivated?.gov_action_type,
            ]);
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
                        {(
                            <Grid item xs={12} paddingBottom={2}>
                                <Typography variant='h4' component='h1'>
                                    Proposed Budget Discussion
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
                                    data-testid='back-to-budget-discussion-button'
                                >
                                    Back to Budget Discussion
                                </Button>
                            </Grid>
                        )}

                        {walletAPI?.voter?.isRegisteredAsDRep && (
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
                                    Propose a Budget Discussion
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
                                    setBudgetDiscussionSearchText(e.target.value)
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
                                    variant="outlined"
                                    onClick={handleFiltersClick}
                                    endIcon={<IconFilter
                                        color={
                                            theme.palette.primary.icons
                                                .black
                                        }
                                    />}
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
                                            openFilters
                                                ? 'filters-menu'
                                                : undefined
                                        }
                                        aria-haspopup='true'
                                        aria-expanded={
                                            openFilters ? 'true' : undefined
                                        }


                                    > Filter:
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
                                                    BudgetDiscussion types
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
                                                            key={`${ga?.attributes?.bd_type_name}-${index}`}
                                                            selected={filteredBudgetDiscussionTypeList?.some(
                                                                (filter) =>
                                                                    filter?.id ===
                                                                    ga?.id
                                                            )}
                                                            id={`${ga?.attributes?.bd_type_name}-radio-wrapper`}
                                                            data-testid={
                                                                ga?.attributes
                                                                    ?.bd_type_name
                                                                    ? `${ga?.attributes?.bd_type_name?.toLowerCase()}-radio-wrapper`
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
                                                                        id={`${ga?.attributes?.bd_type_name}-radio`}
                                                                        data-testid={
                                                                            ga
                                                                                ?.attributes
                                                                                ?.bd_type_name
                                                                                ? `${ga?.attributes?.bd_type_name?.toLowerCase()}-radio`
                                                                                : `${index}-radio`
                                                                        }
                                                                    />
                                                                }
                                                                label={
                                                                    ga
                                                                        ?.attributes
                                                                        ?.bd_type_name
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
                                            Budget discussion status
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
                                            selected={filteredBudgetDiscussionStatusList?.some(
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
                                                        checked={filteredBudgetDiscussionStatusList?.some(
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
                                            selected={filteredBudgetDiscussionStatusList?.some(
                                                (filter) => filter === 'active'
                                            )}
                                            id={`active-budget-discussion-radio-wrapper`}
                                            data-testid={`active-budget-discussion-radio-wrapper`}
                                        >
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        onChange={() =>
                                                            toggleStatusFilter(
                                                                'active'
                                                            )
                                                        }
                                                        checked={filteredBudgetDiscussionStatusList?.some(
                                                            (filter) =>
                                                                filter ===
                                                                'active'
                                                        )}
                                                        id={`active-budget-discussion-radio`}
                                                        data-testid={`active-budget-discussion-radio`}
                                                    />
                                                }
                                                label={'Active budget discussion'}
                                            />
                                        </MenuItem>
                                        
                                        <MenuItem
                                            onClick={() => resetFilters()}
                                            data-testid='reset-filters'
                                        >                                            <Typography color={'primary'}>
                                                Reset filters
                                            </Typography>
                                        </MenuItem>
                                    </Box>
                                </Menu>
                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        setSortType((prev) =>
                                            prev === 'desc' ? 'asc' : 'desc'
                                        )}
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
                                    data-testid="sort-button"
                                >
                                  Sort: {sortType === 'desc' ? 'Last modified (desc)' : 'Last modified (asc)'}  
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
                        key={`${item?.attributes?.bd_type_name}-${index}`}
                        pt={index === 0 && 4}
                    >
                         <BudgetDiscussionsList
                            currentBudgetDiscussion={item}
                            searchText={budgetDiscussionSearchText}
                            sortType={sortType}
                            statusList={filteredBudgetDiscussionStatusList}
                            setShowAllActivated={setShowAllActivated}
                            showAllActivated={showAllActivated}
                        /> 
                    </Box>
                ))}
            </Box>

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
