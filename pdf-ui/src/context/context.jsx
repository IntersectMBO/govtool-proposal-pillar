import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppContextProvider({ children }) {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(false);
    const [walletAPI, setWalletAPI] = useState(null);
    const [validateMetadata, setValidateMetadata] = useState(null);
    const [locale, setLocale] = useState('en');
    const [openUsernameModal, setOpenUsernameModal] = useState({
        open: false,
        callBackFn: () => {},
    });
const [fetchDRepVotingPowerList, setFetchDRepVotingPowerList] = useState(null)
const [addSuccessAlert, setAddSuccessAlert] = useState(null);
const [addErrorAlert, setAddErrorAlert] = useState(null);
const [addWarningAlert, setAddWarningAlert] = useState(null);
const [addChangesSavedAlert, setAddChangesSavedAlert] = useState(null);

const clearStates = () => {
    setWalletAPI(null);
    setUser(null);
    setValidateMetadata(null);
};

return (
    <AppContext.Provider
        value={{
            user,
            setUser,
            loading,
            setLoading,
            walletAPI,
            setWalletAPI,
            locale,
            setLocale,
            openUsernameModal,
            setOpenUsernameModal,
            validateMetadata,
            setValidateMetadata,
            clearStates,
            fetchDRepVotingPowerList,
            setFetchDRepVotingPowerList,
            addSuccessAlert,
            setAddSuccessAlert,
            addErrorAlert,
            setAddErrorAlert,
            addWarningAlert,
            setAddWarningAlert,
            addChangesSavedAlert,
            setAddChangesSavedAlert,
        }}
    >
        {children}
    </AppContext.Provider>
);
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error(
            'useAppContext must be used within a AppContextProvider'
        );
    }

    return context;
}
