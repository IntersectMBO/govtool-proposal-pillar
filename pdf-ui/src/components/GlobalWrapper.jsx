'use client';

import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { UsernameModal } from '../components';
import { useAppContext } from '../context/context';
import { clearSession, getDataFromSession } from '../lib/utils';
import {
    ProposedGovernanceActions,
    SingleGovernanceAction,
    IdentificationPage,
} from '../pages';
import { loginUserToApp } from '../lib/helpers';
import { setAxiosBaseURL } from '../lib/axiosInstance'; // Import axiosInstance and setAxiosBaseURL

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
    } = useAppContext();
    const [mounted, setMounted] = useState(false);

    const {
        walletAPI: GovToolAssemblyWalletAPI,
        locale: GovToolAssemblyLocale,
        validateMetadata: GovToolAssemblyValidateMetadata,
        pdfApiUrl: GovToolAssemblyPdfApiUrl,
    } = props;

    function getProposalID(url) {
        const parts = url.split('/');
        const lastSegment = parts[parts.length - 1];

        if (isNaN(lastSegment) || lastSegment.trim() === '') {
            return null;
        }

        return lastSegment;
    }

    const handleLogin = async (trigerSignData) => {
        if (GovToolAssemblyWalletAPI?.address) {
            setWalletAPI(GovToolAssemblyWalletAPI);
            if (GovToolAssemblyValidateMetadata) {
                setValidateMetadata(() => GovToolAssemblyValidateMetadata);
            }
            await loginUserToApp({
                wallet: GovToolAssemblyWalletAPI,
                setUser: setUser,
                setOpenUsernameModal: setOpenUsernameModal,
                trigerSignData: trigerSignData ? true : false,
                clearStates: clearStates,
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

    setAxiosBaseURL(GovToolAssemblyPdfApiUrl);

    const renderComponentBasedOnPath = (path) => {
        if (GovToolAssemblyPdfApiUrl) {
            if (!user && GovToolAssemblyWalletAPI?.address) {
                return <IdentificationPage handleLogin={handleLogin} />;
            } else {
                if (path.includes('propose')) {
                    return <ProposedGovernanceActions />;
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
        } else {
            return null;
        }
    };

    return (
        <Box
            component='section'
            display={'flex'}
            flexDirection={'column'}
            flexGrow={1}
        >
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
            />
        </Box>
    );
};

export default GlobalWrapper;
