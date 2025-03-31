import { loginUser, getLoggedInUserInfo } from '../lib/api';
import {
    saveDataInSession,
    getDataFromSession,
    utf8ToHex,
    clearSession,
} from '../lib/utils';

export const loginUserToApp = async ({
    wallet,
    setUser,
    setOpenUsernameModal,
    callBackFn,
    trigerSignData = true,
    clearStates,
}) => {
    try {
        if (getDataFromSession('pdfUserJwt')) {
            const loggedInUser = await getLoggedInUserInfo();
            setUser({
                user: {
                    ...loggedInUser,
                },
            });

            if (loggedInUser && !loggedInUser?.govtool_username) {
                setOpenUsernameModal({
                    open: true,
                    callBackFn: callBackFn
                        ? () => callBackFn(loggedInUser)
                        : () => {},
                });
            } else {
                if (callBackFn) {
                    callBackFn(loggedInUser);
                }
            }
        } else {
            if (trigerSignData) {
                const stakeKeyHash = await wallet?.stakeKey;
                const messageUtf = `To proceed, please sign this data to verify your identity. This ensures that the action is secure and confirms your identity.`;
                const messageHex = utf8ToHex(messageUtf);

                const signedData = await wallet.signData(
                    stakeKeyHash,
                    messageHex
                );

                const userResponse = await loginUser({
                    identifier: stakeKeyHash,
                    signedData: signedData,
                });

                if (!userResponse) return;
                saveDataInSession('pdfUserJwt', userResponse?.jwt);
                setUser(userResponse);

                if (userResponse && !userResponse?.user?.govtool_username) {
                    setOpenUsernameModal({
                        open: true,
                        callBackFn: callBackFn
                            ? () => callBackFn(userResponse?.user)
                            : () => {},
                    });
                } else {
                    if (callBackFn) {
                        callBackFn(userResponse?.user);
                    }
                }
            }
        }
    } catch (error) {
        console.error(error);
        clearStates();
        clearSession();
    }
};
export const cleanObject= (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(cleanObject);
    }
    if (obj !== null && typeof obj === 'object') {
      const newObj = {};
      for (const key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        if (["id", "createdAt", "updatedAt"].includes(key)) {
          continue;
        }
        let value = cleanObject(obj[key]);
        if (["data", "attributes"].includes(key)) {
          if (value && typeof value === 'object' && !Array.isArray(value)) {
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
  }