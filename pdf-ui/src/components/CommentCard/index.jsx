import { useEffect, useRef, useState } from 'react';
import { getComments, createComment } from '../../lib/api';
import { formatPollDateDisplay } from '../../lib/utils';
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
} from '@mui/material';

const CommentCard = ({ comment, proposal }) => {
    const { setLoading, walletAPI, user, setOpenUsernameModal } =
        useAppContext();
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

    const loadSubComments = async (page = 1) => {
        try {
            let query = `filters[comment_parent_id]=${comment?.id}&pagination[page]=${page}&pagination[pageSize]=3&sort[createdAt]=desc`;
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
        let value = event.target.value;
        

        if (value.length <= subcommentMaxLength) {
            setSubcommentText(value);
        }
    };
    const handleBlur = (event) => {
        const cleanedValue = event.target.value.replace(/[^\S\n]+/g, ' ').trim();
        setSubcommentText(cleanedValue);
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
    }, []);

    useEffect(() => {
        if (showMoreRef.current) {
            const showMore = showMoreRef.current.getBoundingClientRect();
            setShowMoreTopPosition(showMore.top);
            const commentCard = commentCardRef.current.getBoundingClientRect();
            setCommentCardTopPosition(commentCard.top);
        }
    }, [showMoreRef, windowWidth, isExpanded]);

    const SubCommentContent = ({ comment }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        return (
            <Box
                display='flex'
                mt={2}
                sx={{
                    position: 'relative',
                }}
                data-testid={`subcomment-${comment?.id}-content`}
            >
                <Box
                    sx={{
                        width: '100%',
                    }}
                >
                    <Typography variant='h6'>
                        @{comment?.attributes?.user_govtool_username || ''}
                    </Typography>
                    <Typography variant='overline'>
                        {formatPollDateDisplay(comment?.attributes?.createdAt)}
                    </Typography>
                    <Typography
                        variant='body2'
                        sx={{
                            maxWidth: '100%',
                            wordWrap: 'break-word',
                        }}
                    >
                        {isExpanded
                            ? comment?.attributes?.comment_text
                            : sliceString(comment?.attributes?.comment_text) ||
                              ''}
                    </Typography>

                    {comment?.attributes?.comment_text?.length > maxLength && (
                        <Box mt={2}>
                            <Link
                                onClick={() => setIsExpanded(!isExpanded)}
                                sx={{
                                    cursor: 'pointer',
                                }}
                            >
                                {isExpanded ? 'Show less' : 'Read full comment'}
                            </Link>
                        </Box>
                    )}
                </Box>
            </Box>
        );
    };

    return (
        <Card
            sx={{
                position: 'relative',
            }}
            data-testid={`comment-${comment?.id}-card`}
        >
            <CardContent data-testid={`comment-${comment?.id}-content`}>
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
                        }}
                    >
                        <Typography variant='h6'>
                            @{comment?.attributes?.user_govtool_username || ''}
                        </Typography>
                        <Typography variant='overline'>
                            {formatPollDateDisplay(
                                comment?.attributes?.createdAt
                            )}
                        </Typography>
                        <Typography
                            variant='body2'
                            sx={{
                                maxWidth: '100%',
                                wordWrap: 'break-word',
                            }}
                            ref={showMoreRef}
                        >
                            {isExpanded
                                ? comment?.attributes?.comment_text
                                : sliceString(
                                      comment?.attributes?.comment_text
                                  ) || ''}
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
                                <SubCommentContent
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
