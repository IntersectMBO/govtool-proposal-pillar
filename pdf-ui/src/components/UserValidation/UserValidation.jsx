import {
    Box,
    Button,
    Card,
    CardContent,
    List,
    ListItem,
    Typography,
} from '@mui/material';
import React, { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IdentificationPage } from '../../pages';
import { useAppContext } from '../../context/context';
import { loginUserToApp } from '../../lib/helpers';
import { use } from 'react';
import {
    clearSession,
    decodeJWT,
    getDataFromSession,
    saveDataInSession,
} from '../../lib/utils';
import { getRefreshToken } from '../../lib/api';

const UserValidation = ({ type = 'budget' }) => {
    const {
        setWalletAPI,
        loading,
        setLocale,
        walletAPI,
        setUser,
        openUsernameModal,
        setOpenUsernameModal,
        setValidateMetadata,
        user,
        clearStates,
        setFetchDRepVotingPowerList,
        addSuccessAlert,
        setAddSuccessAlert,
        addErrorAlert,
        setAddErrorAlert,
        addWarningAlert,
        setAddWarningAlert,
        addChangesSavedAlert,
        setAddChangesSavedAlert,
        showIdentificationPage,
        setShowIdentificationPage,
        govtoolProps,
    } = useAppContext();

    const [mounted, setMounted] = useState(false);

    const {
        walletAPI: GovToolAssemblyWalletAPI,
        locale: GovToolAssemblyLocale,
        validateMetadata: GovToolAssemblyValidateMetadata,
        pdfApiUrl: GovToolAssemblyPdfApiUrl,
        fetchDRepVotingPowerList: GovToolFetchDRepVotingPowerList,
        username: GovToolAssemblyUsername,
        setUsername: GovToolAssemblySetUsername,
        addSuccessAlert: GovToolAddSuccessAlert,
        addErrorAlert: GovToolAddErrorAlert,
        addWarningAlert: GovToolAddWarningAlert,
        addChangesSavedAlert: GovToolAddChangesSavedAlert,
    } = govtoolProps;

    const handleLogin = async (trigerSignData, useDRepKey = false) => {
        if (GovToolAssemblyWalletAPI?.address) {
            setWalletAPI(GovToolAssemblyWalletAPI);
            if (GovToolAssemblyValidateMetadata) {
                setValidateMetadata(() => GovToolAssemblyValidateMetadata);
            }
            if (GovToolFetchDRepVotingPowerList) {
                setFetchDRepVotingPowerList(
                    () => GovToolFetchDRepVotingPowerList
                );
            }
            if (GovToolAddSuccessAlert) {
                setAddSuccessAlert(() => GovToolAddSuccessAlert);
            }
            if (GovToolAddErrorAlert) {
                setAddErrorAlert(() => GovToolAddErrorAlert);
            }
            if (GovToolAddWarningAlert) {
                setAddWarningAlert(() => GovToolAddWarningAlert);
            }
            if (GovToolAddChangesSavedAlert) {
                setAddChangesSavedAlert(() => GovToolAddChangesSavedAlert);
            }
            await loginUserToApp({
                wallet: GovToolAssemblyWalletAPI,
                setUser: setUser,
                setOpenUsernameModal: setOpenUsernameModal,
                trigerSignData: trigerSignData ? true : false,
                clearStates: clearStates,
                setPDFUsername: GovToolAssemblySetUsername,
                isDRep: useDRepKey,
                addErrorAlert: GovToolAddErrorAlert,
                addSuccessAlert: GovToolAddSuccessAlert,
                addChangesSavedAlert: GovToolAddChangesSavedAlert,
            });
        } else {
            if (
                !GovToolAssemblyWalletAPI?.isEnabled &&
                getDataFromSession('pdfUserJwt')
            ) {
                clearStates();
                clearSession();
            }
        }
    };
    useEffect(() => {
        if (GovToolAssemblyValidateMetadata) {
            setValidateMetadata(() => GovToolAssemblyValidateMetadata);
        }
    }, [GovToolAssemblyValidateMetadata]);

    useEffect(() => {
        if (GovToolFetchDRepVotingPowerList) {
            setFetchDRepVotingPowerList(() => GovToolFetchDRepVotingPowerList);
        }
    }, [GovToolFetchDRepVotingPowerList]);

    useEffect(() => {
        if (GovToolAddSuccessAlert) {
            setAddSuccessAlert(() => GovToolAddSuccessAlert);
        }
    }, [GovToolAddSuccessAlert]);

    useEffect(() => {
        if (GovToolAddErrorAlert) {
            setAddErrorAlert(() => GovToolAddErrorAlert);
        }
    }, [GovToolAddErrorAlert]);

    useEffect(() => {
        if (GovToolAddWarningAlert) {
            setAddWarningAlert(() => GovToolAddWarningAlert);
        }
    }, [GovToolAddWarningAlert]);

    useEffect(() => {
        if (GovToolAddChangesSavedAlert) {
            setAddChangesSavedAlert(() => GovToolAddChangesSavedAlert);
        }
    }, [GovToolAddChangesSavedAlert]);

    useEffect(() => {
        if (!mounted) {
            setMounted(true);
        } else {
            handleLogin(false);
        }
    }, [GovToolAssemblyWalletAPI?.address, mounted]);

    useEffect(() => {
        if (GovToolAssemblyLocale) {
            setLocale(GovToolAssemblyLocale);
        }
    }, [GovToolAssemblyLocale]);

    useEffect(() => {
        if (user && user?.user?.govtool_username) {
            const interval = setInterval(async () => {
                const jwt = decodeJWT(); // Get JWT from session
                if (jwt) {
                    const expDate = new Date(jwt?.exp * 1000); // Transfer exp from ms to date
                    const now = new Date();

                    // Check if token is still valid
                    if (expDate <= now) {
                        setUser(null);
                        clearSession();
                        clearInterval(interval); // Clear because user do not exist
                    } else if (expDate - now <= 300000) {
                        // If difference is less then 5 minutes, get new refresh token
                        try {
                            const refreshedTokens = await getRefreshToken(); // Call refreshToken function
                            // Set new JWT in Session
                            saveDataInSession(
                                'pdfUserJwt',
                                refreshedTokens.jwt
                            );
                        } catch (error) {
                            console.error('Error refreshing token:', error);
                            setUser(null); // Logout user if refresh token fails
                            clearSession();
                        }
                    }
                } else {
                    console.log('No token found');
                    setUser(null);
                    clearInterval(interval); // Clear interval if there is no token
                }
            }, 60 * 1000); // Every minute

            return () => clearInterval(interval); // Clear interval on component unmount
        }
    }, [user]);

    const showValidationMessage = useMemo(() => {
        const messages = [];

        const showAll = !user;

        if (!walletAPI) {
            messages.push(
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                    <Typography>To connect a Cardano wallet</Typography>
                </Box>
            );
        }

        if (!user) {
            messages.push(
                <Typography>Verify yourself with your wallet</Typography>
            );
        }

        if (!user?.user?.govtool_username) {
            messages.push(<Typography>A GovTool Display Name</Typography>);
        }

        if (showAll) {
            messages.push(
                <Typography>
                    Verify your status as a DRep if you are one.
                </Typography>
            );
        }

        return messages;
    }, [user, walletAPI]);

    const checkFunctionCall = () => {
        if (!walletAPI?.address) {
            const button = document.querySelector(
                '[data-testId="connect-wallet-button"]'
            );
            button?.click();
        } else if (!user) {
            handleLogin(true);
        } else if (!user?.user?.govtool_username) {
            setOpenUsernameModal({
                open: true,
                callBackFn: () => {},
            });
        }
    };

    const checkButtonText = () => {
        if (!walletAPI?.address) {
            return 'Get started';
        } else if (!user) {
            return 'Verify';
        } else if (!user?.user?.govtool_username) {
            return 'Create Display Name';
        } else {
        }
    };

    if (type === 'budget') {
        return (
            <Box mt={4}>
                <Card>
                    <CardContent>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box>
                                <Typography
                                    variant='caption'
                                    sx={{
                                        color: (theme) =>
                                            theme.palette.text.grey,
                                    }}
                                    mt={2}
                                >
                                    Submit a comment
                                </Typography>
                                <Box
                                    ml={2}
                                    mt={2}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <Typography
                                        variant='body1'
                                        fontWeight={600}
                                    >
                                        To submit a comment, you will need:
                                    </Typography>

                                    <Typography variant='body1'>
                                        <Link data-test='user-validation-learn-more'>
                                            Learn more
                                        </Link>
                                    </Typography>
                                </Box>
                            </Box>
                            <Box>
                                <Button
                                    variant='contained'
                                    data-test='user-validation-get-started'
                                    onClick={() => {
                                        checkFunctionCall();
                                    }}
                                >
                                    {checkButtonText()}
                                </Button>
                            </Box>
                        </Box>
                        <Box>
                            <List sx={{ py: 0 }}>
                                {showValidationMessage.map((item, index) => (
                                    <ListItem
                                        key={item.key || index}
                                        disableGutters
                                        sx={{ py: 0.2, pl: 2 }}
                                    >
                                        <Box
                                            sx={{
                                                width: 3,
                                                height: 3,
                                                borderRadius: '50%',
                                                bgcolor: 'black',
                                                display: 'inline-block',
                                                mr: 1,
                                            }}
                                        />
                                        {item.props.children}
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        );
    }
};

export default UserValidation;
