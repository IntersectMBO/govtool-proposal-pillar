import React from 'react';

import { Box, Typography } from '@mui/material';
const BudgetDiscussionInfoSegment = ({ question, answer }) => {
    return (
        <Box mt={4}>
            <Typography
                variant='caption'
                sx={{
                    color: (theme) => theme?.palette?.text?.grey,
                }}
            >
                {question}
            </Typography>
            <Typography variant='body1'>{answer}</Typography>
        </Box>
    );
};

export default BudgetDiscussionInfoSegment;
