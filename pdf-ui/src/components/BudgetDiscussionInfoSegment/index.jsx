import React from 'react';

import { Box, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
const BudgetDiscussionInfoSegment = ({ question, answer }) => {
    return (
        <Box mt={3}>
            <Typography
                variant='caption'
                sx={{
                    color: (theme) => theme?.palette?.text?.grey,
                }}
            >
                {question}
            </Typography>
            <ReactMarkdown
                components={{
                    p(props) {
                        const { children } = props;
                        return (
                            <Typography
                                variant='body1'
                                style={{
                                    wordWrap: 'break-word',
                                }}
                            >
                                {children}
                            </Typography>
                        );
                    },
                }}
            >
                {answer?.toString() || '-'}
            </ReactMarkdown>
        </Box>
    );
};

export default BudgetDiscussionInfoSegment;
