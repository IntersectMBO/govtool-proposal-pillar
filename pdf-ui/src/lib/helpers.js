import { loginUser, getLoggedInUserInfo, getChallenge } from '../lib/api';
import {
    saveDataInSession,
    getDataFromSession,
    utf8ToHex,
    clearSession,
    decodeJWT,
} from '../lib/utils';

export const loginUserToApp = async ({
    wallet,
    setUser,
    setOpenUsernameModal,
    callBackFn,
    trigerSignData = true,
    clearStates,
    setPDFUsername,
    isDRep = false,
    addErrorAlert,
    addSuccessAlert,
    addChangesSavedAlert,
}) => {
    try {
        if (!isDRep) {
            if (getDataFromSession('pdfUserJwt')) {
                const jwt = decodeJWT(); // Get JWT from session

                if (jwt?.stakeKey) {
                    // Check wallet stake key and jwt stake key
                    if (wallet) {
                        if (jwt.stakeKey !== wallet?.stakeKey) {
                            clearStates();
                            clearSession();
                            return;
                        }
                    } else {
                        clearStates();
                        clearSession();
                        return;
                    }
                } else {
                    clearStates();
                    clearSession();
                    return;
                }

                if (jwt?.dRepID) {
                    // Check wallet stake key and jwt stake key
                    if (wallet) {
                        if (wallet.dRepID) {
                            if (jwt.dRepID !== wallet?.dRepID) {
                                clearStates();
                                clearSession();
                                return;
                            }
                        } else {
                            clearStates();
                            clearSession();
                            return;
                        }
                    } else {
                        clearStates();
                        clearSession();
                        return;
                    }
                }

                const loggedInUser = await getLoggedInUserInfo();
                setUser({
                    user: {
                        ...loggedInUser,
                    },
                });
                !callBackFn && addSuccessAlert('Successfully logged in.');

                if (loggedInUser && !loggedInUser?.govtool_username) {
                    setOpenUsernameModal({
                        open: true,
                        callBackFn: callBackFn
                            ? () => callBackFn(loggedInUser)
                            : () => {},
                    });
                } else {
                    if (setPDFUsername) {
                        setPDFUsername(loggedInUser?.govtool_username);
                    }
                    if (callBackFn) {
                        callBackFn(loggedInUser);
                    }
                }
            } else {
                if (trigerSignData) {
                    const keyToSign = wallet?.stakeKey;
                    const challengeRes = await getChallenge({
                        query: `?identifier=${keyToSign}`,
                    });
                    const { message } = challengeRes;
                    const messageHex = utf8ToHex(message);

                    const signedMessage = await wallet?.cip95.signData(
                        keyToSign,
                        messageHex
                    );

                    const userResponse = await loginUser({
                        identifier: keyToSign,
                        signedMessage: {
                            ...signedMessage,
                            expectedSignedMessage: message,
                        },
                    });

                    if (!userResponse) return;
                    saveDataInSession('pdfUserJwt', userResponse?.jwt);
                    setUser(userResponse);
                    addSuccessAlert('Successfully signed data with stake key.');

                    if (userResponse && !userResponse?.user?.govtool_username) {
                        setOpenUsernameModal({
                            open: true,
                            callBackFn: callBackFn
                                ? () => callBackFn(userResponse?.user)
                                : () => {},
                        });
                    } else {
                        if (setPDFUsername) {
                            setPDFUsername(
                                userResponse?.user?.govtool_username
                            );
                        }

                        if (callBackFn) {
                            callBackFn(userResponse?.user);
                        }
                    }
                }
            }
        } else {
            if (trigerSignData) {
                const keyToSign = wallet?.dRepID;
                const challengeRes = await getChallenge({
                    query: `?identifier=${keyToSign}`,
                });
                const { message } = challengeRes;
                const messageHex = utf8ToHex(message);

                const signedMessage = await wallet?.cip95.signData(
                    keyToSign,
                    messageHex
                );

                const userResponse = await loginUser({
                    identifier: keyToSign,
                    signedMessage: {
                        ...signedMessage,
                        expectedSignedMessage: message,
                    },
                });

                if (!userResponse) return;
                saveDataInSession('pdfUserJwt', userResponse?.jwt);
                setUser(userResponse);
                addSuccessAlert('Successfully signed data with dRep key.');

                if (userResponse && !userResponse?.user?.govtool_username) {
                    setOpenUsernameModal({
                        open: true,
                        callBackFn: callBackFn
                            ? () => callBackFn(userResponse?.user)
                            : () => {},
                    });
                } else {
                    if (setPDFUsername) {
                        setPDFUsername(userResponse?.user?.govtool_username);
                    }

                    if (callBackFn) {
                        callBackFn(userResponse?.user);
                    }
                }
            }
        }
    } catch (error) {
        console.error(error);
        let errorMessage = 'Something went wrong';
        if (error?.response?.data?.error?.message) {
            errorMessage = error?.response?.data?.error?.message;
        }
        addErrorAlert(errorMessage);
        clearStates();
        clearSession();
    }
};
export const cleanObject = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(cleanObject);
    }
    if (obj !== null && typeof obj === 'object') {
        const newObj = {};
        for (const key in obj) {
            if (!obj.hasOwnProperty(key)) continue;
            if (['id', 'createdAt', 'updatedAt'].includes(key)) {
                continue;
            }
            let value = cleanObject(obj[key]);
            if (['data', 'attributes'].includes(key)) {
                if (
                    value &&
                    typeof value === 'object' &&
                    !Array.isArray(value)
                ) {
                    for (const nestedKey in value) {
                        if (value.hasOwnProperty(nestedKey)) {
                            newObj[nestedKey] = value[nestedKey];
                        }
                    }
                } else {
                    newObj[key] = value;
                }
            } else {
                newObj[key] = value;
            }
        }
        return newObj;
    }
    return obj;
};

export const isCommentRestricted = (curComment) => {
    let banned = curComment.attributes.comments_reports.data.some((report) => {
        return report.attributes.moderation_status === true;
    });
    let x = curComment.attributes.comments_reports.data.filter((report) => {
        return report.attributes.moderation_status !== false;
    });
    if (banned || x.length >= 3) {
        return true;
    }
    return false;
};
