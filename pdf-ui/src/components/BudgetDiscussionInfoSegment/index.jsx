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
                        ul(props) {
                            const { children } = props;
                            return (
                                <ul
                                    style={{
                                        display: 'block',
                                        'list-style-type': 'disc',
                                        'margin-block-start': '1em',
                                        'margin-block-end': '1em',
                                        'margin-inline-start': '0px',
                                        'margin-inline-end': '0px',
                                        'padding-inline-start': '40px',
                                        'unicode-bidi': 'isolate',
                                    }}
                                >
                                    {children}
                                </ul>
                            );
                        },
                        li(props) {
                            const { children } = props;
                            return (
                                <li>
                                    <Typography
                                        variant='body1'
                                        component='span'
                                        style={{ wordWrap: 'break-word' }}
                                    >
                                        {children}
                                    </Typography>
                                </li>
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
