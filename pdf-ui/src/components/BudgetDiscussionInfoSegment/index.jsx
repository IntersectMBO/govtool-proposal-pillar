import React from 'react';

import { Box, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import MarkdownTypography from '../../lib/markdownRenderer';
const BudgetDiscussionInfoSegment = ({
    question,
    answer,
    show = true,
    answerTestId,
}) => {
    if (!show) {
        return null;
    }
    return (
        <Box mb={3}>
            <Typography
                variant='caption'
                sx={{
                    color: (theme) => theme?.palette?.text?.grey,
                }}
            >
                {question}
            </Typography>
            <MarkdownTypography testId={`${answerTestId}`} content={answer} />
        </Box>
    );
};

export default BudgetDiscussionInfoSegment;
