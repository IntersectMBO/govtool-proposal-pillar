'use client';

import React from 'react';
import { CommentReview } from '../../components'
import { Box, Button, Typography } from '@mui/material';
const CommentReviewPage = ({ reportHash }) => {
    return (
        <Box>
           <CommentReview reportHash={reportHash}></CommentReview>
        </Box>
    );
};
export default CommentReviewPage;
