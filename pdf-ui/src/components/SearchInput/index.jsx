import { useEffect, useState } from 'react';

import { useDebounce } from '../../lib/hooks';
import { InputAdornment, TextField } from '@mui/material';
import { IconSearch } from '@intersect.mbo/intersectmbo.org-icons-set';
import { useTheme } from '@emotion/react';

const SearchInput = ({ onDebouncedChange, placeholder = 'Search...' }) => {
    const theme = useTheme();
    const [inputValue, setInputValue] = useState('');
    const debouncedInputValue = useDebounce(inputValue);

    useEffect(() => {
        onDebouncedChange(debouncedInputValue);
    }, [debouncedInputValue, onDebouncedChange]);

    return (
        <TextField
            fullWidth
            id='outlined-basic'
            placeholder={placeholder}
            variant='outlined'
            value={inputValue || ''}
            onChange={(e) => setInputValue(e?.target?.value)}
            InputProps={{
                startAdornment: (
                    <InputAdornment position='start'>
                        <IconSearch
                            color={theme.palette.primary.icons.black}
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
                            color: (theme) => theme.palette.text.grey,
                            opacity: 1,
                        },
                    },
                },
            }}
        />
    );
};

export default SearchInput;
