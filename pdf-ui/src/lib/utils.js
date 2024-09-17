import { format } from 'date-fns';
import {
    Address,
    RewardAddress,
} from '@emurgo/cardano-serialization-lib-asmjs';

export const URL_REGEX =
    /^(?:(?:https?:\/\/)?(?:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(?:\/[^\s]*)?)|(?:ipfs:\/\/[a-f0-9]+(?:\/[a-zA-Z0-9_]+)*)$|^$/;

export const formatIsoDate = (isoDate) => {
    if (!isoDate) return '';

    return format(new Date(isoDate), 'd MMMM yyyy');
};

export const formatIsoTime = (isoDate) => {
    if (!isoDate) return '';

    return format(new Date(isoDate), 'hh:mm aa');
};

export const formatPollDateDisplay = (dateString) => {
    if (!dateString) return '';

    return `${format(new Date(dateString), 'dd/MM/yyyy - p')} UTC`;
};

export const saveDataInSession = (key, value) => {
    const data = { value, timestamp: new Date().getTime() };
    sessionStorage.setItem(key, JSON.stringify(data));
};

export const getDataFromSession = (key) => {
    const data = JSON.parse(sessionStorage.getItem(key));
    if (data) {
        return data.value;
    } else {
        return null;
    }
};

export const clearSession = () => {
    sessionStorage.removeItem('pdfUserJwt');
};

export const utf8ToHex = (str) => {
    return Array.from(str)
        .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('');
};

export function isValidURLFormat(str) {
    if (!str.length) return false;
    return URL_REGEX.test(str);
}

export function isValidURLLength(s) {
    if (s.length > 128) {
        return 'Url must be less than 128 bytes';
    }

    const encoder = new TextEncoder();
    const byteLength = encoder.encode(s).length;

    return byteLength <= 128 ? true : 'Url must be less than 128 bytes';
}

export const openInNewTab = (url) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
};

export async function isRewardAddress(address) {
    try {
        const stake = RewardAddress.from_address(Address.from_bech32(address));
        return stake ? true : 'It must be reward address in bech32 format';
    } catch (e) {
        return 'It must be reward address in bech32 format';
    }
}

/**
 * Validates a string value as a number.
 *
 * @param value - The string value to be validated.
 * @returns Either an error message or `true` if the value is a valid number.
 */
export const numberValidation = (value) => {
    const parsedValue = Number(
        value.includes(',') ? value.replace(',', '.') : value
    );

    if (Number.isNaN(parsedValue)) {
        return 'Only number is allowed';
    }

    if (parsedValue < 0) {
        return 'Only positive number is allowed';
    }

    return true;
};

export const containsString = (str) => {
    return /^(?!\s*$).+/.test(str)
        ? true
        : 'Must contain at least one non-whitespace character.';
};

/**
 * Validates a string value max length.
 *
 * @param str - The string value to be validated.
 * @param limit - The max length value of the string to be validated.
 * @returns Either an error message or `true` if the value has a valid length.
 */
export const maxLengthCheck = (str, limit) => {
    if (typeof str !== 'string') {
        return 'Input must be a string.';
    }

    return str?.length < limit ? true : `Max ${limit} characters.`;
};

const LOVELACE = 1000000;
const DECIMALS = 6;

export const correctAdaFormat = (lovelace) => {
    if (lovelace) {
        return Number.parseFloat((lovelace / LOVELACE).toFixed(DECIMALS));
    }
    return 0;
};

export function getItemFromLocalStorage(key) {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
}
