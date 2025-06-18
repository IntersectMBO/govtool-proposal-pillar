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

const UserValidation = ({
    type = 'budget',
    drepCheck = false,
    drepRequired = false,
}) => {
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
    } = govtoolProps || {};
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
                    setUser(null);
                    clearInterval(interval); // Clear interval if there is no token
                }
            }, 60 * 1000); // Every minute

            return () => clearInterval(interval); // Clear interval on component unmount
        }
    }, [user]);

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
        } else if (drepCheck) {
            handleLogin(true, true);
        }
    };

    const checkTitleText = (type) => {
        switch (type) {
            case 'budget':
                return 'To submit a comment, you need to';
            case 'comment':
                return 'To submit a reply, you need to';
            case 'budget-proposal':
                return 'To submit a budget proposal, you need to';
            case 'proposal':
                return 'To submit a proposal, you need to';
            case 'governance':
                return 'If this is your Proposal, to submit it, you need to';
            case 'sentiment':
                return 'To show sentiment, you need to';
                case "drep-poll":
                    return "If you are a Drep, you need to"
            default:
                return '';
        }
    };

    const showValidationMessage = useMemo(() => {
        if (!walletAPI) {
            return (
                <Link onClick={checkFunctionCall} data-testId="connect-wallet-link">
                    connect a Cardano wallet
                </Link>
            );
        }

        if (!user) {
            return (
                <Link onClick={checkFunctionCall} data-testId="verify-user-link">
                    verify yourself by signing a transaction
                </Link>
            );
        }

        if (!user?.user?.govtool_username) {
            return (
                <Link onClick={checkFunctionCall} data-testId="create-govtool-display-name-link">
                    create a GovTool Display Name
                </Link>
            );
        }
        if (drepRequired && drepCheck) {
            return (
                <Link onClick={checkFunctionCall} data-testId="verify-drep-link">
                    verify your status as a DRep.
                </Link>
            );
        }
    }, [user, walletAPI]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 0.5,
                    marginTop: 0.3,
                }}
            >
                <Typography variant='body1' fontWeight={600}>
                    {checkTitleText(type)}
                </Typography>
                <Typography variant='body1'>{showValidationMessage}</Typography>
                {type === "drep-poll" && !user && (
                    <Typography variant='body1' fontWeight={600}>
                        and Drep key to vote. This is a two step process for security.
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default UserValidation;
