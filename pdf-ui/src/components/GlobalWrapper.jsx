'use client';

import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { UsernameModal } from '../components';
import { useAppContext } from '../context/context';
import {
    clearSession,
    decodeJWT,
    getDataFromSession,
    saveDataInSession,
} from '../lib/utils';
import {
    ProposedGovernanceActions,
    SingleGovernanceAction,
    IdentificationPage,
    CommentReviewPage,
    ProposedBudgetDiscussion,
    SingleBudgetDiscussion,
} from '../pages';
import { loginUserToApp } from '../lib/helpers';
import { setAxiosBaseURL } from '../lib/axiosInstance'; // Import axiosInstance and setAxiosBaseURL
import { getRefreshToken } from '../lib/api';
import { ScrollToTop } from '../lib/hooks';

const GlobalWrapper = ({ ...props }) => {
    const pathname = props?.pathname;

    const {
        setWalletAPI,
        setLocale,
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
        setLoading,
        setGovtoolProps,
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
    } = props;

    useEffect(() => {
        setLoading(true);
        setGovtoolProps(props);
        setLoading(false);
    }, [GovToolAssemblyWalletAPI]);

    function getProposalID(url) {
        const parts = url.split('/');
        const lastSegment = parts[parts.length - 1];

        if (isNaN(lastSegment) || lastSegment.trim() === '') {
            return null;
        }

        return lastSegment;
    }
    function getReviewHash(url) {
        const parts = url.split('/');
        const lastSegment = parts[parts.length - 1];
        if (lastSegment.trim() === '') {
            return null;
        }
        return lastSegment;
    }

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

    setAxiosBaseURL(GovToolAssemblyPdfApiUrl);

    const renderComponentBasedOnPath = (path) => {
        if (GovToolAssemblyPdfApiUrl) {
            // if (
            //     !user &&
            //     GovToolAssemblyWalletAPI?.address &&
            //     showIdentificationPage
            // ) {
            //     return <IdentificationPage handleLogin={handleLogin} />;
            // } else {
            //     if (
            //         GovToolAssemblyWalletAPI?.dRepID &&
            //         (GovToolAssemblyWalletAPI?.voter?.isRegisteredAsDRep ||
            //             GovToolAssemblyWalletAPI?.voter
            //                 ?.isRegisteredAsSoleVoter)
            //     ) {
            //         const jwtData = decodeJWT();

            //         if (jwtData) {
            //             let jwtDrepId = jwtData?.dRepID;
            //             if (!jwtDrepId) {
            //                 return (
            //                     <IdentificationPage
            //                         handleLogin={handleLogin}
            //                         isDRep={
            //                             (GovToolAssemblyWalletAPI?.dRepID &&
            //                                 (GovToolAssemblyWalletAPI?.voter
            //                                     ?.isRegisteredAsDRep ||
            //                                     GovToolAssemblyWalletAPI?.voter
            //                                         ?.isRegisteredAsSoleVoter)) ||
            //                             false
            //                         }
            //                     />
            //                 );
            //             }
            //         } else {
            //             return null;
            //         }
            //     }
            if (path.includes('propose')) {
                return <ProposedGovernanceActions />;
            } else if (
                path.includes('proposal_discussion/proposal_comment_review/') &&
                getReviewHash(path)
            ) {
                return <CommentReviewPage reportHash={getReviewHash(path)} />;
            } else if (
                path.includes('budget_discussion/') &&
                getProposalID(path)
            ) {
                return <SingleBudgetDiscussion id={getProposalID(path)} />;
            } else if (path.includes('budget_discussion')) {
                return <ProposedBudgetDiscussion />;
            } else if (
                path.includes('proposal_discussion/') &&
                getProposalID(path)
            ) {
                return <SingleGovernanceAction id={getProposalID(path)} />;
            } else if (path.includes('proposal_discussion')) {
                return <ProposedGovernanceActions />;
            } else {
                return <ProposedGovernanceActions />;
            }
        }
        // } else {
        //     return null;
        // }
    };

    return (
        <Box
            component='section'
            display={'flex'}
            flexDirection={'column'}
            flexGrow={1}
        >
            <ScrollToTop />
            {renderComponentBasedOnPath(pathname)}
            <UsernameModal
                open={openUsernameModal}
                handleClose={
                    () =>
                        setOpenUsernameModal({
                            open: false,
                            callBackFn: () => {},
                        }) // Reset open and callbackFn state
                }
                setPDFUsername={GovToolAssemblySetUsername}
            />
        </Box>
    );
};

export default GlobalWrapper;
