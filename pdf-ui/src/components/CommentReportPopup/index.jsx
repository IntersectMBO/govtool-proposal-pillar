import React from 'react';
import { Card, Box, Typography, Link, Button, Grid } from '@mui/material';

const CommentReportPopup = ({commentId, onReport, onCancel }) => {
    const handleCancel = () => {
        onCancel();
    };

    const handleReport = (commentId) => {
        onReport(commentId);
    };

    return (
        
        <Card
            display={'flex'}
           // flexDirection={'column'}
         //   justifyContent={'center'}
           // alignItems={'center'}
            sx={{ p: 3 }}
        >
            <Box>
                <Typography variant="h5" sx={{ mt: 2 }}>
                    Report Comment
                </Typography>
            </Box>
            <Box textAlign={'left'} width={'100%'} sx={{ mt: 2 }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    If you feel this comment is contrary to our content policies, or is in {'\n'}
                    your view inappropriate, you can report it, and it will be reviewed. {'\n'}
                    See our <Link href="#">comment policy</Link> for more details.
                </Typography>
            </Box>
            <Box width={'100%'} sx={{ mt: 3 }}>
                <Grid container justifyContent="space-between" > 
                    <Grid item>
                        <Button
                            variant="outlined"
                            onClick={() =>handleCancel()}
                            data-testid="cancel-button"
                        >
                            Cancel
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            onClick={() =>handleReport(commentId)}
                            data-testid="report-button"
                        >
                            Report comment
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Card>
    );
};

export default CommentReportPopup;