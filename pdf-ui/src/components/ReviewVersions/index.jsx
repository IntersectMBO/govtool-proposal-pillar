'use client';

import {
    Dialog,
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Link,
    IconButton,
} from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';
import {
    IconCheveronLeft,
    IconArchive,
    IconLink,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import { formatIsoDate, formatIsoTime, openInNewTab } from '../../lib/utils';
import { useEffect, useState } from 'react';
import { getProposals } from '../../lib/api';
import ReactMarkdown from 'react-markdown';

const ReviewVersions = ({ open, onClose, id }) => {
    const theme = useTheme();
    const openLink = (link) => openInNewTab(link);

    const [versions, setVersions] = useState(null);
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [openVersionsList, setOpenVersionsList] = useState(false);

    const isSmallScreen = useMediaQuery((theme) =>
        theme.breakpoints.down('md')
    );

    const handleOpenVersionsList = () => setOpenVersionsList(true);
    const handleCloseVersionsList = () => setOpenVersionsList(false);

    const fetchVersions = async () => {
        try {
            let query = `filters[$and][0][prop_id]=${id}&pagination[page]=1&pagination[pageSize]=25&sort[createdAt]=desc&populate[0]=proposal_links&populate[1]=proposal_withdrawals`;
            const { proposals } = await getProposals(query);
            if (!proposals) return;

            setVersions(proposals);
            setSelectedVersion(proposals[0]);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (open) {
            fetchVersions();
        }
    }, [open]);

    return (
        <Typography>
        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
            data-testid='review-versions'
        >
            {isSmallScreen && openVersionsList ? (
                <Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            borderBottom: `1px solid ${theme.palette.border.lightGray}`,
                            paddingBottom: 2,
                            marginX: 2,
                            marginTop: 2,
                            gap: 2,
                        }}
                    >
                        <IconArchive height='24px' width='24px' />
                        <Typography variant='h4' component='h1'>
                            Versions
                        </Typography>
                    </Box>
                    <List>
                        {versions?.map((version, index) => (
                            <ListItem
                                key={version?.attributes?.content?.id || index}
                                disablePadding
                                sx={{
                                    backgroundColor:
                                        version?.attributes?.content?.id ===
                                        selectedVersion?.attributes?.content?.id
                                            ? theme.palette.highlight.blueGray
                                            : 'transparent',
                                }}
                            >
                                <ListItemButton
                                    onClick={() => {
                                        setSelectedVersion(version);
                                        handleCloseVersionsList();
                                    }}
                                    data-testid='review-versions-list-item-button'
                                >
                                    <ListItemText
                                        primary={
                                            <Box>
                                                {`${formatIsoDate(
                                                    version?.attributes?.content
                                                        ?.attributes?.createdAt
                                                )}  ${formatIsoTime(
                                                    version?.attributes?.content
                                                        ?.attributes?.createdAt
                                                )} ${
                                                    version?.attributes?.content
                                                        ?.attributes
                                                        ?.prop_rev_active
                                                        ? ' (Live)'
                                                        : ''
                                                }`}
                                            </Box>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            ) : (
                <Grid
                    container
                    sx={{
                        overflow: 'auto',
                        minHeight: 0,
                    }}
                >
                    <Grid
                        item
                        xs={12}
                        sx={{
                            borderBottom: `1px solid ${theme.palette.border.gray}`,
                            pl: 4,
                            mt: 2,
                        }}
                    >
                        <Typography variant='h4' component='h1' gutterBottom>
                            View Versions
                        </Typography>
                    </Grid>

                    <Grid item xs={12} m={2}>
                        <Button
                            size='small'
                            startIcon={
                                <IconCheveronLeft
                                    width='18'
                                    height='18'
                                    fill={theme.palette.primary.main}
                                />
                            }
                            onClick={onClose}
                            data-testid='review-versions-back'
                        >
                            Back
                        </Button>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container spacing={2} px={2}>
                            <Grid item xs={2}></Grid>
                            {!isSmallScreen && (
                                <Grid
                                    item
                                    xs={2}
                                    sx={{
                                        padding: 0,
                                        marginRight: 0,
                                        marginLeft: 2,
                                    }}
                                >
                                    <Card variant='outlined'>
                                        <CardContent
                                            sx={{
                                                padding: 0,
                                                width: '100%',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent:
                                                        'flex-start',
                                                    alignContent: 'center',
                                                    borderBottom: `1px solid ${theme.palette.border.lightGray}`,
                                                    gap: 2,
                                                    m: 2,
                                                    pb: 1,
                                                }}
                                            >
                                                <IconArchive
                                                    height='24px'
                                                    width='24px'
                                                />
                                                <Typography variant='subtitle1'>
                                                    Versions
                                                </Typography>
                                            </Box>
                                            {/* Versions */}
                                            <List sx={{ padding: 0 }}>
                                                {versions?.map(
                                                    (version, index) => (
                                                        <ListItem
                                                            key={
                                                                version
                                                                    ?.attributes
                                                                    ?.content
                                                                    ?.id ||
                                                                index
                                                            }
                                                            disablePadding
                                                            sx={{
                                                                backgroundColor:
                                                                    version
                                                                        ?.attributes
                                                                        ?.content
                                                                        ?.id ===
                                                                    selectedVersion
                                                                        ?.attributes
                                                                        ?.content
                                                                        ?.id
                                                                        ? theme
                                                                              .palette
                                                                              .highlight
                                                                              .blueGray
                                                                        : 'transparent',
                                                            }}
                                                        >
                                                            <ListItemButton
                                                                onClick={() =>
                                                                    setSelectedVersion(
                                                                        version
                                                                    )
                                                                }
                                                            >
                                                                <ListItemText
                                                                    primary={
                                                                        <>
                                                                            <div>
                                                                                {`${formatIsoDate(
                                                                                    version
                                                                                        ?.attributes
                                                                                        ?.content
                                                                                        ?.attributes
                                                                                        ?.createdAt
                                                                                )}${
                                                                                    version
                                                                                        ?.attributes
                                                                                        ?.content
                                                                                        ?.attributes
                                                                                        ?.prop_rev_active
                                                                                        ? ' (Live)'
                                                                                        : ''
                                                                                }`}
                                                                            </div>
                                                                            <div>
                                                                                {formatIsoTime(
                                                                                    version
                                                                                        ?.attributes
                                                                                        ?.content
                                                                                        ?.attributes
                                                                                        ?.createdAt
                                                                                )}
                                                                            </div>
                                                                        </>
                                                                    }
                                                                />
                                                            </ListItemButton>
                                                        </ListItem>
                                                    )
                                                )}
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )}
                            {/* Selected version content */}
                            <Grid item xs={12} md={6} zIndex={1}>
                                <Box display={'flex'} width={'100%'}>
                                    <Card
                                        variant='outlined'
                                        sx={{ width: '100%' }}
                                    >
                                        <CardContent>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    textAlign: 'justify',
                                                    gap: 2,
                                                }}
                                            >
                                                <Typography
                                                    variant='h5'
                                                    gutterBottom
                                                >
                                                    {
                                                        selectedVersion
                                                            ?.attributes
                                                            ?.content
                                                            ?.attributes
                                                            ?.prop_name
                                                    }
                                                </Typography>
                                                {isSmallScreen ? (
                                                    <Box>
                                                        <Typography
                                                            variant='body1'
                                                            color={
                                                                theme.palette
                                                                    .text.grey
                                                            }
                                                        >
                                                            Version Date
                                                        </Typography>
                                                        <Typography
                                                            variant='body1'
                                                            gutterBottom
                                                        >
                                                            {`${formatIsoDate(
                                                                selectedVersion
                                                                    ?.attributes
                                                                    ?.content
                                                                    ?.attributes
                                                                    ?.createdAt
                                                            )}${
                                                                selectedVersion
                                                                    ?.attributes
                                                                    ?.content
                                                                    ?.attributes
                                                                    ?.prop_rev_active
                                                                    ? ' (Live)'
                                                                    : ''
                                                            }`}
                                                        </Typography>
                                                    </Box>
                                                ) : null}
                                                <Box>
                                                    <Typography
                                                        variant='body1'
                                                        color={
                                                            theme.palette.text
                                                                .grey
                                                        }
                                                    >
                                                        Goverance Action Type
                                                    </Typography>
                                                    <Typography
                                                        variant='body1'
                                                        gutterBottom
                                                    >
                                                        {
                                                            selectedVersion
                                                                ?.attributes
                                                                ?.content
                                                                ?.attributes
                                                                ?.gov_action_type
                                                                ?.attributes
                                                                ?.gov_action_type_name
                                                        }
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography
                                                        variant='body1'
                                                        color={
                                                            theme.palette.text
                                                                .grey
                                                        }
                                                    >
                                                        Abstract
                                                    </Typography>
                                                    <ReactMarkdown
                                                        components={{
                                                            p(props) {
                                                                const {
                                                                    children,
                                                                } = props;
                                                                return (
                                                                    <Typography
                                                                        variant='body1'
                                                                        style={{
                                                                            wordWrap:
                                                                                'break-word',
                                                                        }}
                                                                    >
                                                                        {
                                                                            children
                                                                        }
                                                                    </Typography>
                                                                );
                                                            },
                                                        }}
                                                    >
                                                        {selectedVersion
                                                            ?.attributes
                                                            ?.content
                                                            ?.attributes
                                                            ?.prop_abstract ||
                                                            ''}
                                                    </ReactMarkdown>
                                                </Box>
                                                <Box>
                                                    <Typography
                                                        variant='body1'
                                                        color={
                                                            theme.palette.text
                                                                .grey
                                                        }
                                                    >
                                                        Motivation
                                                    </Typography>
                                                    <ReactMarkdown
                                                        components={{
                                                            p(props) {
                                                                const {
                                                                    children,
                                                                } = props;
                                                                return (
                                                                    <Typography
                                                                        variant='body1'
                                                                        style={{
                                                                            wordWrap:
                                                                                'break-word',
                                                                        }}
                                                                    >
                                                                        {
                                                                            children
                                                                        }
                                                                    </Typography>
                                                                );
                                                            },
                                                        }}
                                                    >
                                                        {selectedVersion
                                                            ?.attributes
                                                            ?.content
                                                            ?.attributes
                                                            ?.prop_motivation ||
                                                            ''}
                                                    </ReactMarkdown>
                                                </Box>
                                                <Box>
                                                    <Typography
                                                        variant='body1'
                                                        color={
                                                            theme.palette.text
                                                                .grey
                                                        }
                                                    >
                                                        Rationale
                                                    </Typography>

                                                    <ReactMarkdown
                                                        components={{
                                                            p(props) {
                                                                const {
                                                                    children,
                                                                } = props;
                                                                return (
                                                                    <Typography
                                                                        variant='body1'
                                                                        style={{
                                                                            wordWrap:
                                                                                'break-word',
                                                                        }}
                                                                    >
                                                                        {
                                                                            children
                                                                        }
                                                                    </Typography>
                                                                );
                                                            },
                                                        }}
                                                    >
                                                        {selectedVersion
                                                            ?.attributes
                                                            ?.content
                                                            ?.attributes
                                                            ?.prop_rationale ||
                                                            ''}
                                                    </ReactMarkdown>
                                                </Box>

                                                {selectedVersion?.attributes
                                                    ?.content?.attributes
                                                    ?.proposal_links?.length >
                                                    0 && (
                                                    <Box>
                                                        <Typography
                                                            variant='body1'
                                                            color={
                                                                theme.palette
                                                                    .text.grey
                                                            }
                                                        >
                                                            Supporting links
                                                        </Typography>
                                                        <Box
                                                            display='flex'
                                                            flexDirection={
                                                                isSmallScreen
                                                                    ? 'column'
                                                                    : 'row'
                                                            }
                                                            flexWrap='wrap'
                                                            gap={2}
                                                        >
                                                            {selectedVersion?.attributes?.content?.attributes?.proposal_links?.map(
                                                                (
                                                                    link,
                                                                    index
                                                                ) => (
                                                                    <Box
                                                                        key={
                                                                            index
                                                                        }
                                                                        display='flex'
                                                                        flexDirection='row'
                                                                        alignItems='center'
                                                                        component={
                                                                            Button
                                                                        }
                                                                        onClick={() =>
                                                                            openLink(
                                                                                link?.prop_link
                                                                            )
                                                                        }
                                                                    >
                                                                        <Box
                                                                            mr={
                                                                                0.5
                                                                            }
                                                                        >
                                                                            <IconLink
                                                                                fill={
                                                                                    theme
                                                                                        .palette
                                                                                        .primary
                                                                                        .main
                                                                                }
                                                                            />
                                                                        </Box>
                                                                        <Typography
                                                                            variant='body2'
                                                                            component='span'
                                                                            data-testid={`link-${index}-text-content`}
                                                                        >
                                                                            {
                                                                                link?.prop_link_text
                                                                            }
                                                                        </Typography>
                                                                    </Box>
                                                                )
                                                            )}
                                                        </Box>
                                                    </Box>
                                                )}
                                            </Box>

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: isSmallScreen
                                                        ? 'column'
                                                        : 'row',
                                                    justifyContent:
                                                        'space-between',
                                                    mt: 10,
                                                }}
                                            >
                                                <Box>
                                                    <Button
                                                        variant='outlined'
                                                        sx={{
                                                            mb: {
                                                                xs: 2,
                                                                md: 0,
                                                            },
                                                        }}
                                                        onClick={onClose}
                                                        data-testid='back-button'
                                                    >
                                                        Back to Proposal
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>

                                    {isSmallScreen && (
                                        <Box
                                            ml={2}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor:
                                                    theme.palette.iconButton
                                                        .lightPeriwinkle,
                                                borderRadius: '16px',
                                                width: '40px',
                                                height: '40px',
                                                boxShadow:
                                                    '0px 4px 15px 0px #DDE3F5',
                                            }}
                                        >
                                            <IconButton
                                                onClick={handleOpenVersionsList}
                                                data-testid='versions-button'
                                            >
                                                <IconArchive />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </Dialog>
        </Typography>
    );
};

export default ReviewVersions;
