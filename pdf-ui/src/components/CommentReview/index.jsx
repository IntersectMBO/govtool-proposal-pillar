import { useEffect, useState } from 'react';
import { getCommentReportByHash, approveCommentReport, removeComment, getComments } from '../../lib/api';
import { formatDateWithOffset } from '../../lib/utils';
import { useAppContext } from '../../context/context';
import { useTheme } from '@emotion/react';
import {
    IconFlag,
    IconCheckCircle,
    IconExclamationCircle,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Tooltip,
    Link
} from '@mui/material';
import { CommentReportPopup} from '../../components'

const CommentReview = ({ reportHash }) => {
    const { setLoading, user } = useAppContext();
    const theme = useTheme();
    const [commentReport, setCommentReport] = useState(null);
    const [comment, setComment] = useState(null);
 
    useEffect(() => {
        console.log(comment, commentReport, reportHash);
        const fetchCommentReport = async () => {
            setLoading(true);
            try {
                let query = `filters[comments_reports][hash][$eq]=${reportHash}&populate[comments_reports][populate][reporter]=*`;
                const comm = await getComments(query);
                setCommentReport(comm.comments[0].attributes.comments_reports.data[0]);
                setComment(comm.comments[0]);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if (reportHash) {
            fetchCommentReport();
        }
    }, [reportHash]);

    const handleApproveComment = async () => {
     //   setLoading(true);
        try {
          //  await approveCommentReport(commentReport.id);
            // Optionally, you can fetch the updated report or handle UI changes
        } catch (error) {
            console.error(error);
        } finally {
      //      setLoading(false);
        }
    };

    const handleRemoveComment = async () => {
    //    setLoading(true);
        try {
           // await removeComment(comment.id);
            // Optionally, you can handle UI changes after removal
        } catch (error) {
            console.error(error);
        } finally {
        //    setLoading(false);
        }
    };

    if (!commentReport || !comment) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">Comment Review</Typography>
                <Box mt={2}>
                    <Typography variant="body1">
                        <strong>Comment:</strong> {comment.attributes.comment_text}
                        {"  "}<Link href='/proposal_discussion/8047'>View on GovTool</Link>
                    </Typography>
                    
                    <Typography variant="body1">
                        <strong>Comment creator:</strong> {comment.attributes.user_govtool_username}
                    </Typography>
                    {/* <Typography variant="body2">
                        <strong>Reported by:</strong> {commentReport.attributes.reporter.data.attributes.govtool_username}
                    </Typography>
                    <Typography variant="body2">]
                        <strong>Reported on:</strong> {formatDateWithOffset(commentReport.attributes.createdAt)}
                    </Typography> */}
                    { comment.attributes.comments_reports.data.length } Flag{comment.attributes.comments_reports.data.length>1?"s":""} - Latest {new Date(comment.attributes.comments_reports.data[comment.attributes.comments_reports.data.length-1].attributes.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                    })}
                </Box>
                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button
                        variant="outlined"
                        //startIcon={<IconCheckCircle />}
                        onClick={handleApproveComment}
                    >
                        Do not remove
                    </Button>
                    <Button
                        variant="contained"
                       // color="error"
                        //startIcon={<IconExclamationCircle />}
                        onClick={handleRemoveComment}
                    >
                        Remove Comment
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CommentReview;