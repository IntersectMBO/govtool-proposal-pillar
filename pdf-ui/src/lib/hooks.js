import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useDebounce = (value, delay = 1000) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
};

export const ScrollToTop = ({ step }) => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [pathname, step && step]);

    return null;
};
