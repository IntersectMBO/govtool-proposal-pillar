import React from 'react';

import { Box, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
const BudgetDiscussionInfoSegment = ({ question, answer, show = true ,answerTestId}) => {
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
                <div data-testid={answerTestId}>
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
            </div>
        </Box>
    );
};

export default BudgetDiscussionInfoSegment;
