import { useEffect, useRef, useState } from 'react';
import {
    getComments,
    createComment,
    addCommentReport,
    removeCommentReport,
} from '../../lib/api';
import { formatDateWithOffset } from '../../lib/utils';
import { useAppContext } from '../../context/context';
import { useTheme } from '@emotion/react';
import {
    IconMinusCircle,
    IconPlusCircle,
    IconChat,
    IconPlus,
    IconReply,
    IconMinus,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import {
    Box,
    Button,
    Card,
    CardContent,
    Link,
    Typography,
    TextField,
    Tooltip,
    Chip,
} from '@mui/material';
import Subcomponent from './Subcomponent';
import { isCommentRestricted } from '../../lib/helpers';
import UsernameSection from './UsernameSection';

const CommentCard = ({ comment, proposal, fetchComments }) => {
    const {
        setLoading,
        walletAPI,
        user,
        setOpenUsernameModal,
        fetchDRepVotingPowerList,
    } = useAppContext();
    const theme = useTheme();
    const maxLength = 128;
    const subcommentMaxLength = 2500;
    const sliceString = (str) => {
        if (!str) return '';
        if (str.length > maxLength) {
            return str.slice(0, maxLength - 3) + '...';
        }
        return str;
    };

    const showMoreRef = useRef(null);
    const commentCardRef = useRef(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showSubcomments, setShowSubcomments] = useState(false);
    const [showMoreTopPosition, setShowMoreTopPosition] = useState(0);
    const [commentCardTopPosition, setCommentCardTopPosition] = useState(0);
    const [windowWidth, setWindowWidth] = useState(0);
    const [subcommnetsList, setSubcommnetsList] = useState([]);
    const [showReply, setShowReply] = useState(false);
    const [totalSubcomments, setTotalSubcomments] = useState(0);
    const [subCommentsPageCount, setSubCommentsPageCount] = useState(0);
    const [currentPageSubcomments, setCurrentPageSubcomments] = useState(1);
    const [subcommentText, setSubcommentText] = useState('');
    const [commentHasReplays, setCommentHasReplays] = useState(false);
    const [showReportCommentPopup, setShowReportCommentPopup] = useState(false);
    const [drepData, setDrepData] = useState(null);

    const handleGetDrepData = async () => {
        try {
            const data = await fetchDRepVotingPowerList([
                comment?.attributes?.drep_id,
            ]);

            if (!data) return;

            if (data?.length === 0) return;
            setDrepData(data[0]);
        } catch (error) {
            console.error(error);
        }
    };

    const loadSubComments = async (page = 1) => {
        try {
            let query = `filters[comment_parent_id]=${comment?.id}&pagination[page]=${page}&pagination[pageSize]=3&sort[createdAt]=desc&populate[comments_reports][populate][reporter][fields][0]=username&populate[comments_reports][populate][maintainer][fields][0]=username`;
            const { comments, pgCount, total } = await getComments(query);
            if (!comments) return;

            if (page > currentPageSubcomments) {
                setSubcommnetsList((prev) => [...prev, ...comments]);
            } else {
                if (page === 1) {
                    setCurrentPageSubcomments(1);
                }
                setSubcommnetsList(comments);
            }
            setSubCommentsPageCount(pgCount);
            setTotalSubcomments(total);
        } catch (error) {
            console.error(error);
        }
    };
    const handleCreateComment = async () => {
        setLoading(true);
        try {
            const newComment = await createComment({
                proposal_id: comment?.attributes?.proposal_id?.toString(),
                bd_proposal_id: comment?.attributes?.bd_proposal_id?.toString(),
                comment_parent_id: comment?.id?.toString(),
                comment_text: subcommentText,
            });

            if (!newComment) return;
            setSubcommentText('');
            loadSubComments(1);
            setCommentHasReplays(true);
            setShowReply(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const handleChange = (event) => {
        let value = event.target.value || '';
        if (value.length <= subcommentMaxLength) {
            setSubcommentText(value);
        }
    };
    const handleBlur = (event) => {
        const cleanedValue = event.target.value
            .replace(/[^\S\n]+/g, ' ')
            .trim();
        setSubcommentText(cleanedValue);
    };
    const isUserReporter = (curComment) => {
        try {
            return curComment.attributes.comments_reports.data.some(
                (report) => {
                    return (
                        report.attributes.moderation_status !== false &&
                        report.attributes.reporter.data.attributes.username ===
                            user.user.username
                    );
                }
            );
        } catch (e) {
            return false;
        }
    };
    const handleReportComment = async (curComment) => {
        //   setLoading(true);
        try {
            if (isUserReporter(curComment)) {
                let x = curComment.attributes.comments_reports.data.filter(
                    (report) => {
                        return (
                            report.attributes.moderation_status !== false &&
                            report.attributes.reporter.data.attributes
                                .username === user.user.username
                        );
                    }
                );
                let d = await removeCommentReport(x[0].id);
            } else {
                setShowReportCommentPopup(true);
            }
            if (curComment.id == comment.id) {
                fetchComments(1);
            } else loadSubComments(currentPageSubcomments);
        } catch (error) {
            console.error(error);
        } finally {
            // setLoading(false);
        }
    };
    const handleCloseReportPopup = () => {
        setShowReportCommentPopup(false);
    };
    const handleCancelReporting = () => {
        setShowReportCommentPopup(false);
    };
    const handleProceedReport = async (com) => {
        let x = await addCommentReport(com, user.user.id);
        if (curComment.id == comment.id) {
            fetchComments(1);
        } else loadSubComments(currentPageSubcomments);
        setShowReportCommentPopup(false);
    };

    useEffect(() => {
        if (showSubcomments) {
            loadSubComments(1);
            setCommentHasReplays(false);
        }
    }, [showSubcomments, comment]);
    useEffect(() => {
        if (window) {
            setWindowWidth(window?.innerWidth);
        }
        const handleResize = () => {
            setWindowWidth(window?.innerWidth);
        };
        window?.addEventListener('resize', handleResize);
        return () => window?.removeEventListener('resize', handleResize);
    }, [window]);

    useEffect(() => {
        if (showMoreRef.current) {
            const showMore = showMoreRef.current.getBoundingClientRect();
            setShowMoreTopPosition(showMore.top);
            const commentCard = commentCardRef.current.getBoundingClientRect();
            setCommentCardTopPosition(commentCard.top);
        }
    }, [showMoreRef, windowWidth, isExpanded]);

    useEffect(() => {
        if (comment?.attributes?.drep_id) {
            handleGetDrepData();
        } else {
            setDrepData(null);
        }
    }, [comment]);

    return (
        <Card
            sx={{
                position: 'relative',
            }}
            data-testid={`comment-${comment?.id}-card`}
        >
            <CardContent data-testid={`comment-${comment?.id}-content-card`}>
                <Box
                    display='flex'
                    mt={2}
                    ref={commentCardRef}
                    sx={{
                        position: 'relative',
                    }}
                >
                    <Box
                        width='80px'
                        display='flex'
                        flexDirection='column'
                        alignItems='center'
                    >
                        <Box
                            sx={{
                                minWidth: '24px',
                                width: '24px',
                                minHeight: '24px',
                                height: '24px',
                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                borderRadius: '50%',
                                visibility:
                                    commentHasReplays ||
                                    comment?.attributes?.subcommens_number
                                        ? 'visible'
                                        : 'hidden',
                            }}
                        ></Box>

                        <Box
                            sx={{
                                width: '1px',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                marginTop: '4px',
                                visibility:
                                    commentHasReplays ||
                                    comment?.attributes?.subcommens_number
                                        ? 'visible'
                                        : 'hidden',
                            }}
                        ></Box>

                        {commentHasReplays ||
                        comment?.attributes?.subcommens_number ? (
                            <Box
                                sx={{
                                    py: '4px',
                                    position: 'absolute',
                                    maxHeight: '32px',
                                    top: `${
                                        showMoreTopPosition -
                                        commentCardTopPosition +
                                        20
                                    }px`,
                                    backgroundColor: '#fff',
                                }}
                            >
                                {showSubcomments ? (
                                    <IconMinusCircle
                                        width='24'
                                        height='24'
                                        fill={theme.palette.primary.main}
                                        onClick={() =>
                                            setShowSubcomments((prev) => !prev)
                                        }
                                        cursor={'pointer'}
                                    />
                                ) : (
                                    <IconPlusCircle
                                        width='24'
                                        height='24'
                                        fill={theme.palette.primary.main}
                                        onClick={() =>
                                            setShowSubcomments((prev) => !prev)
                                        }
                                        cursor={'pointer'}
                                    />
                                )}
                            </Box>
                        ) : null}
                    </Box>
                    <Box
                        sx={{
                            width: '100%',
                            // display: "flex",
                            // width="100%"
                            // justifyContent:"space-between"
                        }}
                    >
                        <UsernameSection
                            drepData={drepData}
                            comment={comment}
                        />

                        <Box
                            width={'100%'}
                            display={'flex'}
                            justifyContent={'space-between'}
                        >
                            <Typography variant='overline'>
                                {formatDateWithOffset(
                                    new Date(comment?.attributes?.createdAt),
                                    0,
                                    'dd/MM/yyyy - p',
                                    'UTC'
                                )}
                            </Typography>
                            <Tooltip
                                title='Report inappropriate comment'
                                arrow
                                placement='top'
                            >
                                <Box>
                                    <Typography variant='body2' float='right'>
                                        {/* <Link onClick={() =>handleReportComment(comment)} >{isUserReporter(comment)?"Comment reported" : "Report comment"}</Link> */}
                                    </Typography>
                                    {/* <IconFlag
                                        id={"report-flag-"+comment?.id}
                                        width={24}
                                        height={24}
                                        fill={isUserReporter(comment) ? 'red' : 'none'}
                                        stroke={isUserReporter(comment) ? 'red' : theme.palette.text.secondary}
                                        onClick={() => handleReportComment(comment)}
                                        sx={{
                                            cursor: 'pointer',
                                            marginLeft: 1,
                                        }}
                                    /> */}
                                </Box>
                            </Tooltip>
                        </Box>
                        <Typography
                            variant='body2'
                            sx={{
                                maxWidth: '100%',
                                wordWrap: 'break-word',
                                whiteSpace: 'pre-line',
                            }}
                            data-testid={`comment-${comment?.id}-content`}
                            ref={showMoreRef}
                        >
                            {isCommentRestricted(comment) === false
                                ? isExpanded
                                    ? comment?.attributes?.comment_text
                                    : sliceString(
                                          comment?.attributes?.comment_text
                                      ) || ''
                                : 'Restricted comment due to reports'}
                        </Typography>

                        {comment?.attributes?.comment_text?.length >
                            maxLength && (
                            <Box mt={2}>
                                <Link
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    sx={{
                                        cursor: 'pointer',
                                    }}
                                >
                                    {isExpanded
                                        ? 'Show less'
                                        : 'Read full comment'}
                                </Link>
                            </Box>
                        )}

                        <Box
                            display={'flex'}
                            justifyContent={'space-between'}
                            alignItems={'center'}
                            flexDirection={'row'}
                            mt={2}
                            sx={{
                                px: 2,
                                py: 1,
                                backgroundColor: '#D6D8FF1F',
                                borderRadius: 4,
                            }}
                        >
                            <Box display={'flex'} alignItems={'center'}>
                                <IconChat width={24} height={24} />
                                <Typography variant='body2' marginLeft={1}>
                                    {totalSubcomments > 0
                                        ? totalSubcomments
                                        : comment?.attributes
                                              ?.subcommens_number || 0}
                                </Typography>
                            </Box>
                            {proposal?.attributes?.content?.attributes
                                ?.prop_submitted ? null : (
                                <Button
                                    variant='outlined'
                                    startIcon={
                                        showReply ? (
                                            <IconMinus
                                                fill={
                                                    theme.palette.primary.main
                                                }
                                            />
                                        ) : (
                                            <IconPlus
                                                fill={
                                                    theme.palette.primary.main
                                                }
                                            />
                                        )
                                    }
                                    onClick={() =>
                                        setShowReply((prev) => !prev)
                                    }
                                    data-testid='reply-button'
                                >
                                    {showReply ? 'Cancel' : 'Reply'}
                                </Button>
                            )}
                        </Box>

                        {showReply && (
                            <Box>
                                <TextField
                                    fullWidth
                                    sx={{
                                        mt: 1,
                                    }}
                                    size='large'
                                    name='subcomment'
                                    label=''
                                    placeholder='Add comment'
                                    maxRows={5}
                                    multiline
                                    value={subcommentText || ''}
                                    variant='outlined'
                                    onChange={(e) => handleChange(e)}
                                    onBlur={handleBlur}
                                    inputProps={{
                                        maxLength: subcommentMaxLength,
                                        spellCheck: 'false',
                                        autoCorrect: 'off',
                                        autoCapitalize: 'none',
                                        autoComplete: 'off',
                                    }}
                                    helperText={
                                        <Typography
                                            variant='caption'
                                            sx={{
                                                float: 'right',
                                                mr: 2,
                                                color: (theme) =>
                                                    subcommentText?.length ===
                                                        subcommentMaxLength &&
                                                    theme?.palette?.error?.main,
                                            }}
                                        >
                                            {`${
                                                subcommentText?.length || 0
                                            }/${subcommentMaxLength}`}
                                        </Typography>
                                    }
                                    InputProps={{
                                        inputProps: {
                                            maxLength: subcommentMaxLength,
                                            'data-testid': 'reply-input',
                                        },
                                    }}
                                />

                                <Box
                                    display={'flex'}
                                    justifyContent={'flex-end'}
                                    mt={1}
                                >
                                    <Button
                                        variant='contained'
                                        onClick={
                                            user?.user?.govtool_username
                                                ? () => {
                                                      handleCreateComment();
                                                      setShowSubcomments(true);
                                                  }
                                                : () =>
                                                      setOpenUsernameModal({
                                                          open: true,
                                                          callBackFn: () => {},
                                                      })
                                        }
                                        disabled={
                                            !subcommentText ||
                                            !walletAPI?.address
                                        }
                                        endIcon={
                                            <IconReply
                                                height={18}
                                                width={18}
                                                fill={
                                                    !subcommentText ||
                                                    !walletAPI?.address
                                                        ? 'rgba(0,0,0, 0.26)'
                                                        : 'white'
                                                }
                                            />
                                        }
                                        data-testid='reply-comment-button'
                                    >
                                        Comment
                                    </Button>
                                </Box>
                            </Box>
                        )}

                        {showSubcomments &&
                            subcommnetsList?.map((subcomment, index) => (
                                <Subcomponent
                                    key={index}
                                    comment={subcomment}
                                />
                            ))}

                        {showSubcomments &&
                            currentPageSubcomments < subCommentsPageCount && (
                                <Box
                                    marginY={2}
                                    display={'flex'}
                                    justifyContent={'flex-end'}
                                >
                                    <Button
                                        onClick={() => {
                                            loadSubComments(
                                                currentPageSubcomments + 1
                                            );
                                            setCurrentPageSubcomments(
                                                (prev) => prev + 1
                                            );
                                        }}
                                    >
                                        Load more
                                    </Button>
                                </Box>
                            )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};
export default CommentCard;
